import React, {MutableRefObject, useCallback, useRef, useState} from 'react';
import {getUuid} from 'helpers/helpersString';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import useUnmountedRef from 'ahooks/lib/useUnmountedRef';
import {TPromise} from 'baseComponents/serviceTypes';
import {MessageBox} from 'baseComponents/messageBox';
import {IGridProps, IGridRowData} from '../tabulatorGrid';
import {RowComponent, ScrollToRowPosition, TabulatorFull as Tabulator} from 'tabulator-tables';
import {ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {isArray} from 'components/baseComponents/libs/helpers/helpersObjects';

type IRowKey = IGridRowData['id'];
type IRowKeys = IRowKey | IRowKey[];

export interface IGridApi {
    /** Get grid ID */
    getGridId: () => string;

    /** Current grid props */
    gridProps: IGridProps;

    /** Component table instance (Tabulator) */
    tableApi: ITabulator | undefined;

    /** Get grid mounted state */
    getIsMounted: () => boolean;

    /** Get current data set*/
    getDataSet: () => IGridRowData[];

    /** Set data set*/
    setDataSet: (dataSet: IGridRowData[] | null | undefined) => void;

    /** Get current loading state */
    getIsLoading: () => boolean;

    /** Set current loading state */
    setIsLoading: (isLoading: boolean) => void;

    /** Insert new row/rows */
    insertRows: (rowData: IGridRowData | IGridRowData[], place?: 'above' | 'below', key?: IRowKey, updateActiveRow?: boolean) => void;

    /** Update existed row/rows */
    updateRows: (rowData: IGridRowData | IGridRowData[], updateActiveRow?: boolean) => void;

    /** Delete existed row/rows by keys */
    deleteRowsByKeys: (keys: IRowKeys) => void;

    /** Delete existed row/rows */
    deleteRows: (rowData: IGridRowData | IGridRowData[]) => void;

    /** Set active row */
    setActiveRowKey: (key: IRowKey | null, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) => void;

    /* Get active row key */
    getActiveRowKey: () => IRowKey | undefined;

    /** Get active row node */
    getActiveNode: () => RowComponent | undefined;

    /** Get active row */
    getActiveRow: () => IGridRowData | undefined;

    /* Get next row key */
    getNextRowKey: (key: IRowKey, step?: number) => IRowKey | undefined;

    /* Get previous row key */
    getPrevRowKey: (key: IRowKey, step?: number) => IRowKey | undefined;

    /** Get selected rows keys */
    getSelectedRowKeys: () => IRowKey[];

    /** Set selected row/rows keys */
    setSelectedRowKeys: (keys: IRowKeys | null | undefined, clearPrevSelection?: boolean) => void;

    /** Get selected tabulator row nodes */
    getSelectedNodes: () => RowComponent[];

    /** Get selected rows */
    getSelectedRows: () => IGridRowData[];

    /** Select all rows*/
    // selectAll: () => void;

    /** Select next row */
    //selectNextRow: (direction: 'next' | 'previous', ensureVisible?: boolean) => void;

    /** Select first row */
    //selectFirstRow: (ensureVisible?: boolean) => void;

    /** Select last row */
    // selectLastRow: (ensureVisible?: boolean) => void;

    /** Returns row node by key */
    getNodeByKey: (key: IRowKey) => RowComponent | undefined;

    /** Returns row by key */
    getRowByKey: (key: IRowKey) => IGridRowData | undefined;

    /** edit form api */
    editFormApi: IDFormModalApi;

    /** Buttons api */
    buttonsApi: IButtonsRowApi & {refreshButtons: () => void};

    /** Fetch data */
    fetchData: (dataSource?: IGridDataFetchPromise) => void;
}

export type IGridDataFetchPromise = TPromise<{data: IGridRowData[]}, {message: string; code: number}>;

export const useInitGridApi = ({
    gridApi,
    props,
    tableRef,
    editFormApi,
    buttonsApi,
}: {
    gridApi: IGridApi;
    props: IGridApi['gridProps'];
    tableRef: MutableRefObject<Tabulator | undefined>;
    editFormApi: IGridApi['editFormApi'];
    buttonsApi: IGridApi['buttonsApi'];
}): IGridApi => {
    const dataSetRef = useRef<IGridProps['dataSet']>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const unmountRef = useUnmountedRef();

    useUpdateDataSetFromProps(dataSetRef, props.dataSet);

    gridApi.gridProps = props;
    gridApi.tableApi = tableRef.current as ITabulator;
    gridApi.editFormApi = editFormApi;
    gridApi.buttonsApi = buttonsApi;
    gridApi.getIsMounted = useApiIsMounted(unmountRef);
    gridApi.getGridId = useApiGetGridId(gridApi);
    gridApi.getDataSet = useApiGetDataSet(dataSetRef);
    gridApi.setDataSet = useApiSetDataSet(dataSetRef, gridApi);
    gridApi.getIsLoading = useApiGetIsLoading(isLoading);
    gridApi.setIsLoading = useApiSetIsLoading(setIsLoading);
    gridApi.setActiveRowKey = useApiSetActiveRowKey(gridApi);
    gridApi.getActiveRowKey = useApiGetActiveRowKey(gridApi);
    gridApi.getActiveNode = useApiGetActiveNode(gridApi);
    gridApi.getActiveRow = useApiGetActiveRow(gridApi);
    gridApi.getNextRowKey = useApiGetNextRowKey(gridApi);
    gridApi.getPrevRowKey = useApiGetPrevRowKey(gridApi);
    gridApi.getSelectedRowKeys = useApiGetSelectedRowKeys(gridApi);
    gridApi.getSelectedNodes = useApiGetSelectedNodes(gridApi);
    gridApi.getSelectedRows = useApiGetSelectedRows(gridApi);
    gridApi.setSelectedRowKeys = useApiSetSelectedRowsKeys(gridApi);
    gridApi.getNodeByKey = useApiGetNodeByKey(gridApi);
    gridApi.getRowByKey = useApiGetRowByKey(gridApi);
    gridApi.insertRows = useApiInsertRows(dataSetRef, gridApi);
    gridApi.updateRows = useApiUpdateRows(dataSetRef, gridApi);
    gridApi.deleteRowsByKeys = useApiDeleteRowsByKeys(dataSetRef, gridApi);
    gridApi.deleteRows = useApiDeleteRows(gridApi);
    gridApi.fetchData = useApiFetchData(gridApi);
    /*
    gridApi.selectAll = useApiSelectAll(gridApi);
    gridApi.selectNextRow = useApiSelectNextRow(gridApi);
    gridApi.selectFirstRow = useApiSelectFirstRow(gridApi);
    gridApi.selectLastRow = useApiSelectLastRow(gridApi);*/

    return gridApi;
};

/**
 * DataSet can change both via Props and via api.
 * If the DataSet has changed via Props, set the new current dataSet
 */
const useUpdateDataSetFromProps = (curDataSetRef: MutableRefObject<IGridProps['dataSet'] | undefined>, propsDataSet: IGridProps['dataSet']) => {
    const propsDataSetRef = useRef<IGridProps['dataSet']>(undefined);
    if (propsDataSetRef.current === propsDataSet) return;
    propsDataSetRef.current = propsDataSet;
    curDataSetRef.current = propsDataSet;
};

const useApiGetGridId = (gridApi: IGridApi): IGridApi['getGridId'] => {
    const [gridId] = useState(gridApi.gridProps.id || 'grid-' + getUuid());
    return useCallback(() => gridId, [gridId]);
};

const useApiIsMounted = (unmountRef: React.MutableRefObject<boolean>): IGridApi['getIsMounted'] => {
    return useCallback(() => !unmountRef.current, [unmountRef]);
};

const useApiGetDataSet = (dataSetRef: React.MutableRefObject<IGridProps['dataSet'] | undefined>): IGridApi['getDataSet'] => {
    return useCallback(() => dataSetRef.current || [], [dataSetRef]);
};

const useApiSetDataSet = (dataSetRef: React.MutableRefObject<IGridProps['dataSet']>, gridApi: IGridApi): IGridApi['setDataSet'] => {
    return useCallback(
        (dataSet: IGridProps['dataSet'] | null) => {
            if (gridApi.tableApi?.initialized) {
                gridApi.tableApi?.deselectRow();
                gridApi.tableApi?.clearData();
            }
            const newDataSet = gridApi.gridProps.callbacks?.onDataSetChange?.(dataSet || undefined, gridApi) || dataSet;
            dataSetRef.current = newDataSet as IGridProps['dataSet'];
            gridApi.tableApi?.addData(dataSetRef.current);
        },
        [dataSetRef, gridApi]
    );
};

const useApiGetIsLoading = (isLoading: boolean): IGridApi['getIsLoading'] => {
    return useCallback(() => {
        return isLoading;
    }, [isLoading]);
};

const useApiSetIsLoading = (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>): IGridApi['setIsLoading'] => {
    return useCallback(
        (isLoading: boolean) => {
            setIsLoading(isLoading);
        },
        [setIsLoading]
    );
};

const useApiSetActiveRowKey = (gridApi: IGridApi): IGridApi['setActiveRowKey'] => {
    return useCallback(
        (key: IRowKey | null, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) => {
            gridApi.tableApi?.setActiveRowByKey(key, clearSelection, scrollPosition);
        },
        [gridApi]
    );
};

const useApiGetActiveRowKey = (gridApi: IGridApi): IGridApi['getActiveRowKey'] => {
    return useCallback(() => (gridApi.tableApi?.initialized ? gridApi.tableApi?.getActiveRowKey() : undefined), [gridApi]);
};

const useApiGetActiveNode = (gridApi: IGridApi): IGridApi['getActiveNode'] => {
    return useCallback(() => (gridApi.tableApi?.initialized ? gridApi.tableApi?.getActiveRow() : undefined), [gridApi]);
};

const useApiGetActiveRow = (gridApi: IGridApi): IGridApi['getActiveRow'] => {
    return useCallback(() => {
        return gridApi.getActiveNode()?.getData();
    }, [gridApi]);
};

const useApiGetNextRowKey = (gridApi: IGridApi): IGridApi['getNextRowKey'] => {
    return useCallback(
        (key: IRowKey, step?: number) => {
            if (!key) return undefined;
            if (!step) step = 1;
            let curNode: RowComponent | undefined = gridApi.tableApi?.getRow(key);
            if (!curNode) return undefined;
            for (let i = 0; i < step; i++) {
                const nextNode = curNode?.getNextRow();
                if (!nextNode) return curNode.getData().id;
                curNode = nextNode;
            }

            return curNode.getData().id;
        },
        [gridApi.tableApi]
    );
};

const useApiGetPrevRowKey = (gridApi: IGridApi): IGridApi['getPrevRowKey'] => {
    return useCallback(
        (key: IRowKey, step?: number) => {
            if (!key) return undefined;
            if (!step) step = 1;
            let curNode: RowComponent | undefined = gridApi.tableApi?.getRow(key);
            if (!curNode) return undefined;
            for (let i = 0; i < step; i++) {
                const prevNode = curNode?.getPrevRow();
                if (!prevNode) return curNode.getData().id;
                curNode = prevNode;
            }

            return curNode.getData().id;
        },
        [gridApi.tableApi]
    );
};

const useApiGetSelectedRowKeys = (gridApi: IGridApi): IGridApi['getSelectedRowKeys'] => {
    const emptyArray = useRef<IRowKey[]>([]);
    return useCallback((): IRowKey[] => {
        if (!gridApi.tableApi) return emptyArray.current;
        const selectedRows = gridApi.tableApi.getSelectedData() as IGridRowData[];

        const result: IRowKey[] = [];

        for (const row of selectedRows) {
            result.push(row.id);
        }

        return result;
    }, [gridApi]);
};

const useApiSetSelectedRowsKeys = (gridApi: IGridApi): IGridApi['setSelectedRowKeys'] => {
    return useCallback(
        (keys: IRowKeys | null | undefined, clearPrevSelection?: boolean) => {
            if (!keys || clearPrevSelection) gridApi.tableApi?.deselectRow();

            const selKeys: IRowKey[] = isArray(keys) ? (keys as IRowKey[]) : [keys as IRowKey];
            gridApi.tableApi?.selectRow(selKeys);
        },
        [gridApi]
    );
};

const useApiGetSelectedNodes = (gridApi: IGridApi): IGridApi['getSelectedNodes'] => {
    const emptyArray = useRef<RowComponent[]>([]);
    return useCallback((): RowComponent[] => {
        if (!gridApi.tableApi?.initialized) return emptyArray.current;
        return gridApi.tableApi.getSelectedRows();
    }, [gridApi]);
};

const useApiGetSelectedRows = (gridApi: IGridApi): IGridApi['getSelectedRows'] => {
    const emptyArray = useRef<IGridRowData[]>([]);
    return useCallback((): IGridRowData[] => {
        if (!gridApi.tableApi?.initialized) return emptyArray.current;
        return gridApi.tableApi.getSelectedData() as IGridRowData[];
    }, [gridApi]);
};

const useApiGetNodeByKey = (gridApi: IGridApi): IGridApi['getNodeByKey'] => {
    return useCallback(
        (key: IRowKey) => {
            if (!key || !gridApi.tableApi) return undefined;
            return gridApi.tableApi?.getRow(key);
        },
        [gridApi]
    );
};

const useApiGetRowByKey = (gridApi: IGridApi): IGridApi['getRowByKey'] => {
    return useCallback(
        (key: IRowKey) => {
            return gridApi.getNodeByKey(key)?.getData();
        },
        [gridApi]
    );
};

const useApiInsertRows = (dataSetRef: React.MutableRefObject<IGridProps['dataSet'] | undefined>, gridApi: IGridApi): IGridApi['insertRows'] => {
    return useCallback(
        (rows: IGridRowData[] | IGridRowData, place?: 'above' | 'below', key?: IRowKey, updateActiveRow?: boolean) => {
            if (!gridApi.tableApi) return;

            const dataTree = gridApi.gridProps.dataTree;

            const above = place === 'above';

            const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

            for (const row of clonedRows) {
                if (!dataTree) gridApi.tableApi?.addData([row], above, key).then();
                else addTreeRows(gridApi, [row], place, key);
            }

            dataSetRef.current = gridApi.tableApi?.getData() || [];
            gridApi.gridProps.callbacks?.onDataSetChange?.(dataSetRef.current, gridApi);

            if (updateActiveRow && clonedRows[0]) gridApi.setActiveRowKey(clonedRows[0].id, true, 'center');

            gridApi.tableApi.setTableBodyFocus();
        },
        [dataSetRef, gridApi]
    );
};

const useApiUpdateRows = (dataSetRef: React.MutableRefObject<IGridProps['dataSet'] | undefined>, gridApi: IGridApi): IGridApi['updateRows'] => {
    return useCallback(
        (rows: IGridRowData[] | IGridRowData, updateActiveRow?: boolean) => {
            if (!gridApi.tableApi) return;
            const dataTree = gridApi.gridProps.dataTree;

            const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

            for (const row of clonedRows) {
                if (!dataTree) gridApi.tableApi.updateData([row]).then();
                else updateTreeRows(gridApi, row);
            }

            dataSetRef.current = gridApi.tableApi?.getData() || [];

            gridApi.gridProps.callbacks?.onDataSetChange?.(dataSetRef.current, gridApi);

            if (updateActiveRow && clonedRows[0]) gridApi.setActiveRowKey(clonedRows[0].id, true, 'center');
            gridApi.tableApi.setTableBodyFocus();
        },
        [dataSetRef, gridApi]
    );
};

const findParentNode = (gridApi: IGridApi, row: IGridRowData) => {
    if (!gridApi.tableApi) return undefined;
    const parentFieldKey = gridApi.tableApi.options.dataTreeParentField;
    const indexField = gridApi.tableApi.options.index;
    if (!indexField || !parentFieldKey || !row[parentFieldKey]) return undefined;
    let parentKey: string | number | undefined;
    if (typeof row[parentFieldKey] === 'string' || typeof row[parentFieldKey] === 'number') parentKey = row[parentFieldKey] as string | number;
    else if (typeof row[parentFieldKey] === 'object') parentKey = (row[parentFieldKey] as IGridRowData)[indexField] as string | number | undefined;

    if (!parentKey) return undefined;

    return gridApi.tableApi.getRow(parentKey) || undefined;
};

const addTreeRows = (gridApi: IGridApi, rows: IGridRowData[] | IGridRowData, place?: 'above' | 'below', key?: IRowKey) => {
    if (!gridApi.tableApi) return;
    if (!gridApi.gridProps.dataTree) {
        console.warn('TreeData mode is disabled. Tree row updating not available');
        return;
    }

    const above = place === 'above';
    const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

    for (const rowData of clonedRows) {
        const parentNode = findParentNode(gridApi, rowData);
        if (!parentNode) gridApi.tableApi?.addData([rowData], above, key);
        else {
            parentNode.addTreeChild(rowData);
            cascadeNodeExpand(parentNode);
            parentNode.reformat();
        }
    }
};

const updateTreeRows = (gridApi: IGridApi, rows: IGridRowData[] | IGridRowData) => {
    if (!gridApi.tableApi) return;
    if (!gridApi.gridProps.dataTree) {
        console.warn('TreeData mode is disabled. Tree row updating not available');
        return;
    }

    const indexField = gridApi.tableApi.options.index;
    const childField = gridApi.tableApi.options.dataTreeChildField;
    if (!indexField || !childField) return;

    const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];

    for (const rowData of clonedRows) {
        const rowKey = rowData[indexField] as string | number;
        const node = gridApi.tableApi.getRow(rowKey);

        // current node has not found
        if (!node) {
            gridApi.tableApi.addData([rowData]).then();
            continue;
        }

        const parentNode = node.getTreeParent();
        const newParentNode = findParentNode(gridApi, rowData);

        if (
            // the same parent
            (!parentNode && !newParentNode) ||
            (parentNode && newParentNode && parentNode.getData()[indexField] === newParentNode.getData()[indexField])
        ) {
            gridApi.tableApi.updateData([rowData]).then();
            continue;
        }

        //remove old node
        rowData[childField] = node.getData()[childField]; //keep row children rows

        gridApi.tableApi.deselectRow(node);
        gridApi.tableApi.deleteRow(rowKey);
        if (parentNode) parentNode.reformat();

        // the parent has changed to root
        if (!newParentNode) {
            gridApi.tableApi.addData([rowData]).then();
            continue;
        }

        // the parent changed to node
        newParentNode.addTreeChild(rowData);
        cascadeNodeExpand(newParentNode);
        newParentNode.reformat();
    }
};

