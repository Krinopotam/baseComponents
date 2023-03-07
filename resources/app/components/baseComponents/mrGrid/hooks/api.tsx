import React, {MutableRefObject, useCallback, useState} from 'react';
import {isArray} from 'helpers/helpersObjects';
import {getUuid} from 'helpers/helpersString';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import {IGridProps, IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {MRT_TableInstance} from 'material-react-table';

export interface IGridApi<TData extends IGridRowData> {
    /* Get grid ID */
    getGridId: () => string;

    /** Get or set current data set*/
    //dataSet: (rows?: IGridRowData[] | null) => IGridRowData[];

    /** Insert new row/rows */
    //insertRows: (rowData: IGridRowData | IGridRowData[], place?: 'before' | 'after', id?: IGridRowData['id'], updateSelection?: boolean) => IGridRowData[];

    /** Update existed row/rows */
    // updateRows: (rowData: IGridRowData | IGridRowData[], updateSelection?: boolean) => IGridRowData[];

    /** Delete existed row/rows by keys */
    //deleteRowsByKey: (keys: IGridRowData['id'] | IGridRowData['id'][], updateSelection?: boolean) => IGridRowData[];

    /** Remove existed row/rows */
    //deleteRows: (rowData: IGridRowData | IGridRowData[], updateSelection?: boolean) => IGridRowData[];

    /** Set active row */
    setActiveRowKey: (id: string | null, selectActive?: boolean, clearPrevSelection?:boolean) => void;

    /* Get active row id */
    getActiveRowKey: () => string;

    /* Get next row id*/
    getNextRowKey: (id: string | null | undefined, step?: number) => string | undefined;

    /* Get previous row id*/
    getPrevRowKey: (id: string | null | undefined, step?: number) => string | undefined;

    /** Get selected rows keys */
    getSelectedKeys: (asArray?: boolean) => Record<string, boolean> | string[];

    /** Set selected row/rows keys */
    setSelectedRowKeys: (keys: null | string | string[] | Record<string, boolean>, clearPrevSelection?: boolean) => void;

    /** Get selected row node/nodes */
    //getSelectedRows: () => IGridRowData[];

    /** Set selected row/rows */
    //setSelectedRows: (row: IGridRowData | IGridRowData[] | null, clearOldSelection?: boolean) => void;

    /** Select all rows*/
    // selectAll: () => void;

    /** Select next row */
    //selectNextRow: (direction: 'next' | 'previous', ensureVisible?: boolean) => void;

    /** Select first row */
    //selectFirstRow: (ensureVisible?: boolean) => void;

    /** Select last row */
    // selectLastRow: (ensureVisible?: boolean) => void;

    /** Returns row/undefined by key */
    // getRowByKey: (key: IGridRowData['id']) => IGridRowData | undefined;

    /** Returns rows list/collection/undefined by key/keys */
    // getRowsListByKeys: (keys: IGridRowData['id'] | IGridRowData['id'][], asArray?: boolean) => IGridRowData[] | Record<string, IGridRowData>;

    /** Scroll to row with the key */
    // scrollToRowKey: (key: IGridRowData['id'], skipIfVisible?: boolean) => void;

    /** edit form api */
    editFormApi: IDFormModalApi;

    /** Buttons api */
    buttonsApi: IButtonsRowApi;

    /* Current grid props */
    gridProps: IGridProps<TData>;
}

export const useInitGridApi = <TData extends IGridRowData>({
    props,
    tableRef,
    editFormApi,
    buttonsApi,
}: {
    props: IGridProps<TData>;
    tableRef: MutableRefObject<MRT_TableInstance | null>;
    editFormApi: IDFormModalApi;
    buttonsApi: IButtonsRowApi;
}): IGridApi<TData> => {
    const [gridApi] = useState({} as IGridApi<TData>);
    const [activeRow, setActiveRow] = useState<string>('');

    gridApi.gridProps = props;
    gridApi.editFormApi = editFormApi;
    gridApi.buttonsApi = buttonsApi;

    gridApi.getGridId = useApiGetGridId();
    gridApi.setActiveRowKey = useApiSetActiveRowKey(setActiveRow, gridApi);
    gridApi.getActiveRowKey = useApiGetActiveRowKey(activeRow);
    gridApi.getNextRowKey = useApiGetNextRowKey(tableRef);
    gridApi.getPrevRowKey = useApiGetPrevRowKey(tableRef);
    gridApi.getSelectedKeys = useApiGetSelectedKeys(tableRef);
    gridApi.setSelectedRowKeys = useApiSetSelectedRowsKeys<TData>(tableRef, gridApi);

    /* gridApi.dataSet = useApiDataSet(dataSet, setDataSet);
    gridApi.insertRows = useApiInsertRows(gridApi);
    gridApi.updateRows = useApiUpdateRows(gridApi);
    gridApi.deleteRowsByKey = useApiDeleteRowsByKey(gridApi);
    gridApi.deleteRows = useApiDeleteRows(gridApi);
    gridApi.getSelectedRowKeys = useApiGetSelectedRowKeys(selectedRowKeys);
    gridApi.setSelectedRowKeys = useApiSetSelectedRowKeys(gridApi, setSelectedRowKeys);
    gridApi.getSelectedRows = useApiGetSelectedRows(gridApi);
    gridApi.setSelectedRows = useApiSetSelectedRows(gridApi);
    gridApi.selectAll = useApiSelectAll(gridApi);
    gridApi.getRowByKey = useApiGetRowByKey(rowsMap);
    gridApi.getRowsListByKeys = useApiGetRowsListByKeys(rowsMap);
    gridApi.scrollToRowKey = useApiScrollToRowKey(gridApi, gridId);
    gridApi.selectNextRow = useApiSelectNextRow(gridApi);
    gridApi.selectFirstRow = useApiSelectFirstRow(gridApi);
    gridApi.selectLastRow = useApiSelectLastRow(gridApi);*/

    return gridApi;
};

/* Get grid ID */
const useApiGetGridId = () => {
    const [gridId] = useState(getUuid());
    return useCallback(() => gridId, [gridId]);
};

/* Set active row ID*/
const useApiSetActiveRowKey = <TData extends IGridRowData>(setActiveRow: React.Dispatch<React.SetStateAction<string>>, gridApi: IGridApi<TData>) => {
    return useCallback(
        (id: string | null, selectActive?: boolean, clearPrevSelection?:boolean) => {
            setActiveRow(id || '');
            if (!selectActive) return;
            gridApi.setSelectedRowKeys(id, clearPrevSelection);
        },
        [gridApi, setActiveRow]
    );
};

/* Get active row ID*/
const useApiGetActiveRowKey = (activeRow: string) => {
    return useCallback(() => activeRow, [activeRow]);
};

const useApiGetNextRowKey = (tableRef: MutableRefObject<MRT_TableInstance | null>) => {
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
            if (curIndex + step<=rows.length - 1 ) return rows[curIndex + step].id;
            else return rows[rows.length - 1].id;
        },
        [tableRef]
    );
};

