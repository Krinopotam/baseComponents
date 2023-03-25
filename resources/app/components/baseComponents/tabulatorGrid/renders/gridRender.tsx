import React, {useMemo} from 'react';
import ReactTabulator, {IReactTabulatorProps, ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {ColumnDefinition, RowComponent, TabulatorFull as Tabulator} from 'tabulator-tables';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';
import {IFilterFunction} from 'baseComponents/tabulatorGrid/reactTabulator/modules/advancedTreeModule';

export const GridRender = ({tableRef, gridApi}: {tableRef: React.MutableRefObject<Tabulator | null>; gridApi: IGridApi}): JSX.Element => {
    const gridProps = gridApi.gridProps;
    const columnDef = useColumnDef(gridProps.columnDefaults, gridApi);
    const columns = usePrepareColumns(gridProps.columns, gridProps.dataTree, gridApi);
    return useMemo(() => {
        let tableBuilt = false;
        return (
            <ReactTabulator
                onTableRef={(tabulatorRef) => {
                    tableRef.current = tabulatorRef.current;
                    gridApi.tableApi = tabulatorRef.current;
                }}
                gridId={gridApi.getGridId()}
                dataTree={gridProps.dataTree}
                dataTreeChildField={gridProps.dataTreeChildField || 'children'}
                dataTreeParentField={gridProps.dataTreeParentField || 'parent'}
                dataTreeChildIndent={gridProps.dataTreeChildIndent || 22}
                dataTreeFilter={true}
                data={gridApi.getDataSet()}
                columns={columns}
                containerClassName={gridProps.className}
                placeholder={gridProps.placeholder || 'Строки отсутствуют'}
                layout={gridProps.layout || 'fitData'}
                layoutColumnsOnNewData={gridProps.layoutColumnsOnNewData}
                width={gridProps.width}
                maxWidth={gridProps.maxWidth}
                minWidth={gridProps.minWidth}
                height={gridProps.height}
                maxHeight={gridProps.maxHeight}
                minHeight={gridProps.minHeight}
                selectable={false} //We don't use built selectable mode. We use the custom selection algorithm
                multiSelect={gridProps.multiSelect}
                resizableColumnFit={gridProps.resizableColumnFit}
                rowHeight={gridProps.rowHeight}
                resizableRows={gridProps.resizableRows}
                movableColumns={gridProps.movableColumns !== false}
                movableRows={gridProps.movableRows}
                groupBy={gridProps.groupBy}
                persistence={gridProps.persistence}
                persistenceID={gridProps.persistenceID}
                persistentLayout={gridProps.persistentLayout}
                persistentFilter={gridProps.persistentFilter}
                persistentSort={gridProps.persistentSort}
                frozenRows={gridProps.frozenRows}
                frozenRowsField={gridProps.frozenRowsField}
                initialFilter={gridProps.initialFilter}
                initialSort={gridProps.initialSort}
                headerVisible={gridProps.headerVisible !== false}
                columnDefaults={columnDef}
                sortMode={gridProps.gridMode}
                filterMode={gridProps.gridMode}
                dataTreeBranchElement={false}
                rowFormatter={(row: RowComponent) => {
                    const table = row.getTable() as ITabulator;
                    if (!tableBuilt) return;
                    const data = row.getData(); //get data object for row
                    if (data.id === table.getActiveRowKey()) row.getElement().style.borderColor = '#ff0000'; //apply css change to row element
                    else row.getElement().style.borderColor = '#f5f5f5';
                }}
                events={{
                    tableBuilt: () => {
                        tableBuilt = true;
                    },
                    activeRowChanged: () => {
                        gridApi.buttonsApi.refreshButtons();
                    },
                }}
            />
        );
    }, [
        columnDef,
        columns,
        gridApi,
        gridProps.className,
        gridProps.dataTree,
        gridProps.dataTreeChildField,
        gridProps.dataTreeChildIndent,
        gridProps.dataTreeParentField,
        gridProps.frozenRows,
        gridProps.frozenRowsField,
        gridProps.gridMode,
        gridProps.groupBy,
        gridProps.headerVisible,
        gridProps.height,
        gridProps.initialFilter,
        gridProps.initialSort,
        gridProps.layout,
        gridProps.layoutColumnsOnNewData,
        gridProps.maxHeight,
        gridProps.maxWidth,
        gridProps.minHeight,
        gridProps.minWidth,
        gridProps.movableColumns,
        gridProps.movableRows,
        gridProps.multiSelect,
        gridProps.persistence,
        gridProps.persistenceID,
        gridProps.persistentFilter,
        gridProps.persistentLayout,
        gridProps.persistentSort,
        gridProps.placeholder,
        gridProps.resizableColumnFit,
        gridProps.resizableRows,
        gridProps.rowHeight,
        gridProps.width,
        tableRef,
    ]);
};

export const useColumnDef = (columnDef: ColumnDefinition | undefined, gridApi: IGridApi) => {
    return useMemo(() => {
        const colDef: Partial<ColumnDefinition> = {
            resizable: 'header',
            headerFilter: true,
            headerFilterFunc: 'like',
        };

        const userColDef = columnDef || ({} as ColumnDefinition);

        const resultColDef = {...colDef, ...userColDef} as ColumnDefinition;
        if (typeof userColDef.headerFilterFunc === 'function') {
            resultColDef.headerFilterFunc = gridApi.tableApi?.getBaseTreeDataFilter(userColDef.headerFilterFunc);
        }

        return resultColDef;
    }, [columnDef, gridApi.tableApi]);
};

export const usePrepareColumns = (columns: IReactTabulatorProps['columns'], dataTree: boolean|undefined, gridApi: IGridApi) => {
    return useMemo(() => {
        if (!columns || !dataTree) return columns;

        const resultColumns = [];

        for (let i = 0; i < columns.length; i++) {
            const colClone = {...columns[i]};
            if (typeof columns[i].headerFilterFunc === 'function') {
                colClone.headerFilterFunc = (filterVal, rowValue, rowData, filterParams) => {
                    const filter = gridApi.tableApi?.getBaseTreeDataFilter(columns[i].headerFilterFunc as IFilterFunction);
                    if (!filter) return true;
                    return filter(filterVal, rowValue, rowData, filterParams);
                };
            }

            resultColumns.push(colClone);
        }

        return resultColumns;
    }, [columns, dataTree, gridApi.tableApi]);
};