const cascadeNodeExpand = (node: RowComponent | false) => {
    if (!node) return;
    const nodeParent = node.getTreeParent();
    cascadeNodeExpand(nodeParent);
    if (!node.isTreeExpanded()) node.treeExpand();
};

const useApiDeleteRowsByKeys = (dataSetRef: React.MutableRefObject<IGridProps['dataSet'] | undefined>, gridApi: IGridApi): IGridApi['deleteRowsByKeys'] => {
    return useCallback(
        (keys: IRowKeys) => {
            if (!gridApi.tableApi) return;
            const indexField = gridApi.tableApi.options.index;

            const clonedKeys: string[] = isArray(keys) ? [...(keys as string[])] : [keys as string];

            let newActiveNode: RowComponent | false = false;
            let newActiveNodeCandidate: RowComponent | false = false;
            for (const key of clonedKeys) {
                const node = gridApi.tableApi?.getRow(key);
                if (!node) continue;
                if (newActiveNode && node === newActiveNode) newActiveNode = false;
                newActiveNodeCandidate = node.getNextRow() || node.getPrevRow();
                if (newActiveNodeCandidate) newActiveNode = newActiveNodeCandidate;

                const parentNode = gridApi.tableApi.options.dataTree ? node.getTreeParent() : false;
                gridApi.tableApi.deselectRow(node);
                gridApi.tableApi.deleteRow(key);
                if (parentNode) parentNode.reformat();
            }

            if (newActiveNode && indexField) newActiveNode = gridApi.tableApi.getRow(newActiveNode.getData()[indexField]); //we update the link to the node, because after deleting the node map is rebuilt and the objects are not equal to each other (glitches occur)
            gridApi.tableApi.setActiveRow(newActiveNode || null, true, 'bottom');

            dataSetRef.current = gridApi.tableApi?.getData() || [];
            gridApi.gridProps.callbacks?.onDataSetChange?.(dataSetRef.current, gridApi);

            gridApi.tableApi.setTableBodyFocus();
        },
        [dataSetRef, gridApi]
    );
};

