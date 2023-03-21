import {ITreeSelectNode, ITreeSelectPlainValue, ITreeSelectProps, ITreeSelectValue} from 'baseComponents/treeSelect';
import React, {useCallback, useState} from 'react';
import {useDataSet} from 'baseComponents/treeSelect/hooks/dataSet';
import {useIsMountedRef} from 'baseComponents/libs/commonHooks/isMounted';
import {useDataFetcher} from 'baseComponents/treeSelect/hooks/dataFetcher';
import runDebounce from 'lodash/debounce';
import {ITreeSelectInternalValue, usePlainValuesToNodes, useValueConvertor} from 'baseComponents/treeSelect/hooks/valueConvertor';
import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import {isArray} from 'helpers/helpersObjects';
import {getUuid} from 'helpers/helpersString';

export interface ITreeSelectApi {
    /** Get the TreeSelect id */
    getId: () => string;

    /** Is component mounted status */
    isMounted: () => boolean;

    /** Edit mode buttons api */
    buttonsApi: IButtonsRowApi;

    /** Get current TreeSelect props */
    getProps: () => ITreeSelectProps;

    /** Set current TreeSelect props */
    setProps: (props: ITreeSelectProps) => void;

    /** Get the TreeSelect selected nodes */
    getValues: () => ITreeSelectNode[];

    /** Set the TreeSelect selected nodes*/
    setValues: (values: ITreeSelectValue | null) => void;

    /** Get internal TreeSelect value (like {value: string | number; label: React.ReactNode}) */
    getInternalValue: () => ITreeSelectInternalValue | ITreeSelectInternalValue[] | null | undefined;

    /** Get current data set */
    getDataSet: () => ITreeSelectNode[] | undefined;

    /** Update data set*/
    setDataSet: (dataSet: ITreeSelectNode[] | undefined | null) => void;

    /** Get the TreeSelect ready to user input status (data is fetched) */
    getIsReady: () => boolean;

    /** Set the TreeSelect ready to user input status (data is fetched) */
    setIsReady: (value: boolean) => void;

    /** Get the TreeSelect fetching status (is fetching now) */
    getIsFetching: () => boolean;

    /** Set the TreeSelect fetching status (is fetching now) */
    setIsFetching: (value: boolean) => void;

    /** Get the TreeSelect fetch error */
    getFetchError: () => string;

    /** Set the TreeSelect fetch error */
    setSetFetchError: (value: string | null) => void;

    /** Get the TreeSelect all fetched status (full data set completely fetched) */
    getIsAllFetched: () => boolean;

    /** Set the TreeSelect all fetched status (full data set completely fetched) */
    setIsAllFetched: (value: boolean) => void;

    /** Get the TreeSelect min symbols input length status to show/hide error */
    getMinSymbols: () => number;

    /** Set the TreeSelect min symbols input status to show/hide error */
    setSetMynSymbols: (value: number) => void;

    /** Fetch data */
    fetchData: (search: string, debounce?: boolean) => void;

    /** Convert plain value like string|number to row node
     * When passing a value of type string|number, there is not enough data for direct conversion to a node.
     * Therefore, we'll try to find a node with such a key value in the dataSet, and then in the list of selected nodes
     */
    plainValueToNodes: (plainValues: ITreeSelectPlainValue | ITreeSelectPlainValue[] | null | undefined) => ITreeSelectNode[] | undefined;

    /** Add nodes to current dataset*/
    addNodes: (parentNode: ITreeSelectNode | undefined, newNodes: ITreeSelectNode | ITreeSelectNode[]) => void;

    /** Update nodes content in dataset */
    updateNodes: (nodes: ITreeSelectNode | ITreeSelectNode[]) => void;

    /** Delete node from dataSet */
    deleteNodes: (nodes: ITreeSelectNode | ITreeSelectNode[]) => void;
}

