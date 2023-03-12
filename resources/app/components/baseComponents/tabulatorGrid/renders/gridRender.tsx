import React, {useMemo} from 'react';
import ReactTabulator, {ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {ColumnDefinition, RowComponent, TabulatorFull as Tabulator} from 'tabulator-tables';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';

export const GridRender = ({tableRef, gridApi}: {tableRef: React.MutableRefObject<Tabulator | null>; gridApi: IGridApi}): JSX.Element => {
    const gridProps = gridApi.gridProps;
    return useMemo(() => {
        let tableBuilt = false;
        return (
            <ReactTabulator
                onTableRef={(tabulatorRef) => {
                    tableRef.current = tabulatorRef.current;
                    gridApi.tableApi = tabulatorRef.current;
                }}
                gridId={gridApi.getGridId()}
                data={gridApi.getDataSet()}
                columns={gridProps.columns}
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
                resizableRows={gridProps.resizableRows !== false}
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
                columnDefaults={gridProps.columnDefaults || ({} as ColumnDefinition)}
                sortMode={gridProps.gridMode}
                filterMode={gridProps.gridMode}
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
                    dataChanged: () => {
                        gridProps.callbacks?.onDataSetChange?.(gridApi.tableApi?.getData() || [], gridApi);
                    },
                    activeRowChanged: () => {
                        gridApi.buttonsApi.refreshButtons();
                    },
                }}
            />
        );
    }, [
        gridApi,
        gridProps.callbacks,
        gridProps.className,
        gridProps.columnDefaults,
        gridProps.columns,
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
