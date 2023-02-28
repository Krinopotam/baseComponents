import './grid.css';

import {ButtonsRow, IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';
import {ColumnGroupType, ColumnType, ColumnsType} from 'antd/es/table';
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {DFormModal, IDFormModalApi, IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {ExpandableConfig, Key, TableRowSelection} from 'antd/es/table/interface';
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {Table, TableProps, theme} from 'antd';
import {findIndexInObjectsArray, isArray, mergeObjects, objectKeysLength} from 'helpers/helpersObjects';

import {IApiAction} from '../../../../applib/api/ApiAction';
import {MessageBox} from 'baseComponents/messageBox';
import {ResizableHeader} from './resizableHeader';
import {ResizeCallbackData} from 'react-resizable';
import StickyBox from 'react-sticky-box';
import {getUuid} from 'helpers/helpersString';
import {isElementVisible} from 'helpers/helpersDOM';
import scrollIntoView from 'scroll-into-view';

//region Types
type ITableProps = TableProps<Record<string, unknown>>;

export interface CustomizeButtons {
    canClone?: boolean;
    canUpdate?: boolean;
    canCreate?: boolean;
    titles?: {
        clone?: string;
        create?: string;
        update?: string;
    };
}

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

    buttons?: IFormButtons;

    customizeButtons?: CustomizeButtons;

    /** Offset for sticky buttons*/
    buttonsStickyOffset?: number;

    /** Table can't be edited */
    readonly?: boolean;

    /** Edit modal controls parameters */
    editFormProps?: IDynamicFormModalProps;

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

type IGridRowsMap = Record<string, IGridRowData>;

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

interface IGridMenuProps {
    buttons: IFormButtons | undefined;
    buttonsApi?: IButtonsRowApi;
    formType?: TFormType;
    gridId: string;
    gridProps: IGridProps;
}

export interface IGridApi {
    /** Get or set current data set*/
    dataSet: (rows?: IGridRowData[] | null) => IGridRowData[];

    /** Insert new row/rows */
    insertRows: (rowData: IGridRowData | IGridRowData[], place?: 'before' | 'after', id?: IGridRowData['id'], updateSelection?: boolean) => IGridRowData[];

    /** Update existed row/rows */
    updateRows: (rowData: IGridRowData | IGridRowData[], updateSelection?: boolean) => IGridRowData[];

    /** Delete existed row/rows by keys */
    deleteRowsByKey: (keys: IGridRowData['id'] | IGridRowData['id'][], updateSelection?: boolean) => IGridRowData[];

    /** Remove existed row/rows */
    deleteRows: (rowData: IGridRowData | IGridRowData[], updateSelection?: boolean) => IGridRowData[];

    /** Get/set selected row/rows keys */
    selectedRowKeys: (key?: IGridRowData['id'] | IGridRowData['id'][] | null, clearOldSelection?: boolean) => IGridRowData['id'][];

    /** Get/set selected row/rows */
    selectedRows: (row?: IGridRowData | IGridRowData[] | null, clearOldSelection?: boolean) => IGridRowData[];

    /** Select all rows*/
    selectAll: () => void;

    /** Select next row */
    selectNextRow: (direction: 'next' | 'previous', ensureVisible?: boolean) => void;

    /** Select first row */
    selectFirstRow: (ensureVisible?: boolean) => void;

    /** Select last row */
    selectLastRow: (ensureVisible?: boolean) => void;

    /** Returns row/undefined by key */
    getRowByKey: (key: IGridRowData['id']) => IGridRowData | undefined;

    /** Returns rows list/collection/undefined by key/keys */
    getRowsListByKeys: (keys: IGridRowData['id'] | IGridRowData['id'][], asArray?: boolean) => IGridRowData[] | Record<string, IGridRowData>;

    /** Scroll to row with the key */
    scrollToRowKey: (key: IGridRowData['id'], skipIfVisible?: boolean) => void;

    /** Buttons api */
    buttonsApi: IButtonsRowApi;
}

//endregion

const {useToken} = theme;

const components = {
    header: {
        cell: ResizableHeader,
    },
};

export const Grid = (gridProps: IGridProps): JSX.Element => {
    const [gridId] = useState(getUuid());
    const [gridApi, setGridApi] = useState({} as IGridApi);
    const [columns] = useColumns(gridProps.columns || []);
    const [dataSet, setDataSet, rowsMap] = useDataSet(gridProps.dataSet);
    const [selectedRowKeys, setSelectedRowKeys] = useSelectedRowKeys(gridProps, gridApi);
    const [editFormApi] = useState<IDFormModalApi>({} as IDFormModalApi);
    const [buttonsApi] = useState({} as IButtonsRowApi);

    const gridButtons = useInitButtons(gridApi, gridProps, dataSet, editFormApi, selectedRowKeys);
    useInitGridApi({gridApi, gridProps, gridId, rowsMap, dataSet, setDataSet, selectedRowKeys, setSelectedRowKeys: setSelectedRowKeys, buttonsApi});
    const rowSelectionProp = usePrepareRowSelectionProps(gridProps, selectedRowKeys, setSelectedRowKeys);
    const editFormProps = usePrepareEditFormProps(gridProps.editFormProps, gridApi);

    useKeysEvents(gridApi, gridId);
    useGlobalClick(gridApi, gridId);

    //region Destructor
    useEffect(() => {
        return () => {
            setGridApi({} as IGridApi); //clear api on component destroy to prevent memory leaks
        };
    }, []);
    //endregion

    return (
        <div className={'advanced-ant-grid-root id-' + gridId + (gridProps.bodyHeight === 'fill' ? ' auto-height' : '')} tabIndex={-1}>
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
                sticky={!gridProps.bodyHeight ? true : false}
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
                        gridApi.selectedRowKeys((row as IGridRowData).id, !gridProps.multiSelect || !e.ctrlKey);
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
    );
};

const MenuRow = (props: IGridMenuProps): JSX.Element | null => {
    const {token} = useToken();

    const {buttons, gridProps} = props;

    const [isMenuVisible, setIsMenuVisible] = useState<boolean | undefined>(undefined);

    useLayoutEffect(() => {
        const menuVisible = objectKeysLength(buttons) > 0;
        if (typeof isMenuVisible === 'undefined' || isMenuVisible !== menuVisible) {
            setIsMenuVisible(menuVisible);
            if (gridProps.callbacks?.onMenuVisibilityChanged) gridProps.callbacks.onMenuVisibilityChanged(menuVisible);
        }
    }, [buttons, gridProps.callbacks, gridProps.callbacks?.onMenuVisibilityChanged, isMenuVisible]);

    if (!buttons) return null;

    return (
        <div style={{width: '100%', backgroundColor: token.colorBgElevated, height: isMenuVisible ? '40px' : '0', overflow: 'hidden'}}>
            <div style={{width: '100%', height: '3px'}} />
            <ButtonsRow formId={props.gridId} buttons={buttons} apiRef={props.buttonsApi} arrowsSelection={false} />
            <div style={{width: '100%', height: '3px'}} />
        </div>
    );
};

//region Grid Api
const useInitGridApi = ({
    gridApi,
    gridProps,
    gridId,
    rowsMap,
    dataSet,
    setDataSet,
    selectedRowKeys,
    setSelectedRowKeys,
    buttonsApi,
}: {
    gridApi: IGridApi;
    gridProps: IGridProps;
    gridId: string;
    rowsMap: IGridRowsMap;
    dataSet: IGridRowData[];
    setDataSet: (dataSet: IGridRowData[]) => void;
    selectedRowKeys: IGridRowData['id'][];
    setSelectedRowKeys: (selectedKeys: IGridRowData['id'][]) => void;
    buttonsApi: IButtonsRowApi;
}): IGridApi => {
    gridApi.dataSet = useApiDataSet(dataSet, setDataSet);
    gridApi.insertRows = useApiInsertRows(gridApi, gridProps);
    gridApi.updateRows = useApiUpdateRows(gridApi, gridProps);
    gridApi.deleteRowsByKey = useApiDeleteRowsByKey(gridApi, gridProps);
    gridApi.deleteRows = useApiDeleteRows(gridApi);
    gridApi.selectedRowKeys = useApiSelectedRowKeys(gridProps, selectedRowKeys, setSelectedRowKeys);
    gridApi.selectedRows = useApiSelectedRows(gridApi);
    gridApi.selectAll = useApiSelectAll(gridApi);
    gridApi.getRowByKey = useApiGetRowByKey(rowsMap);
    gridApi.getRowsListByKeys = useApiGetRowsListByKeys(rowsMap);
    gridApi.scrollToRowKey = useApiScrollToRowKey(gridProps, gridId);
    gridApi.selectNextRow = useApiSelectNextRow(gridApi);
    gridApi.selectFirstRow = useApiSelectFirstRow(gridApi);
    gridApi.selectLastRow = useApiSelectLastRow(gridApi);
    gridApi.buttonsApi = buttonsApi;

    return gridApi;
};

const useApiDataSet = (dataSet: IGridRowData[], setDataSet: (dataSet: IGridRowData[]) => void): IGridApi['dataSet'] => {
    return useCallback(
        (rows): IGridRowData[] => {
            if (typeof rows === 'undefined') return dataSet;
            const _rows = rows ? rows : [];
            setDataSet(_rows);
            return _rows;
        },
        [dataSet, setDataSet]
    );
};

const useApiInsertRows = (gridApi: IGridApi, gridProps: IGridProps): IGridApi['insertRows'] => {
    return useCallback(
        (rows, place, id, updateSelection): IGridRowData[] => {
            if (!place) place = 'after';

            const _dataSet = [...gridApi.dataSet()];

            const _rows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

            if (!id) {
                if (place === 'before') {
                    for (const row of _rows) {
                        if (!row.id) row.id = getUuid();
                        _dataSet.unshift(row);
                    }
                } else {
                    for (const row of _rows) {
                        if (!row.id) row.id = getUuid();
                        _dataSet.push(row);
                    }
                }
            } else {
                let index = findIndexInObjectsArray(_dataSet, 'id', id);

                if (index < 0) index = place === 'before' ? 0 : _dataSet.length;
                else if (place === 'after') index = index + 1;

                for (let i = _rows.length - 1; i >= 0; i--) {
                    const row = _rows[i];
                    if (!row.id) row.id = getUuid();
                    _dataSet.splice(index, 0, row);
                }
            }

            gridApi.dataSet(_dataSet);
            gridProps.callbacks?.onDataSetChange?.(_dataSet);

            if (updateSelection && _rows[0]) {
                gridApi.selectedRowKeys(_rows[0].id, true);
                gridApi.scrollToRowKey(_rows[0].id, true);
            }

            return _dataSet;
        },
        [gridApi, gridProps]
    );
};

const useApiUpdateRows = (gridApi: IGridApi, gridProps: IGridProps): IGridApi['updateRows'] => {
    return useCallback(
        (rows, updateSelection): IGridRowData[] => {
            const _dataSet = [...gridApi.dataSet()];

            const _rows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

            for (let i = _rows.length - 1; i >= 0; i--) {
                const row = _rows[i];
                const index = findIndexInObjectsArray(_dataSet, 'id', row.id);
                if (index < 0) continue;
                _dataSet[index] = row;
            }

            gridApi.dataSet(_dataSet);
            gridProps.callbacks?.onDataSetChange?.(_dataSet);

            if (updateSelection && _rows[0]) {
                gridApi.selectedRowKeys(_rows[0].id, true);
                gridApi.scrollToRowKey(_rows[0].id, true);
            }

            return _dataSet;
        },
        [gridApi, gridProps]
    );
};

const useApiDeleteRowsByKey = (gridApi: IGridApi, gridProps: IGridProps): IGridApi['deleteRowsByKey'] => {
    return useCallback(
        (keys, updateSelection): IGridRowData[] => {
            const _dataSet = [...gridApi.dataSet()];

            const _keys: IGridRowData['id'][] = isArray(keys) ? [...(keys as IGridRowData['id'][])] : [keys as IGridRowData['id']];

            let newSelectedId: IGridRowData['id'] = '';
            for (const key of _keys) {
                const index = findIndexInObjectsArray(_dataSet, 'id', key);
                if (index < 0) continue;
                if (newSelectedId === key) newSelectedId = '';
                if (!newSelectedId && _dataSet[index + 1]) newSelectedId = _dataSet[index + 1].id;
                _dataSet.splice(index, 1);
            }

            gridApi.dataSet(_dataSet);
            gridProps.callbacks?.onDataSetChange?.(_dataSet);

            if (!newSelectedId && _dataSet[_dataSet.length - 1]) newSelectedId = _dataSet[_dataSet.length - 1].id;

            if (updateSelection && newSelectedId) {
                gridApi.selectedRowKeys(newSelectedId, true);
                gridApi.scrollToRowKey(newSelectedId, true);
            }

            return _dataSet;
        },
        [gridApi, gridProps]
    );
};

const useApiDeleteRows = (gridApi: IGridApi): IGridApi['deleteRows'] => {
    return useCallback(
        (rows, updateSelection): IGridRowData[] => {
            const _rows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];
            const keys = [];
            for (const row of _rows) keys.push(row.id);

            // !YAR Kostyl - do delete by data source

            return gridApi.deleteRowsByKey(keys, updateSelection);
        },
        [gridApi]
    );
};

const useApiSelectedRowKeys = (
    gridProps: IGridProps,
    selectedRowKeys: IGridRowData['id'][],
    setSelectedRowKeys: (selectedKeys: IGridRowData['id'][]) => void
): IGridApi['selectedRowKeys'] => {
    return useCallback(
        (key, clearOldSelection) => {
            const selectedKeys = clearOldSelection ? [] : [...selectedRowKeys];
            if (typeof key === 'undefined') return selectedKeys;
            if (!key) {
                setSelectedRowKeys([]);
                return [];
            }

            const keys: IGridRowData['id'][] = isArray(key) ? (key as IGridRowData['id'][]) : [key as IGridRowData['id']];

            const totalKeys = gridProps.multiSelect ? keys.length - 1 : 0;
            for (let i = 0; i <= totalKeys; i++) {
                const curKey = keys[i];
                const idx = selectedKeys.indexOf(curKey);
                if (idx > -1) selectedKeys.splice(idx, 1); //delete
                else selectedKeys.push(curKey); //add
            }

            setSelectedRowKeys(selectedKeys);

            return selectedKeys;
        },
        [gridProps, selectedRowKeys, setSelectedRowKeys]
    );
};

const useApiSelectedRows = (gridApi: IGridApi): IGridApi['selectedRows'] => {
    return useCallback(
        (row, clearOldSelection) => {
            if (typeof row === 'undefined') {
                const selKeys = gridApi.selectedRowKeys();
                return gridApi.getRowsListByKeys(selKeys, true) as IGridRowData[];
            }

            if (!row) {
                gridApi.selectedRowKeys(null);
                return [];
            }

            const rows: IGridRowData[] = isArray(row) ? (row as IGridRowData[]) : [row as IGridRowData];
            const keys = [];
            for (const _row of rows) {
                keys.push(_row.id);
            }

            const selectedKeys = gridApi.selectedRowKeys(keys, clearOldSelection);
            return gridApi.getRowsListByKeys(selectedKeys, true) as IGridRowData[];
        },
        [gridApi]
    );
};

const useApiSelectAll = (gridApi: IGridApi) => {
    return useCallback(() => {
        gridApi.selectedRows(gridApi.dataSet(), true);
    }, [gridApi]);
};

const useApiSelectNextRow = (gridApi: IGridApi) => {
    return useCallback(
        (direction, ensureVisible) => {
            const rows = gridApi.dataSet();
            if (rows.length === 0) return;
            const currentSelected = gridApi.selectedRowKeys();
            let nextRowId: IGridRowData['id'];
            if (currentSelected.length > 0) {
                const curIndex = findIndexInObjectsArray(rows, 'id', currentSelected[currentSelected.length - 1]);
                if (curIndex < 0) nextRowId = rows[0].id;
                else {
                    if (direction === 'next') nextRowId = rows[curIndex + 1] ? rows[curIndex + 1].id : rows[rows.length - 1].id;
                    else nextRowId = rows[curIndex - 1] ? rows[curIndex - 1].id : rows[0].id;
                }
            } else {
                nextRowId = rows[0].id;
            }

            gridApi.selectedRowKeys(nextRowId, true);

            if (ensureVisible) gridApi.scrollToRowKey(nextRowId, true);
        },
        [gridApi]
    );
};

const useApiSelectFirstRow = (gridApi: IGridApi) => {
    return useCallback(
        (ensureVisible) => {
            const rows = gridApi.dataSet();
            if (rows.length === 0) return;
            const nextRowId = rows[0].id;
            gridApi.selectedRowKeys(nextRowId, true);

            if (ensureVisible) gridApi.scrollToRowKey(nextRowId, true);
        },
        [gridApi]
    );
};

const useApiSelectLastRow = (gridApi: IGridApi) => {
    return useCallback(
        (ensureVisible) => {
            const rows = gridApi.dataSet();
            if (rows.length === 0) return;
            const nextRowId = rows[rows.length - 1].id;
            gridApi.selectedRowKeys(nextRowId, true);

            if (ensureVisible) gridApi.scrollToRowKey(nextRowId, true);
        },
        [gridApi]
    );
};

const useApiGetRowByKey = (dataSetMap: Record<string, IGridRowData>): IGridApi['getRowByKey'] => {
    return useCallback(
        (key) => {
            return dataSetMap[key];
        },
        [dataSetMap]
    );
};

const useApiGetRowsListByKeys = (rowsMap: IGridRowsMap): IGridApi['getRowsListByKeys'] => {
    return useCallback(
        (keys, asArray) => {
            const keysList: IGridRowData['id'][] = isArray(keys) ? (keys as IGridRowData['id'][]) : [keys as IGridRowData['id']];

            const result: IGridRowData[] | Record<string, IGridRowData> = asArray ? [] : {};
            for (const key of keysList) {
                const curRow = rowsMap[key];
                if (!curRow) continue;
                if (asArray) (result as IGridRowData[]).push(curRow);
                else (result as Record<string, IGridRowData>)[curRow.id] = curRow;
            }

            return result;
        },
        [rowsMap]
    );
};

const useApiScrollToRowKey = (gridProps: IGridProps, gridId: string): IGridApi['scrollToRowKey'] => {
    const [scrollToRow, setScrollToRow] = useState<IGridRowData['id']>('');

    const scrollToRowHandle = useCallback(
        (key: IGridRowData['id'], skipIfVisible?: boolean) => {
            const $row = document.querySelector('tr[data-row-key="' + key + '"]') as HTMLElement;

            if (!$row) return;

            if (skipIfVisible) {
                let $container: HTMLElement | Window;
                let offset = 0;
                if (gridProps.sticky && typeof gridProps.sticky !== 'boolean' && gridProps.sticky.getContainer) {
                    $container = gridProps.sticky.getContainer();
                    let headerHeight: number;
                    if (gridProps.size === 'small') headerHeight = 39;
                    else if (gridProps.size === 'middle') headerHeight = 47;
                    else headerHeight = 55;

                    const offsetHeader = gridProps.sticky.offsetHeader || 0;
                    offset = headerHeight + offsetHeader;
                } else $container = document.querySelector('.advanced-ant-grid-root.id-' + gridId + ' .ant-table-body') as HTMLElement;

                const rowPosition = $row.getBoundingClientRect();

                if ($container instanceof HTMLElement) {
                    const containerPosition = $container.getBoundingClientRect();
                    if (rowPosition.top - offset >= containerPosition.top && rowPosition.bottom <= containerPosition.bottom) return;
                } else if ($container instanceof Window) {
                    if (rowPosition.top >= 0 && rowPosition.bottom <= window.innerHeight) return;
                }
            }

            scrollIntoView($row, {
                //align: {top: 0,},
                time: 100,
            });
        },
        [gridProps.sticky, gridProps.size, gridId]
    );

    useLayoutEffect(() => {
        if (scrollToRow) scrollToRowHandle(scrollToRow, true);
        setScrollToRow('');
    }, [scrollToRow, scrollToRowHandle]);

    return setScrollToRow;
};
//endregion

//region Inits hooks
const useInitButtons = (
    gridApi: IGridApi,
    gridProps: IGridProps,
    dataSet: IGridRowData[],
    editFormApi: IDFormModalApi,
    selectedRowKeys: IGridRowData['id'][]
): IFormButtons => {
    const [gridButtons, setGridButtons] = useState({});
    useLayoutEffect(() => {
        const selectedRows = gridApi.selectedRows();

        const defaultButtons: IFormButtons = {
            view:
                gridProps.editFormProps && gridProps.readonly
                    ? {
                          title: 'Просмотреть',
                          icon: <EyeOutlined />,
                          position: 'right',
                          size: 'small',
                          disabled: selectedRows.length !== 1,
                          onClick: () => {
                              editFormApi.open('view', {...selectedRows[0]}, {...selectedRows[0]});
                          },
                      }
                    : null,
            create:
                gridProps.editFormProps &&
                !gridProps.readonly &&
                (gridProps?.customizeButtons?.canCreate === true || gridProps?.customizeButtons?.canCreate === undefined)
                    ? {
                          title: gridProps?.customizeButtons?.titles.create ? gridProps?.customizeButtons?.titles.create : 'Создать',
                          icon: <PlusOutlined />,
                          position: 'right',
                          size: 'small',
                          onClick: () => {
                              editFormApi.open('create', undefined, {...selectedRows[0]});
                          },
                      }
                    : null,
            clone:
                gridProps.editFormProps &&
                !gridProps.readonly &&
                (gridProps?.customizeButtons?.canClone === true || gridProps?.customizeButtons?.canClone === undefined)
                    ? {
                          title: gridProps?.customizeButtons?.titles?.clone ? gridProps?.customizeButtons?.titles?.clone : 'Клонировать',
                          icon: <CopyOutlined />,
                          position: 'right',
                          size: 'small',
                          disabled: selectedRows.length !== 1,
                          onClick: () => {
                              editFormApi.open('clone', {...selectedRows[0]}, {...selectedRows[0]});
                          },
                      }
                    : null,
            update:
                gridProps.editFormProps &&
                !gridProps.readonly &&
                (gridProps?.customizeButtons?.canUpdate === true || gridProps?.customizeButtons?.canUpdate === undefined)
                    ? {
                          title: gridProps?.customizeButtons?.titles?.update ? gridProps?.customizeButtons?.titles?.update : 'Редактировать',
                          icon: <EditOutlined />,
                          position: 'right',
                          size: 'small',
                          disabled: selectedRows.length !== 1,
                          onClick: () => {
                              editFormApi.open('update', {...selectedRows[0]}, {...selectedRows[0]});
                          },
                      }
                    : null,
            delete:
                gridProps.editFormProps &&
                !gridProps.readonly &&
                selectedRows.length > 0 &&
                (gridProps?.customizeButtons?.canDelete === true || gridProps?.customizeButtons?.canDelete === undefined)
                    ? {
                          title: gridProps?.customizeButtons?.titles?.delete ? gridProps?.customizeButtons?.titles?.delete : 'Удалить',
                          icon: <DeleteOutlined />,
                          position: 'right',
                          danger: true,
                          size: 'small',
                          disabled: selectedRows.length === 0,
                          onClick: () => {
                              const selRows = gridApi.selectedRows();

                              if (gridProps.confirmDelete) {
                                  MessageBox.confirm({
                                      content: gridProps.rowDeleteMessage || 'Удалить выбранные строки?',
                                      type: 'error',
                                      onOk: () => {
                                          gridApi.deleteRows(selRows, true);
                                      },
                                  });
                              } else {
                                  // !YAR Kostyl - call default delete api action
                                  if (gridProps.dataStoreDelete) {
                                      gridProps.dataStoreDelete.param = {idList: selectedRowKeys as string[]};
                                      gridProps.dataStoreDelete.fetch({idList: selectedRowKeys as string[]}, true, () => {
                                          gridApi.deleteRows(selRows, true);
                                      });
                                  }
                              }

                              if (gridProps.callbacks?.onDelete !== undefined) {
                                  gridProps.callbacks?.onDelete(selRows);
                              }
                          },
                      }
                    : null,
        };

        setGridButtons(mergeObjects(defaultButtons, gridProps.buttons));
    }, [
        gridProps.buttons,
        dataSet,
        gridProps.readonly,
        gridProps.editFormProps,
        editFormApi,
        gridApi,
        selectedRowKeys,
        gridProps.confirmDelete,
        gridProps.rowDeleteMessage,
        gridProps.dataStoreDelete,
    ]);

    return gridButtons;
};

const usePrepareEditFormProps = (editFormProps: IDynamicFormModalProps | undefined, gridApi: IGridApi) => {
    return useMemo(() => {
        if (!editFormProps) return undefined;

        const newFormProps = {...editFormProps};

        if (!newFormProps.callbacks) newFormProps.callbacks = {};

        // YAR Kostyl
        const oldOnSubmit = newFormProps.callbacks.onSubmit;

        newFormProps.callbacks.onSubmit = (values, formProps, formModelApi, confirmBoxInstance) => {
            const result = oldOnSubmit ? oldOnSubmit(values, formProps, formModelApi, confirmBoxInstance) : undefined;

            // values contain only controls fields data and not contain all of the original values, passed to controls (formData). So, we have to merge
            const updatedRow = {...formProps.dataSet, ...values} as IGridRowData;

            if (formProps.formMode === 'create' || formProps.formMode === 'clone') {
                gridApi.insertRows(updatedRow, 'after', formProps?.formParentData?.id, true);
            } else if (formProps.formMode === 'update') {
                gridApi.updateRows(updatedRow, true);
            }

            return result;
        };

        return newFormProps;
    }, [editFormProps, gridApi]);
};

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

const useColumns = (
    initialColumns: ColumnsType<Record<string, unknown>>
): [ColumnsType<Record<string, unknown>>, (columns: ColumnsType<Record<string, unknown>>) => void] => {
    const [columnsState, setColumnsState] = useState<ColumnsType<Record<string, unknown>>>(initialColumns);

    const handleResize = useCallback(
        (index: number) =>
            (e: React.SyntheticEvent<Element, Event>, {size}: ResizeCallbackData) => {
                e.preventDefault();
                const prepareResizedColumns = (columns: ColumnsType<Record<string, unknown>>) => {
                    const resizedColumns = [...columns];
                    resizedColumns[index] = {
                        ...resizedColumns[index],
                        width: size.width,
                    };
                    return resizedColumns;
                };

                setColumnsState(prepareResizedColumns(columnsState));
            },
        [columnsState]
    );

    const resizeableColumns = useMemo(() => {
        const upgradedColumns: ColumnType<Record<string, unknown>>[] = [];
        for (let idx = 0; idx < columnsState.length; idx++) {
            const column = columnsState[idx];
            // noinspection JSUnusedGlobalSymbols
            upgradedColumns.push({
                ...column,
                onHeaderCell: (col: ColumnGroupType<Record<string, unknown>> | ColumnType<Record<string, unknown>>) => {
                    return {
                        width: col.width || 100,
                        onResize: handleResize(idx),
                    };
                },
            });
        }
        return upgradedColumns;
    }, [columnsState, handleResize]);

    return [resizeableColumns, setColumnsState];
};

const usePrepareRowSelectionProps = (
    gridProps: IGridProps,
    selectedRowKeys: IGridRowData['id'][],
    setSelectedRowKeys: (selectedKeys: IGridRowData['id'][]) => void
): TableRowSelection<IGridRowData> => {
    return useMemo(() => {
        const rowSelection = gridProps.rowSelection;

        return {
            type: gridProps.multiSelect ? 'checkbox' : 'radio',
            selectedRowKeys: selectedRowKeys,

            hideSelectAll: rowSelection?.hideSelectAll || !rowSelection?.showSelectionColumn,
            renderCell: !rowSelection?.showSelectionColumn ? () => null : rowSelection?.renderCell,
            columnWidth: !rowSelection?.showSelectionColumn ? 0 : rowSelection?.columnWidth,

            columnTitle: rowSelection?.columnTitle,
            checkStrictly: rowSelection?.checkStrictly,
            fixed: !rowSelection?.showSelectionColumn ? undefined : rowSelection?.fixed,
            preserveSelectedRowKeys: rowSelection?.preserveSelectedRowKeys,

            onSelectNone: rowSelection?.onSelectNone,

            onChange: (selRowKeys: IGridRowData['id'][], selectedRows: IGridRowData[]) => {
                setSelectedRowKeys(selRowKeys);
                rowSelection?.onChange?.(selRowKeys, selectedRows);
            },
        };
    }, [gridProps, selectedRowKeys, setSelectedRowKeys]);
};

const useSelectedRowKeys = (gridProps: IGridProps, gridApi: IGridApi): [IGridRowData['id'][], (keys: IGridRowData['id'][]) => void] => {
    const [selectedRowKeys, _setSelectedRowKeys] = useState([] as IGridRowData['id'][]);

    const setSelectedRowKeys = useCallback(
        (keys: IGridRowData['id'][]) => {
            _setSelectedRowKeys(keys);
            if (gridProps.callbacks?.onSelectionChange) {
                const rows = gridApi.getRowsListByKeys(keys, true) as IGridRowData[];
                gridProps.callbacks.onSelectionChange(keys, rows);
            }
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
            gridApi.selectedRowKeys([], true);
        };

        document.addEventListener('click', onClickHandler);
        return () => document.removeEventListener('click', onClickHandler);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