export const useInitApi = ({
    api,
    componentId,
    treeProps,
    updateProps,
    buttonsApi,
}: {
    api: ITreeSelectApi;
    componentId: string;
    treeProps: ITreeSelectProps;
    updateProps: (props: ITreeSelectProps) => void;
    buttonsApi: IButtonsRowApi;
}) => {
    const isMountedRef = useIsMountedRef();
    const [dataSet, setDataSet] = useDataSet(treeProps.titleRender, treeProps.labelRender, isMountedRef);
    const [isReady, setIsReady] = useState(false);
    const [fetching, setFetching] = React.useState(false); //is fetching now
    const [fetchError, setFetchError] = React.useState(''); //has fetching error
    const [allFetched, setAllFetched] = React.useState(false); //is all fetched
    const [minSymbols, setMinSymbols] = React.useState(0); //show min symbols error

    const [internalValue, selectedNodesRef, setValue] = useValueConvertor(
        treeProps.fieldNames,
        treeProps.labelRender,
        treeProps.titleRender,
        treeProps.multiple
    );

    api.buttonsApi = buttonsApi;
    api.getId = useApiGetId(componentId);
    api.isMounted = useApiIsMounted(isMountedRef);
    api.getProps = useApiGetProps(treeProps);
    api.setProps = useApiSetProps(treeProps, updateProps);

    api.getInternalValue = useApiGetInternalValue(internalValue);
    api.getValues = useApiGetValues(selectedNodesRef);
    api.setValues = useApiSetValue(setValue, api);

    api.getDataSet = useApiGetDataSet(dataSet);
    api.setDataSet = useApiSetDataSet(setDataSet);

    api.plainValueToNodes = usePlainValuesToNodes(api);

    api.getIsReady = useApiGetIsReady(isReady);
    api.setIsReady = useApiSetIsReady(setIsReady);
    api.getIsFetching = useApiGetIsFetching(fetching);
    api.setIsFetching = useApiSetIsFetching(setFetching);
    api.getFetchError = useApiGetFetchError(fetchError);
    api.setSetFetchError = useApiSetFetchError(setFetchError);
    api.getIsAllFetched = useApiGetIsAllFetched(allFetched);
    api.setIsAllFetched = useApiSetIsAllFetched(setAllFetched);
    api.getMinSymbols = useApiGetMinSymbols(minSymbols);
    api.setSetMynSymbols = useApiSetMinSymbols(setMinSymbols);

    const dataFetcher = useDataFetcher(api);
    api.fetchData = useFetchData(dataFetcher, api);

    api.addNodes = useAddNodes(api);
    api.updateNodes = useUpdateNodes(api);
    api.deleteNodes = useDeleteNodes(api);
};

/** Get the current TreeSelect id */
export const useApiGetId = (componentId: string) => {
    return useCallback(() => {
        return componentId;
    }, [componentId]);
};

const useApiIsMounted = (isMountedRef: React.MutableRefObject<boolean>) => {
    return useCallback(() => isMountedRef.current, [isMountedRef]);
};

const useApiGetProps = (treeSelectProps: ITreeSelectProps) => {
    return useCallback(() => treeSelectProps, [treeSelectProps]);
};

const useApiSetProps = (treeSelectProps: ITreeSelectProps, setTreeSelectProps: (props: ITreeSelectProps) => void) => {
    return useCallback(
        (props: Partial<Omit<ITreeSelectProps, 'fieldsProps'>>) => {
            setTreeSelectProps({...treeSelectProps, ...props});
        },
        [treeSelectProps, setTreeSelectProps]
    );
};

const useApiGetInternalValue = (internalValue: ITreeSelectInternalValue | ITreeSelectInternalValue[] | null | undefined) => {
    return useCallback(() => internalValue, [internalValue]);
};

const useApiGetValues = (selectedNodesRef: React.MutableRefObject<ITreeSelectNode[]>) => {
    return useCallback(() => selectedNodesRef.current, [selectedNodesRef]);
};

const useApiSetValue = (setValue: (value: ITreeSelectValue | null) => void, api: ITreeSelectApi) => {
    return useCallback(
        (value: ITreeSelectValue | null) => {
            setValue(value || []);

            const treeProps = api.getProps();
            if (!value) {
                treeProps.callbacks?.onChange?.(null);
            } else if (!treeProps.multiple) {
                treeProps.callbacks?.onChange?.(
                    isArray(value) && (value as ITreeSelectNode[]).length > 0 ? (value as ITreeSelectNode[])[0] : (value as ITreeSelectNode)
                );
            } else {
                treeProps.callbacks?.onChange?.(value || []);
            }
        },
        [api, setValue]
    );
};

const useApiGetDataSet = (dataSet: ITreeSelectNode[] | undefined) => {
    return useCallback(() => dataSet, [dataSet]);
};

const useApiSetDataSet = (setDataSet: (newDataSet: ITreeSelectNode[] | undefined) => void) => {
    return useCallback(
        (dataSet: ITreeSelectNode[] | undefined | null) => {
            setDataSet(dataSet || []);
        },
        [setDataSet]
    );
};

const useApiGetIsReady = (isReady: boolean) => {
    return useCallback(() => isReady, [isReady]);
};

const useApiSetIsReady = (setIsReady: (value: boolean) => void) => {
    return useCallback(
        (isReady: boolean) => {
            setIsReady(isReady);
        },
        [setIsReady]
    );
};

const useApiGetIsFetching = (isFetching: boolean) => {
    return useCallback(() => isFetching, [isFetching]);
};

const useApiSetIsFetching = (setIsFetching: (value: boolean) => void) => {
    return useCallback(
        (isFetching: boolean) => {
            setIsFetching(isFetching);
        },
        [setIsFetching]
    );
};

const useApiGetFetchError = (fetchError: string) => {
    return useCallback(() => fetchError, [fetchError]);
};

const useApiSetFetchError = (setFetchError: (value: string) => void) => {
    return useCallback(
        (fetchError: string | null) => {
            setFetchError(fetchError || '');
        },
        [setFetchError]
    );
};

const useApiGetIsAllFetched = (isAllFetched: boolean) => {
    return useCallback(() => isAllFetched, [isAllFetched]);
};

const useApiSetIsAllFetched = (setIsAllFetched: (value: boolean) => void) => {
    return useCallback(
        (isAllFetched: boolean) => {
            setIsAllFetched(isAllFetched);
        },
        [setIsAllFetched]
    );
};

