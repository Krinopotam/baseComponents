import {ColumnDefinition} from "tabulator-tables";
import {IGridApi} from "baseComponents/tabulatorGrid/hooks/api";
import {useMemo} from "react";
import {IReactTabulatorProps} from "baseComponents/tabulatorGrid/reactTabulator/reactTabulator";
import {IFilterFunction} from "baseComponents/tabulatorGrid/reactTabulator/modules/advancedTreeModule";

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
    }, [columnDef, gridApi]);
};

export const usePrepareColumns = (columns: IReactTabulatorProps['columns'], dataTree: boolean | undefined, gridApi: IGridApi) => {
    return useMemo(() => {
        if (!columns || !dataTree) return columns;

        const resultColumns = [];

        for (const column of columns) {
            const colClone = {...column};
            if (typeof column.headerFilterFunc === 'function') {
                colClone.headerFilterFunc = (filterVal, rowValue, rowData, filterParams) => {
                    const filter = gridApi.tableApi?.getBaseTreeDataFilter(column.headerFilterFunc as IFilterFunction);
                    if (!filter) return true;
                    return filter(filterVal, rowValue, rowData, filterParams);
                };
            }

            resultColumns.push(colClone);
        }

        return resultColumns;
    }, [columns, dataTree, gridApi]);
};
