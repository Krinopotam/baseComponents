import './grid.css';

import {IButtonsRowApi, IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {ColumnsType} from 'antd/es/table';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {ExpandableConfig, Key} from 'antd/es/table/interface';
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {TableProps} from 'antd';
import {getUuid} from 'helpers/helpersString';
import {isElementVisible} from 'helpers/helpersDOM';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IGridApi, useInitGridApi} from './hooks/api';
import {useInitButtons} from 'baseComponents/grid/hooks/buttons';
import {useClickAway} from 'ahooks';
import {GridRender} from 'baseComponents/grid/renders/gridRender';

//region Types
type ITableProps = TableProps<Record<string, unknown>>;

export interface IGridProps {
    /** Grid Id */
    id?: string;

    /** Grid columns */
    columns?: ColumnsType<Record<string, unknown>>;

    /** Grid data set */
    dataSet?: IGridRowData[];

    // !TODO разобраться с костылем
    dataStoreDelete?: IApiAction;

    /** Grid height */
    bodyHeight?: number | string | 'fill';

    /** Grid class name */
    className?: string;

    /** table style size */
    size?: 'small' | 'middle' | 'large';

    /** Is grid has sticky header */
    sticky?: IStickyProps | boolean;

    buttons?: Record<'view' | 'create' | 'clone' | 'update' | 'delete', IFormButton | null> | IFormButtons;

    /** Offset for sticky buttons*/
    buttonsStickyOffset?: number;

    /** Table can't be edited */
    readonly?: boolean;

    /** Edit modal controls parameters */
    editFormProps?: IDFormModalProps;

    /** Rows multiSelect */
    multiSelect?: boolean;

    /** Disable row hover effect */
    noHover?: boolean;

    /** Row selection additional parameters */
    rowSelection?: IGridRowSelection<IGridRowData>;

    /** Grid callbacks */
    callbacks?: IGridCallbacks;

    /** Confirm message before rows delete */
    rowDeleteMessage?: React.ReactNode;

    /** Should confirm before delete */
    confirmDelete?: boolean;

    /** Expandable grid */
    expandable?: ExpandableConfig<Record<string, unknown>>;

    /** Grid summary row */
    summary?: ITableProps['summary'];

    /** Grid title */
    title?: ITableProps['title'];

    /** Grid footer renderer - function(currentPageData) */
    footer?: ITableProps['footer'];

    /** Whether to show all table borders (true) */
    bordered?: boolean;

    /** Whether to show header (true) */
    showHeader?: boolean;

    /** Grid style */
    style?: React.CSSProperties;

    /** The header show next sorter direction tooltip. It will be set as the property of Tooltip if its type is object -boolean | Tooltip props (true) */
    showSorterTooltip?: ITableProps['showSorterTooltip'];

    /** The table-layout attribute of table element	- | auto | fixed  Fixed when header/columns are fixed, or using column.ellipsis	 */
    tableLayout?: ITableProps['tableLayout'];

    /** The render container of dropdowns in table (triggerNode) => HTMLElement() => TableHtmlElement */
    getPopupContainer?: ITableProps['getPopupContainer'];

    /**	Loading status of table	boolean | Spin Props (false) */
    loading?: ITableProps['loading'];

    /** Additional class name for row */
    rowClassName?: ITableProps['rowClassName'];
}

interface IStickyProps {
    getContainer?: () => HTMLElement | Window;
    offsetHeader?: number;
    offsetScroll?: number;
}

export interface IGridCallbacks {
    /** Fires when menu visibility status changed */
    onMenuVisibilityChanged: (isVisible: boolean) => void;

    /** Fires, when dataSet changes */
    onDataSetChange?: (dataSet: IGridRowData[]) => void;

    /** Callback executed when selected rows change */
    onSelectionChange?: (selectedRowKeys: IGridRowData['id'][], selectedRows: IGridRowData[]) => void;

    /** Callback executed when pagination, filters or sorter is changed -function (pagination, filters, sorter, extra: { currentDataSource: [], action: paginate | sort | filter })	 */
    onChange?: TableProps<Record<string, unknown>>['onChange'];

    /** Set props on per header row - function(columns, index) */
    onHeaderRow?: TableProps<Record<string, unknown>>['onHeaderRow'];

    /** Callback executed when selected rows change */
    onDelete?: (selectedRows: IGridRowData[]) => void;
}

export interface IGridRowData extends Record<string, unknown> {
    /** Row id */
    id: string | number;
    children?: IGridRowData[];
}

export type IGridRowsMap = Record<string, IGridRowData>;