const useApiGetMinSymbols = (minSymbols: number) => {
    return useCallback(() => minSymbols, [minSymbols]);
};

const useApiSetMinSymbols = (setMinSymbols: (value: number) => void) => {
    return useCallback(
        (isAllFetched: number) => {
            setMinSymbols(isAllFetched);
        },
        [setMinSymbols]
    );
};

const useFetchData = (dataFetcher: (searchString: string) => void, api: ITreeSelectApi) => {
    return useCallback(
        (search: string, debounce?: boolean) => {
            const debounceFetcher = runDebounce(dataFetcher, api.getProps().debounce || 0);
            if (!debounce) dataFetcher(search);
            else debounceFetcher(search);
        },
        [api, dataFetcher]
    );
};

const useAddNodes = (api: ITreeSelectApi) => {
    return useCallback(
        (parentNode: ITreeSelectNode | undefined, newNodes: ITreeSelectNode | ITreeSelectNode[]) => {
            const _newNodes = isArray(newNodes) ? (newNodes as ITreeSelectNode[]) : [newNodes as ITreeSelectNode];
            const treeProps = api.getProps();
            const keyField = treeProps.fieldNames?.value || 'id';
            const childrenField = treeProps.fieldNames?.children || 'children';
            const recursive = (nodes: ITreeSelectNode[], parent: ITreeSelectNode | undefined, newNodes: ITreeSelectNode[]) => {
                if (!parent) {
                    for (const newNode of newNodes) nodes.push(newNode);
                    return;
                }

                for (const node of nodes) {
                    if (!node[keyField]) continue;
                    if (node[keyField] === parent[keyField]) {
                        if (!node.isLeaf) {
                            if (!node[childrenField]) node[childrenField] = [];
                            const children = node[childrenField] as ITreeSelectNode[];
                            for (const newNode of newNodes) children.push(newNode);
                        } else {
                            for (const newNode of newNodes) nodes.push(newNode);
                        }
                        return true;
                    }

                    if (!node[childrenField]) continue;
                    if (recursive(node[childrenField] as ITreeSelectNode[], parent, newNodes)) return true;
                }
            };
            const dataSetClone = [...(api.getDataSet() || [])];

            for (const _newNode of _newNodes) {
                if (!_newNode[keyField]) _newNode[keyField] = getUuid();
            }

            recursive(dataSetClone, parentNode, _newNodes);
            api.setDataSet(dataSetClone);
        },
        [api]
    );
};

const useUpdateNodes = (api: ITreeSelectApi) => {
    return useCallback(
        (updatedNodes: ITreeSelectNode | ITreeSelectNode[]) => {
            const _updatedNodes = isArray(updatedNodes) ? (updatedNodes as ITreeSelectNode[]) : [updatedNodes as ITreeSelectNode];
            const treeProps = api.getProps();
            const keyField = treeProps.fieldNames?.value || 'id';
            const childrenField = treeProps.fieldNames?.children || 'children';
            const recursive = (nodes: ITreeSelectNode[], updatedNode: ITreeSelectNode) => {
                for (const node of nodes) {
                    if (!node[keyField]) continue;
                    if (node[keyField] === updatedNode[keyField]) {
                        const prevChildren = node[childrenField];
                        for (const key in updatedNode) node[key] = updatedNode[key];
                        node[childrenField] = prevChildren;
                        return true;
                    }

                    if (!node[childrenField]) continue;
                    if (recursive(node[childrenField] as ITreeSelectNode[], updatedNode)) return true;
                }
            };

            const dataSetClone = [...(api.getDataSet() || [])];
            for (const _updatedNode of _updatedNodes) {
                recursive(dataSetClone, _updatedNode);
            }
            api.setDataSet(dataSetClone);
        },
        [api]
    );
};

const useDeleteNodes = (api: ITreeSelectApi) => {
    return useCallback(
        (removeNodes: ITreeSelectNode | ITreeSelectNode[]) => {
            const _removeNodes = isArray(removeNodes) ? (removeNodes as ITreeSelectNode[]) : [removeNodes as ITreeSelectNode];
            const treeProps = api.getProps();
            const keyField = treeProps.fieldNames?.value || 'id';
            const childrenField = treeProps.fieldNames?.children || 'children';
            const recursive = (nodes: ITreeSelectNode[], removeNode: ITreeSelectNode) => {
                for (let i = nodes.length - 1; i >= 0; i--) {
                    const node = nodes[i];
                    if (!node[keyField]) continue;
                    if (node[keyField] === removeNode[keyField]) {
                        nodes.splice(i, 1);
                        return true;
                    }
                    if (!node[childrenField]) continue;
                    if (recursive(node[childrenField] as ITreeSelectNode[], removeNode)) return true;
                }
            };

            const dataSetClone = [...(api.getDataSet() || [])];
            for (const _removeNode of _removeNodes) {
                recursive(dataSetClone, _removeNode);
            }
            api.setDataSet(dataSetClone);
        },
        [api]
    );
};
