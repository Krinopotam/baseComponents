import React, {useCallback, useEffect} from 'react';
import ReactTabulator, {ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';
import dispatcher from 'baseComponents/modal/service/formsDispatcher';
import {IGridProps} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {useEvents} from 'baseComponents/tabulatorGrid/hooks/events';
import {useColumnDef, usePrepareColumns} from 'baseComponents/tabulatorGrid/hooks/columns';

const GridRender_ = ({
    tableRef,
    gridApi,
    gridProps,
}: {
    tableRef: React.MutableRefObject<ITabulator | undefined>;
    gridApi: IGridApi;
    gridProps: IGridProps;
}): JSX.Element => {
    const columnDef = useColumnDef(gridProps.columnDefaults, gridApi);
    const columns = usePrepareColumns(gridProps.columns, gridProps.dataTree, gridApi);
    const events = useEvents(gridApi);

    const onTableRef = useCallback(
        (tabulatorRef: React.MutableRefObject<ITabulator | undefined>) => {
            tableRef.current = tabulatorRef.current;
            gridApi.tableApi = tabulatorRef.current;
        },
        [gridApi, tableRef]
    );

    useEffect(() => {
        dispatcher.pushToStack(gridApi.getGridId());
    }, [gridApi]);

    return (
        <ReactTabulator
            onTableRef={onTableRef}
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
            /*rowFormatter={(row: RowComponent) => {
                    const table = row.getTable() as ITabulator;
                    if (!tableBuilt) return;
                    const data = row.getData(); //get data object for row
                    if (data.id === table.getActiveRowKey()) row.getElement().style.borderColor = '#ff0000'; //apply css change to row element
                    else row.getElement().style.borderColor = '#f5f5f5';
                }}*/
            events={events}
        />
    );
};

export const GridRender = React.memo(GridRender_);