export interface IGridDataSource {
    method: 'post';
    url: string;
    parameters: {
        action: string;
        method: string;
        data: {
            limit?: number;
            search?: string;
            parentId?: string;
        };
    };
}

export interface IGridRowSelection<T> {
    /** Show selection column */
    showSelectionColumn?: boolean;

    /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
    preserveSelectedRowKeys?: boolean;

    /** Hide the selectAll checkbox and custom selection */
    hideSelectAll?: boolean;

    /** Fixed selection column on the left */
    fixed?: boolean;

    /** Set the width of the selection column */
    columnWidth?: string | number;

    /** Set the title  of the selection column */
    columnTitle?: string | React.ReactNode;

    /** Check table row precisely; parent row and children rows are not associated */
    checkStrictly?: boolean;

    /** Renderer of the table cell. Same as render in column */
    renderCell?: (value: boolean, record: T, index: number, originNode: React.ReactNode) => React.ReactNode;

    /** Callback executed when selected rows change by checkbox clicking */
    onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;

    /** Callback executed when row selection is cleared */
    onSelectNone?: () => void;
}

//endregion

export const Grid = (gridProps: IGridProps): JSX.Element => {
    const [gridId] = useState(getUuid());
    const [gridApi, setGridApi] = useState({} as IGridApi);

    const [dataSet, setDataSet, rowsMap] = useDataSet(gridProps.dataSet);
    const [editFormApi] = useState<IDFormModalApi>({} as IDFormModalApi);
    const [buttonsApi] = useState({} as IButtonsRowApi);

    const [selectedRowKeys, setSelectedRowKeys] = useSelectedRowKeys(gridApi, gridProps);
    useInitGridApi({gridApi, gridProps, gridId, rowsMap, dataSet, setDataSet, editFormApi, buttonsApi, selectedRowKeys, setSelectedRowKeys});
    const gridButtons = useInitButtons(gridApi);

    useKeysEvents(gridApi, gridId);
    useGlobalClick(gridApi, gridId);

    const ref = useRef<HTMLDivElement>(null);
    useClickAway(() => {
        console.log('Clicked');
    }, ref);

    //region Destructor
    useEffect(() => {
        return () => {
            setGridApi({} as IGridApi); //clear api on component destroy to prevent memory leaks
        };
    }, []);
    //endregion

    return (
        <GridRender
            gridId={gridId}
            gridApi={gridApi}
            gridButtons={gridButtons}
            buttonsApi={buttonsApi}
            editFormApi={editFormApi}
            dataSet={dataSet}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
        />
    );
    /*
    return (
        <div ref={ref} className={'advanced-ant-grid-root id-' + gridId + (gridProps.bodyHeight === 'fill' ? ' auto-height' : '')} tabIndex={-1}>
            {!gridProps.bodyHeight ? (
                <StickyBox style={{zIndex: 10}} offsetTop={gridProps.buttonsStickyOffset}>
                    <MenuRow gridId={gridId} buttons={gridButtons} buttonsApi={buttonsApi} gridProps={gridProps} />
                </StickyBox>
            ) : (
                <MenuRow gridId={gridId} buttons={gridButtons} buttonsApi={buttonsApi} gridProps={gridProps} />
            )}

            <Table
                id={gridProps.id}
                expandable={gridProps.expandable}
                className={
                    'advanced-ant-grid ' +
                    (gridProps.className ? gridProps.className : '') +
                    (!gridProps.rowSelection?.showSelectionColumn ? ' ant-table-selection-column-hidden' : '') +
                    (gridProps?.noHover ? ' ant-table-no-hover' : '')
                }
                rowKey="id"
                components={components}
                columns={columns}
                dataSource={dataSet}
                bordered={typeof gridProps.bordered === 'undefined' || gridProps.bordered}
                showHeader={gridProps.showHeader}
                showSorterTooltip={gridProps.showSorterTooltip}
                size={gridProps.size}
                scroll={!gridProps.bodyHeight ? {x: 'max-content'} : {x: 'max-content', y: gridProps.bodyHeight}}
                sticky={!gridProps.bodyHeight}
                pagination={false}
                rowSelection={rowSelectionProp as Record<string, unknown>}
                summary={gridProps.summary}
                loading={gridProps.loading}
                style={gridProps.style}
                tableLayout={gridProps.tableLayout}
                getPopupContainer={gridProps.getPopupContainer}
                rowClassName={gridProps.rowClassName}
                onRow={(row) => ({
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        gridApi.setSelectedRowKeys((row as IGridRowData).id, !gridProps.multiSelect || !e.ctrlKey);
                    },
                    onDoubleClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (gridProps.readonly) buttonsApi.triggerClick('view');
                        else buttonsApi.triggerClick('update');
                    },
                })}
                onHeaderRow={gridProps.callbacks?.onHeaderRow}
                onChange={gridProps.callbacks?.onChange}
            />

            {editFormProps ? <DFormModal {...editFormProps} apiRef={editFormApi} /> : null}
        </div>
    );*/
};