const useApiGetPrevRowKey = (tableRef: MutableRefObject<MRT_TableInstance | null>) => {
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

const useApiGetSelectedKeys = (tableRef: MutableRefObject<MRT_TableInstance | null>) => {
    return useCallback(
        (asArray?: boolean): Record<string, boolean> | string[] => {
            if (!tableRef.current) return asArray ? [] : {};
            const tableApi = tableRef.current;
            const rowSelection = tableApi.getState().rowSelection;
            if (!asArray) return rowSelection;

            const result: string[] = [];

            for (const id in rowSelection) {
                if (rowSelection[id]) result.push(id);
            }

            return result;
        },
        [tableRef]
    );
};

const useApiSetSelectedRowsKeys = <TData extends IGridRowData>(tableRef: MutableRefObject<MRT_TableInstance | null>, gridApi: IGridApi<TData>) => {
    return useCallback(
        (keys: null | string | string[] | Record<string, boolean>, clearPrevSelection?: boolean) => {
            const curSelectedKeys = gridApi.getSelectedKeys() as Record<string, boolean>;

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

/*
const useApiDataSet = (dataSet: IGridRowData[], setDataSet: (dataSet: IGridRowData[]) => void): IGridApi['dataSet'] => {
    return useCallback(
        (rows: IGridRowData[] | null | undefined): IGridRowData[] => {
            if (typeof rows === 'undefined') return dataSet;
            const _rows = rows ? rows : [];
            setDataSet(_rows);
            return _rows;
        },
        [dataSet, setDataSet]
    );
};

const useApiInsertRows = (gridApi: IGridApi): IGridApi['insertRows'] => {
    return useCallback(
        (rows: IGridRowData[] | IGridRowData, place?: 'before' | 'after', id?: string | number, updateSelection?: boolean): IGridRowData[] => {
            const gridProps = gridApi.gridProps;
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
                gridApi.setSelectedRowKeys(_rows[0].id, true);
                gridApi.scrollToRowKey(_rows[0].id, true);
            }

            return _dataSet;
        },
        [gridApi]
    );
};

const useApiUpdateRows = (gridApi: IGridApi): IGridApi['updateRows'] => {
    return useCallback(
        (rows: IGridRowData[] | IGridRowData, updateSelection?: boolean): IGridRowData[] => {
            const gridProps = gridApi.gridProps;
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
                gridApi.setSelectedRowKeys(_rows[0].id, true);
                gridApi.scrollToRowKey(_rows[0].id, true);
            }

            return _dataSet;
        },
        [gridApi]
    );
};

const useApiDeleteRowsByKey = (gridApi: IGridApi): IGridApi['deleteRowsByKey'] => {
    return useCallback(
        (keys: IGridRowData['id'][] | string | number, updateSelection?: boolean): IGridRowData[] => {
            const gridProps = gridApi.gridProps;
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
                gridApi.setSelectedRowKeys(newSelectedId, true);
                gridApi.setSelectedRowKeys(newSelectedId, true);
            }

            return _dataSet;
        },
        [gridApi]
    );
};

const useApiDeleteRows = (gridApi: IGridApi): IGridApi['deleteRows'] => {
    return useCallback(
        (rows: IGridRowData | IGridRowData[], updateSelection?: boolean): IGridRowData[] => {
            const _rows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];
            const keys = [];
            for (const row of _rows) keys.push(row.id);
            return gridApi.deleteRowsByKey(keys, updateSelection);
        },
        [gridApi]
    );
};

const useApiGetSelectedRowKeys = (selectedRowKeys: (string | number)[]): IGridApi['getSelectedRowKeys'] => {
    return useCallback(() => {
        return selectedRowKeys;
    }, [selectedRowKeys]);
};



const useApiGetSelectedRows = (gridApi: IGridApi): IGridApi['getSelectedRows'] => {
    return useCallback(() => {
        const selectedKeys = gridApi.getSelectedRowKeys();
        return gridApi.getRowsListByKeys(selectedKeys, true) as IGridRowData[];
    }, [gridApi]);
};

const useApiSetSelectedRows = (gridApi: IGridApi) => {
    return useCallback(
        (row: IGridRowData | IGridRowData[] | null, clearOldSelection?: boolean) => {
            if (!row) {
                gridApi.setSelectedRowKeys(null);
            }

            const rows: IGridRowData[] = isArray(row) ? (row as IGridRowData[]) : [row as IGridRowData];
            const keys = [];
            for (const curRow of rows) {
                keys.push(curRow.id);
            }

            gridApi.setSelectedRowKeys(keys, clearOldSelection);
        },
        [gridApi]
    );
};

const useApiSelectAll = (gridApi: IGridApi) => {
    return useCallback(() => {
        gridApi.setSelectedRows(gridApi.dataSet(), true);
    }, [gridApi]);
};

const useApiSelectNextRow = (gridApi: IGridApi) => {
    return useCallback(
        (direction: 'next' | 'previous', ensureVisible?: boolean) => {
            const rows = gridApi.dataSet();
            if (rows.length === 0) return;
            const currentSelected = gridApi.getSelectedRowKeys();
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

            gridApi.setSelectedRowKeys(nextRowId, true);

            if (ensureVisible) gridApi.scrollToRowKey(nextRowId, true);
        },
        [gridApi]
    );
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

const useApiGetRowByKey = (dataSetMap: Record<string, IGridRowData>): IGridApi['getRowByKey'] => {
    return useCallback(
        (key: string | number) => {
            return dataSetMap[key];
        },
        [dataSetMap]
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

const useApiScrollToRowKey = (gridApi: IGridApi, gridId: string): IGridApi['scrollToRowKey'] => {
    const [scrollToRow, setScrollToRow] = useState<IGridRowData['id']>('');

    const scrollToRowHandle = useCallback(
        (key: IGridRowData['id'], skipIfVisible?: boolean) => {
            const $row = document.querySelector('tr[data-row-key="' + key + '"]') as HTMLElement;
            const gridProps = gridApi.gridProps;
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
        [gridApi, gridId]
    );

    useLayoutEffect(() => {
        if (scrollToRow) scrollToRowHandle(scrollToRow, true);
        setScrollToRow('');
    }, [scrollToRow, scrollToRowHandle]);

    return setScrollToRow;
};
*/
