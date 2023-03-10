import React, {MutableRefObject, useCallback, useRef, useState} from 'react';
import {findIndexInObjectsArray, isArray} from 'helpers/helpersObjects';
import {getUuid} from 'helpers/helpersString';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import {IGridProps, IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {MRT_TableInstance} from 'material-react-table';
import scrollIntoView from 'scroll-into-view';
import {Row} from '@tanstack/table-core/src/types';

type IVerticalAlign = 'top' | 'bottom' | 'middle';

export interface IGridApi {
    /** Get grid ID */
    getGridId: () => string;

    /** Get current data set*/
    getDataSet: () => IGridRowData[];

    /** Set data set*/
    setDataSet: (dataSet: IGridRowData[] | null) => void;

    /** Insert new row/rows */
    insertRows: (rowData: IGridRowData | IGridRowData[], place?: 'before' | 'after', id?: IGridRowData['id'], updateActiveRow?: boolean) => IGridRowData[];

    /** Update existed row/rows */
    updateRows: (rowData: IGridRowData | IGridRowData[], updateActiveRow?: boolean) => IGridRowData[];

    /** Delete existed row/rows by keys */
    deleteRows: (keys: string | string[], updateActiveRow?: boolean) => IGridRowData[];

    /** Set active row */
    setActiveRowKey: (id: string | null, selectActive?: boolean, clearPrevSelection?: boolean, scrollAlign?: IVerticalAlign) => void;

    /* Get active row id */
    getActiveRowKey: () => string;

    /** Get active row/undefined by key */
    getActiveRow: () => Row<IGridRowData> | undefined;

    /* Get next row id*/
    getNextRowKey: (id: string | undefined, step?: number) => string | undefined;

    /* Get previous row id*/
    getPrevRowKey: (id: string | undefined, step?: number) => string | undefined;

    /** Get selected rows keys */
    getSelectedRowKeys: (asArray?: boolean) => Record<string, boolean> | string[];

    /** Set selected row/rows keys */
    setSelectedRowKeys: (keys: null | string | string[] | Record<string, boolean>, clearPrevSelection?: boolean) => void;

    /** gey selected mrGrid row nodes */
    getSelectedRows: (asArray?: boolean) => Record<string, Row<IGridRowData>> | Row<IGridRowData>[];

    /** gey selected mrGrid rows */
    getSelectedRowsData: (asArray?: boolean) => Record<string, IGridRowData> | IGridRowData[];

    /** Select all rows*/
    // selectAll: () => void;

    /** Select next row */
    //selectNextRow: (direction: 'next' | 'previous', ensureVisible?: boolean) => void;

    /** Select first row */
    //selectFirstRow: (ensureVisible?: boolean) => void;

    /** Select last row */
    // selectLastRow: (ensureVisible?: boolean) => void;

    /** Returns row/undefined by key */
    getRowByKey: (key: string) => Row<IGridRowData> | undefined;

    /** Returns rows list/collection/undefined by key/keys */
    // getRowsListByKeys: (keys: IGridRowData['id'] | IGridRowData['id'][], asArray?: boolean) => IGridRowData[] | Record<string, IGridRowData>;

    /** Scroll to row with the key */
    scrollToRowKey: (key: string | null, align?: IVerticalAlign) => void;

    /** edit form api */
    editFormApi: IDFormModalApi;

    /** Buttons api */
    buttonsApi: IButtonsRowApi;

    /* Current grid props */
    gridProps: IGridProps;
}

export const useInitGridApi = ({
    props,
    tableRef,
    editFormApi,
    buttonsApi,
}: {
    props: IGridProps;
    tableRef: MutableRefObject<MRT_TableInstance | null>;
    editFormApi: IDFormModalApi;
    buttonsApi: IButtonsRowApi;
}): IGridApi => {
    const [gridApi] = useState({} as IGridApi);
    const activeRowRef = useRef('');
    const [dataSet, setDataSet] = useState(props.dataSet);
    gridApi.gridProps = props;
    gridApi.editFormApi = editFormApi;
    gridApi.buttonsApi = buttonsApi;

    gridApi.getGridId = useApiGetGridId();
    gridApi.getDataSet = useApiGetDataSet(dataSet || []);
    gridApi.setDataSet = useApiSetDataSet(setDataSet);
    gridApi.getGridId = useApiGetGridId();
    gridApi.setActiveRowKey = useApiSetActiveRowKey(activeRowRef, gridApi);
    gridApi.getActiveRowKey = useApiGetActiveRowKey(activeRowRef);
    gridApi.getActiveRow = useApiGetActiveRow(gridApi);
    gridApi.getNextRowKey = useApiGetNextRowKey(tableRef);
    gridApi.getPrevRowKey = useApiGetPrevRowKey(tableRef);
    gridApi.getSelectedRowKeys = useApiGetSelectedRowKeys(tableRef);
    gridApi.getSelectedRows = useApiGetSelectedRows(tableRef);
    gridApi.getSelectedRowsData = useApiGetSelectedRowsData(tableRef);
    gridApi.setSelectedRowKeys = useApiSetSelectedRowsKeys(tableRef, gridApi);
    gridApi.getRowByKey = useApiGetRowByKey(tableRef);
    gridApi.insertRows = useApiInsertRows(gridApi);
    gridApi.updateRows = useApiUpdateRows(gridApi);
    gridApi.deleteRows = useApiDeleteRows(gridApi);

    gridApi.scrollToRowKey = useApiScrollToRowKey(gridApi);
    /*

    gridApi.deleteRowsByKey = useApiDeleteRowsByKey(gridApi);
    gridApi.selectAll = useApiSelectAll(gridApi);
    gridApi.getRowByKey = useApiGetRowByKey(rowsMap);
    gridApi.getRowsListByKeys = useApiGetRowsListByKeys(rowsMap);

    gridApi.selectNextRow = useApiSelectNextRow(gridApi);
    gridApi.selectFirstRow = useApiSelectFirstRow(gridApi);
    gridApi.selectLastRow = useApiSelectLastRow(gridApi);*/

    return gridApi;
};

/* Get grid ID */
const useApiGetGridId = (): IGridApi['getGridId'] => {
    const [gridId] = useState(getUuid());
    return useCallback(() => gridId, [gridId]);
};

/* Get current dataSet */
const useApiGetDataSet = (dataSet: IGridRowData[]): IGridApi['getDataSet'] => {
    return useCallback(() => {
        return dataSet || [];
    }, [dataSet]);
};

/* Set current dataSet */
const useApiSetDataSet = (setDataSet: React.Dispatch<React.SetStateAction<IGridRowData[] | undefined>>): IGridApi['setDataSet'] => {
    return useCallback(
        (dataSet: IGridRowData[] | null) => {
            setDataSet(dataSet || []);
        },
        [setDataSet]
    );
};

/* Set active row ID*/
const useApiSetActiveRowKey = (activeRowRef: MutableRefObject<string>, gridApi: IGridApi): IGridApi['setActiveRowKey'] => {
    return useCallback(
        (id: string | null, selectActive?: boolean, clearPrevSelection?: boolean, scrollAlign?: IVerticalAlign) => {
            activeRowRef.current = id || '';
            if (!selectActive) return;
            gridApi.scrollToRowKey(id, scrollAlign);
            gridApi.setSelectedRowKeys(id, clearPrevSelection);
        },
        [gridApi, activeRowRef]
    );
};

/* Get active row ID*/
const useApiGetActiveRowKey = (activeRowRef: MutableRefObject<string>): IGridApi['getActiveRowKey'] => {
    return useCallback(() => activeRowRef.current, [activeRowRef]);
};

/* Get active row*/
const useApiGetActiveRow = (gridApi: IGridApi): IGridApi['getActiveRow'] => {
    return useCallback(() => {
        const activeRowKey = gridApi.getActiveRowKey();
        return gridApi.getRowByKey(activeRowKey);
    }, [gridApi]);
};

const useApiGetNextRowKey = (tableRef: MutableRefObject<MRT_TableInstance | null>): IGridApi['getNextRowKey'] => {
    return useCallback(
        (id: string | null | undefined, step?: number) => {
            if (!tableRef.current) return undefined;
            const tableApi = tableRef.current;
            const rows = tableApi.getRowModel().rows;
            if (rows?.length === 0) return undefined;
            if (!id) return rows[0].id;
            const curRow = tableApi.getRowModel().rowsById[id];
            if (!curRow) return rows[0].id;
            const curIndex = rows.indexOf(curRow);
            if (curIndex < 0) return rows[0].id;
            if (typeof step === 'undefined') step = 1;
            if (curIndex + step <= rows.length - 1) return rows[curIndex + step].id;
            else return rows[rows.length - 1].id;
        },
        [tableRef]
    );
};

const useApiGetPrevRowKey = (tableRef: MutableRefObject<MRT_TableInstance | null>): IGridApi['getPrevRowKey'] => {
    return useCallback(
        (id: string | null | undefined, step?: number) => {
            if (!tableRef.current) return undefined;
            const tableApi = tableRef.current;
            const rows = tableApi.getRowModel().rows;
            if (rows?.length === 0) return undefined;
            if (!id) return rows[rows.length - 1].id;
            const curRow = tableApi.getRowModel().rowsById[id];
            if (!curRow) return rows[rows.length - 1].id;
            const curIndex = rows.indexOf(curRow);
            if (curIndex < 0) return rows[rows.length - 1].id;
            if (typeof step === 'undefined') step = 1;
            if (curIndex - step < 0) return rows[0].id;
            else return rows[curIndex - step].id;
        },
        [tableRef]
    );
};

const useApiGetSelectedRowKeys = (tableRef: MutableRefObject<MRT_TableInstance | null>): IGridApi['getSelectedRowKeys'] => {
    const prevRowSelectionRef = useRef<Record<string, boolean>>({});
    const prevRowSelectionArrayRef = useRef<string[]>([]);

    return useCallback(
        (asArray?: boolean): Record<string, boolean> | string[] => {
            if (!tableRef.current) return asArray ? [] : {};
            const tableApi = tableRef.current;
            const rowSelection = tableApi.getState().rowSelection;
            if (!asArray) return rowSelection;
            if (prevRowSelectionRef.current === rowSelection) return prevRowSelectionArrayRef.current;

            const rowSelectionArray: string[] = [];

            for (const id in rowSelection) {
                if (rowSelection[id]) rowSelectionArray.push(id);
            }

            prevRowSelectionRef.current = rowSelection;
            prevRowSelectionArrayRef.current = rowSelectionArray;
            return rowSelectionArray;
        },
        [tableRef]
    );
};

const useApiSetSelectedRowsKeys = (tableRef: MutableRefObject<MRT_TableInstance | null>, gridApi: IGridApi): IGridApi['setSelectedRowKeys'] => {
    return useCallback(
        (keys: null | string | string[] | Record<string, boolean>, clearPrevSelection?: boolean) => {
            const curSelectedKeys = gridApi.getSelectedRowKeys() as Record<string, boolean>;

            let newSelectedKeys: Record<string, boolean> = {};

            if (typeof keys === 'string') newSelectedKeys[keys] = true;
            else if (typeof keys === 'object') {
                if (isArray(keys)) {
                    for (const key of keys as string[]) {
                        newSelectedKeys[key] = true;
                    }
                } else newSelectedKeys = keys as Record<string, boolean>;
            }

            const resultSelectedKeys = !clearPrevSelection ? {...curSelectedKeys, ...newSelectedKeys} : newSelectedKeys;

            if (!tableRef.current) return;
            const tableApi = tableRef.current;

            const setRowSelection = tableApi.setRowSelection;
            setRowSelection(resultSelectedKeys);
        },
        [gridApi, tableRef]
    );
};

const useApiGetSelectedRows = (tableRef: MutableRefObject<MRT_TableInstance | null>): IGridApi['getSelectedRows'] => {
    const prevRowSelectionRef = useRef<Record<string, boolean>>({});
    const prevSelectedRowsRef = useRef<Record<string, Row<IGridRowData>>>({});
    const prevSelectedRowsArrayRef = useRef<Row<IGridRowData>[]>([]);

    return useCallback(
        (asArray?: boolean): Record<string, Row<IGridRowData>> | Row<IGridRowData>[] => {
            if (!tableRef.current) return asArray ? [] : {};
            const tableApi = tableRef.current;
            const rowSelection = tableApi.getState().rowSelection;

            if (prevRowSelectionRef.current === rowSelection) {
                return !asArray ? prevSelectedRowsRef.current : prevSelectedRowsArrayRef.current;
            }

            const selectedRows: Record<string, Row<IGridRowData>> = {};
            const selectedRowsArray: Row<IGridRowData>[] = [];

            for (const id in rowSelection) {
                if (!rowSelection[id]) continue;
                const row = tableApi.getRowModel().rowsById[id] as unknown as Row<IGridRowData>;
                if (!row) continue;
                if (!asArray) selectedRows[id] = row;
                else selectedRowsArray.push(row);
            }

            if (!asArray) {
                prevSelectedRowsRef.current = selectedRows;
                return selectedRows;
            }

            prevSelectedRowsArrayRef.current = selectedRowsArray;
            return selectedRowsArray;
        },
        [tableRef]
    );
};

const useApiGetSelectedRowsData = (tableRef: MutableRefObject<MRT_TableInstance | null>): IGridApi['getSelectedRowsData'] => {
    const prevRowSelectionRef = useRef<Record<string, boolean>>({});
    const prevSelectedRowsRef = useRef<Record<string, IGridRowData>>({});
    const prevSelectedRowsArrayRef = useRef<IGridRowData[]>([]);

    return useCallback(
        (asArray?: boolean): Record<string, IGridRowData> | IGridRowData[] => {
            if (!tableRef.current) return asArray ? [] : {};
            const tableApi = tableRef.current;
            const rowSelection = tableApi.getState().rowSelection;

            if (prevRowSelectionRef.current === rowSelection) {
                return !asArray ? prevSelectedRowsRef.current : prevSelectedRowsArrayRef.current;
            }

            const selectedRows: Record<string, IGridRowData> = {};
            const selectedRowsArray: IGridRowData[] = [];

            for (const id in rowSelection) {
                if (!rowSelection[id]) continue;
                const row = tableApi.getRowModel().rowsById[id] as unknown as Row<IGridRowData>;
                if (!row) continue;
                if (!asArray) selectedRows[id] = row.original;
                else selectedRowsArray.push(row.original);
            }

            if (!asArray) {
                prevSelectedRowsRef.current = selectedRows;
                return selectedRows;
            }

            prevSelectedRowsArrayRef.current = selectedRowsArray;
            return selectedRowsArray;
        },
        [tableRef]
    );
};

const useApiScrollToRowKey = (gridApi: IGridApi): IGridApi['scrollToRowKey'] => {
    return useCallback(
        (key: string | null, align?: IVerticalAlign) => {
            const scrollMethod = () => {
                if (!key) return;

                const $row = document.querySelector('.grid-container-' + gridApi.getGridId() + ' tr[data-row-key="' + key + '"]') as HTMLElement;
                if (!$row) return;

                const $container = document.querySelector('.grid-container-' + gridApi.getGridId()) as HTMLElement;
                const $head = document.querySelector('.grid-head-' + gridApi.getGridId()) as HTMLElement;
                const headHeight = $head.offsetHeight;

                const offset = headHeight;

                const rowPosition = $row.getBoundingClientRect();

                const containerPosition = $container.getBoundingClientRect();
                if (rowPosition.top - offset >= containerPosition.top && rowPosition.bottom <= containerPosition.bottom) return;

                let topOffset = 0;
                let alignTop = 0.5;
                if (align === 'top') alignTop = 0;
                else if (align === 'bottom') alignTop = 1;

                if (alignTop < 1) topOffset = headHeight;

                scrollIntoView($row, {
                    align: {top: alignTop, lockX: true, topOffset: topOffset},
                    validTarget: function (target: HTMLElement) {
                        return target === $container;
                    },
                    //debug: true,
                    time: 100,
                });
            };

            setTimeout(scrollMethod, 0); //need timeout because often at the time of the call the grid has not yet been redrawn and the row IDs have not been set
        },
        [gridApi]
    );
};

const useApiGetRowByKey = (tableRef: MutableRefObject<MRT_TableInstance | null>): IGridApi['getRowByKey'] => {
    return useCallback(
        (key: string) => {
            if (!key || !tableRef.current) return undefined;
            const tableApi = tableRef.current;
            return tableApi.getRowModel().rowsById[key] as unknown as Row<IGridRowData>;
        },
        [tableRef]
    );
};

const useApiInsertRows = (gridApi: IGridApi): IGridApi['insertRows'] => {
    return useCallback(
        (rows: IGridRowData[] | IGridRowData, place?: 'before' | 'after', id?: string | number, updateActiveRow?: boolean): IGridRowData[] => {
            const gridProps = gridApi.gridProps;
            if (!place) place = 'after';

            const clonedDataSet = [...gridApi.getDataSet()];

            const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

            if (!id) {
                if (place === 'before') {
                    for (const row of clonedRows) {
                        if (!row.id) row.id = getUuid();
                        clonedDataSet.unshift(row);
                    }
                } else {
                    for (const row of clonedRows) {
                        if (!row.id) row.id = getUuid();
                        clonedDataSet.push(row);
                    }
                }
            } else {
                let index = findIndexInObjectsArray(clonedDataSet, 'id', id);

                if (index < 0) index = place === 'before' ? 0 : clonedDataSet.length;
                else if (place === 'after') index = index + 1;

                for (let i = clonedRows.length - 1; i >= 0; i--) {
                    const row = clonedRows[i];
                    if (!row.id) row.id = getUuid();
                    clonedDataSet.splice(index, 0, row);
                }
            }

            const newDataSet = gridProps?.callbacks?.onDataSetChange?.(clonedDataSet) || clonedDataSet;
            gridApi.setDataSet(newDataSet);

            if (updateActiveRow && clonedRows[0]) gridApi.setActiveRowKey(clonedRows[0].id, true, true, 'bottom');

            return clonedDataSet;
        },
        [gridApi]
    );
};

const useApiUpdateRows = (gridApi: IGridApi): IGridApi['updateRows'] => {
    return useCallback(
        (rows: IGridRowData[] | IGridRowData, updateActiveRow?: boolean): IGridRowData[] => {
            const gridProps = gridApi.gridProps;
            const clonedDataSet = [...gridApi.getDataSet()];

            const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

            for (let i = clonedRows.length - 1; i >= 0; i--) {
                const row = clonedRows[i];
                const index = findIndexInObjectsArray(clonedDataSet, 'id', row.id);
                if (index < 0) continue;
                clonedDataSet[index] = row;
            }

            const newDataSet = gridProps?.callbacks?.onDataSetChange?.(clonedDataSet) || clonedDataSet;
            gridApi.setDataSet(newDataSet);

            if (updateActiveRow && clonedRows[0]) gridApi.setActiveRowKey(clonedRows[0].id, true, true, 'middle');

            return clonedDataSet;
        },
        [gridApi]
    );
};

const useApiDeleteRows = (gridApi: IGridApi): IGridApi['deleteRows'] => {
    return useCallback(
        (keys: string[] | string, updateActiveRow?: boolean): IGridRowData[] => {
            const gridProps = gridApi.gridProps;
            const clonedDataSet = [...gridApi.getDataSet()];

            const clonedKeys: string[] = isArray(keys) ? [...(keys as string[])] : [keys as string];

            let newSelectedId = '';
            for (const key of clonedKeys) {
                const index = findIndexInObjectsArray(clonedDataSet, 'id', key);
                if (index < 0) continue;
                if (newSelectedId === key) newSelectedId = '';
                if (!newSelectedId && clonedDataSet[index + 1]) newSelectedId = clonedDataSet[index + 1].id;
                clonedDataSet.splice(index, 1);
            }

            if (!newSelectedId && clonedDataSet[clonedDataSet.length - 1]) newSelectedId = clonedDataSet[clonedDataSet.length - 1].id;

            const newDataSet = gridProps?.callbacks?.onDataSetChange?.(clonedDataSet) || clonedDataSet;
            gridApi.setDataSet(newDataSet);

            if (updateActiveRow && newSelectedId) gridApi.setActiveRowKey(newSelectedId, true, true, 'bottom');

            return clonedDataSet;
        },
        [gridApi]
    );
};

/*

const useApiSelectAll = (gridApi: IGridApi) => {
    return useCallback(() => {
        gridApi.setSelectedRows(gridApi.dataSet(), true);
    }, [gridApi]);
};

const useApiSelectFirstRow = (gridApi: IGridApi) => {
    return useCallback(
        (ensureVisible?: boolean) => {
            const rows = gridApi.dataSet();
            if (rows.length === 0) return;
            const nextRowId = rows[0].id;
            gridApi.setSelectedRowKeys(nextRowId, true);

            if (ensureVisible) gridApi.scrollToRowKey(nextRowId, true);
        },
        [gridApi]
    );
};

const useApiSelectLastRow = (gridApi: IGridApi) => {
    return useCallback(
        (ensureVisible?: boolean) => {
            const rows = gridApi.dataSet();
            if (rows.length === 0) return;
            const nextRowId = rows[rows.length - 1].id;
            gridApi.setSelectedRowKeys(nextRowId, true);

            if (ensureVisible) gridApi.scrollToRowKey(nextRowId, true);
        },
        [gridApi]
    );
};



const useApiGetRowsListByKeys = (rowsMap: IGridRowsMap): IGridApi['getRowsListByKeys'] => {
    return useCallback(
        (keys: IGridRowData['id'][] | string | number, asArray?: boolean) => {
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

*/