//region Grid Api

//endregion

//region Inits hooks

const useDataSet = (initialDataSet: IGridRowData[] | undefined): [IGridRowData[], (dataSet: IGridRowData[]) => void, IGridRowsMap] => {
    const [_dataSet, _setDataSet] = useState<IGridRowData[]>(initialDataSet || []);
    const [_dataMap, _setDataMap] = useState<IGridRowsMap>({});

    const setDataSet = useCallback((dataSet: IGridRowData[]) => {
        const map: IGridRowsMap = {};
        if (dataSet) {
            const recursive = (children: IGridRowData[]) => {
                for (const row of children) {
                    if (process.env.NODE_ENV !== 'production' && map[row.id]) console.warn('Not unique id in grid data', row);

                    map[row.id] = row;
                    if (row.children) recursive(row.children);
                }
            };

            recursive(dataSet);
            _setDataMap(map);
        }
        _setDataSet(dataSet || []);
    }, []);

    useEffect(() => {
        setDataSet(initialDataSet || []);
    }, [initialDataSet, setDataSet]);

    return [_dataSet, setDataSet, _dataMap];
};

const useSelectedRowKeys = (gridApi: IGridApi, gridProps: IGridProps): [IGridRowData['id'][], (keys: IGridRowData['id'][]) => void] => {
    const [selectedRowKeys, _setSelectedRowKeys] = useState([] as IGridRowData['id'][]);

    const setSelectedRowKeys = useCallback(
        (keys: IGridRowData['id'][]) => {
            _setSelectedRowKeys(keys);
            if (!gridProps.callbacks?.onSelectionChange) return;

            const rows = gridApi.getRowsListByKeys(keys, true) as IGridRowData[];
            gridProps.callbacks.onSelectionChange(keys, rows);
        },
        [gridApi, gridProps.callbacks]
    );

    return [selectedRowKeys, setSelectedRowKeys];
};

//endregion

const useKeysEvents = (gridApi: IGridApi, gridId: string) => {
    useLayoutEffect(() => {
        const keyDownHandler = (e: KeyboardEvent) => {
            const focusedElement = document.activeElement;
            if (!focusedElement || !(focusedElement instanceof HTMLElement)) return;
            //if focused element is not inside the grid and not contains the grid, then exit
            //if (!focusedElement.closest('.advanced-ant-grid-root') && !focusedElement.querySelector('.advanced-ant-grid-root')) return;

            //if focused element is not inside the grid
            if (!focusedElement.closest('.id-' + gridId)) return;

            const key = e.key.toLowerCase();

            if (e.ctrlKey && key === 'a') {
                gridApi.selectAll();
            } else if (key === 'arrowdown') {
                if (e.ctrlKey) gridApi.selectLastRow(true);
                else gridApi.selectNextRow('next', true);
            } else if (key === 'arrowup') {
                if (e.ctrlKey) gridApi.selectFirstRow(true);
                else gridApi.selectNextRow('previous', true);
            } else if (key === 'insert') {
                gridApi.buttonsApi.triggerClick('create');
            } else if (key === 'f2') {
                gridApi.buttonsApi.triggerClick('update');
            } else if (key === 'f9') {
                gridApi.buttonsApi.triggerClick('clone');
            } else if (key === 'delete' && e.ctrlKey) {
                gridApi.buttonsApi.triggerClick('delete');
            } else {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => document.removeEventListener('keydown', keyDownHandler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

const useGlobalClick = (gridApi: IGridApi, gridId: string) => {
    useEffect(() => {
        const onClickHandler = (e: MouseEvent) => {
            if (!e.target || !(e.target instanceof HTMLElement)) return;
            const $grid = document.querySelector('.advanced-ant-grid-root.id-' + gridId);
            if (
                !isElementVisible($grid) ||
                e.target.closest('.advanced-ant-grid-root.id-' + gridId) ||
                !e.target.querySelector('.advanced-ant-grid-root.id-' + gridId)
            )
                //убираем выбранные элементы если пользователь кликнул на элемент, который не находится на гриде, но который содержит грид
                return;
            gridApi.setSelectedRowKeys([], true);
        };

        document.addEventListener('click', onClickHandler);
        return () => document.removeEventListener('click', onClickHandler);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