const useApiDeleteRows = (gridApi: IGridApi): IGridApi['deleteRows'] => {
    return useCallback(
        (rows: IGridRowData | IGridRowData[]) => {
            const clonedRows: IGridRowData[] = isArray(rows) ? [...(rows as IGridRowData[])] : [rows as IGridRowData];
            const keys: IRowKey[] = [];
            for (const row of clonedRows) keys.push(row.id);
            gridApi.deleteRowsByKeys(keys);
        },
        [gridApi]
    );
};

const useApiFetchData = (gridApi: IGridApi): IGridApi['fetchData'] => {
    return useCallback(
        (dataSource?: IGridDataFetchPromise) => {
            const curDataSource = dataSource || gridApi.gridProps.callbacks?.onDataFetch?.(gridApi);
            if (!curDataSource) return;

            gridApi.setIsLoading(true);
            curDataSource.then(
                (result) => {
                    if (!gridApi.getIsMounted()) return;
                    const values = (result.data || []) as IGridRowData[];
                    gridApi.setDataSet(values);
                    gridApi.setIsLoading(false);
                },
                (error) => {
                    if (!gridApi.getIsMounted()) return;
                    gridApi.setIsLoading(false);
                    const box = MessageBox.confirm({
                        content: (
                            <>
                                <p>{error.message}</p>
                                <p>{'Попробовать снова?'}</p>
                            </>
                        ),
                        type: 'error',
                        buttons: {
                            ok: {
                                onClick: () => {
                                    box.destroy();
                                    gridApi.fetchData(dataSource);
                                },
                            },
                        },
                    });
                }
            );
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





*/
