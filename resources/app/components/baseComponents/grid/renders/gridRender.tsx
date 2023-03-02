import React, {useCallback, useMemo, useRef, useState} from 'react';
import {IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';
import {useClickAway} from 'ahooks';
import StickyBox from 'react-sticky-box';
import {Table} from 'antd';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {IGridProps, IGridRowData} from 'baseComponents/grid/grid';
import {MenuRow} from './menuRow';
import {usePrepareEditFormProps} from 'baseComponents/grid/hooks/editForm';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {ColumnGroupType, ColumnsType, ColumnType} from 'antd/es/table';
import {ResizeCallbackData} from 'react-resizable';
import {IGridApi} from '../hooks/api';
import {ResizableHeader} from 'baseComponents/grid/renders/resizableHeader';
import {TableRowSelection} from 'antd/es/table/interface';

export const GridRender = ({
    gridId,
    gridApi,
    gridButtons,
    buttonsApi,
    editFormApi,
    dataSet,
    selectedRowKeys,
    setSelectedRowKeys,
}: {
    gridId: string;
    gridApi: IGridApi;
    gridButtons: IFormButtons;
    buttonsApi: IButtonsRowApi;
    editFormApi: IDFormModalApi;
    dataSet: IGridRowData[];
    selectedRowKeys: IGridRowData['id'][];
    setSelectedRowKeys: (selectedKeys: IGridRowData['id'][]) => void;
}): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    useClickAway(() => {
        console.log('Clicked');
    }, ref);

    const gridProps = gridApi.gridProps;
    const rowSelectionProp = usePrepareRowSelectionProps(gridProps, selectedRowKeys, setSelectedRowKeys);
    const [columns] = useColumns(gridProps.columns || []);
    const editFormProps = usePrepareEditFormProps(gridProps.editFormProps, gridApi);

    return (
        <div ref={ref} className={'advanced-ant-grid-root id-' + gridId + (gridProps.bodyHeight === 'fill' ? ' auto-height' : '')} tabIndex={-1}>
            <div>
                {!gridProps.bodyHeight ? (
                    <StickyBox style={{zIndex: 10}} offsetTop={gridProps.buttonsStickyOffset}>
                        <MenuRow gridId={gridId} buttons={gridButtons} buttonsApi={buttonsApi} gridProps={gridProps} />
                    </StickyBox>
                ) : (
                    <MenuRow gridId={gridId} buttons={gridButtons} buttonsApi={buttonsApi} gridProps={gridProps} />
                )}
            </div>
            <div>
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
            </div>

            {editFormProps ? <DFormModal {...editFormProps} apiRef={editFormApi} /> : null}
        </div>
    );
};

const components = {
    header: {
        cell: ResizableHeader,
    },
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
                    } as unknown as React.HTMLAttributes<ColumnType<Record<string, unknown>>>;
                },
            });
        }
        return upgradedColumns;
    }, [columnsState, handleResize]);

    return [resizeableColumns, setColumnsState];
};
