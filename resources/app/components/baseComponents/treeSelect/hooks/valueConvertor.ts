import React, {useCallback, useRef, useState} from 'react';
import {isArray} from 'helpers/helpersObjects';
import {ITreeSelectNode, ITreeSelectPlainValue, ITreeSelectProps, ITreeSelectValue} from 'baseComponents/treeSelect';
import {ITreeSelectApi} from 'baseComponents/treeSelect/hooks/api';

export interface ITreeSelectInternalValue {
    value: string | number;
    label: React.ReactNode;
}

export const useValueConvertor = (
    fieldNames: ITreeSelectProps['fieldNames'],
    labelRender: ITreeSelectProps['labelRender'],
    titleRender: ITreeSelectProps['titleRender'],
    multiple: ITreeSelectProps['multiple']
): [typeof internalValue, typeof selectedNodesRef, typeof setSelectedNodes] => {
    const selectedNodesRef = useRef<ITreeSelectNode[]>([]);
    const [internalValue, _setInternalValue] = useState<ITreeSelectInternalValue | ITreeSelectInternalValue[] | null | undefined>(!multiple ? null : []);

    const [, _setSelectedNode] = useState<ITreeSelectNode[]>([]);

    const nodeToInternalValue = useNodeToInternalValue(fieldNames, labelRender, titleRender);

    const setSelectedNodes = useCallback(
        (nodes: ITreeSelectValue) => {
            if (!nodes) {
                selectedNodesRef.current = [];
                _setSelectedNode([]);
                _setInternalValue(!multiple ? null : []);
                return;
            }

            if (!isArray(nodes)) {
                const _nodes = {...nodes} as ITreeSelectNode;
                const value = nodeToInternalValue(_nodes);
                selectedNodesRef.current = [_nodes];
                _setSelectedNode([_nodes]);
                if (!multiple) _setInternalValue(value || null);
                else _setInternalValue(value ? [value] : []);
                return;
            }

            const resultInternalValues = [];
            const resultSelectedNodes = [];
            const _nodes = [...(nodes as ITreeSelectNode[])];
            for (const node of _nodes) {
                const _node = {...node};
                const value = nodeToInternalValue(_node);
                if (!value) continue;
                resultSelectedNodes.push(_node);
                resultInternalValues.push(value);
            }

            if (!multiple) {
                _setInternalValue(resultInternalValues.length > 0 ? resultInternalValues[0] : null);
                selectedNodesRef.current = resultSelectedNodes.length > 0 ? [resultSelectedNodes[0]] : [];
                _setSelectedNode(selectedNodesRef.current);
            } else {
                _setInternalValue(resultInternalValues);
                selectedNodesRef.current = resultSelectedNodes;
                _setSelectedNode(selectedNodesRef.current);
            }
        },
        [nodeToInternalValue, multiple, selectedNodesRef]
    );
    return [internalValue, selectedNodesRef, setSelectedNodes];
};

//
/**
 * Despite the possibility of override the names of the fields through FieldNames, as the value of Antd takes an object like  {value: string|number, label: React.ReactNode }
 * Convert row node to Antd value
 */
const useNodeToInternalValue = (
    fieldNames: ITreeSelectProps['fieldNames'],
    labelRender: ITreeSelectProps['labelRender'],
    titleRender: ITreeSelectProps['titleRender']
) => {
    return useCallback(
        (node: ITreeSelectNode | null | undefined): ITreeSelectInternalValue | null => {
            if (!node) return null;

            const keyField = fieldNames?.value || 'id';
            const id = node[keyField] as number | string;

            let label: React.ReactNode | undefined;
            if (labelRender) label = labelRender(node);
            else {
                const titleField = fieldNames?.title || 'title';
                const renderedTitleField = titleRender ? '__title' : '';
                label = node.label || undefined;
                if (!label && renderedTitleField) label = node[renderedTitleField];
                if (!label) label = node[titleField] as React.ReactNode;
            }
            return {value: id, label: label || undefined};
        },
        [fieldNames?.title, fieldNames?.value, labelRender, titleRender]
    );
};

/** Convert value like string|number to row node
 * When passing a value of type string|number, there is not enough data for direct conversion to a node.
 * Therefore, let's try to find a node with such a key value in the dataSet, and then in the list of selected nodes
 */
const usePlainValueToNode = (
    fieldNames: ITreeSelectProps['fieldNames'],
    getNodeByIdFromDataSet: ReturnType<typeof useGetNodeByIdFromDataSet>,
    getNodeByIdFromSelectedNodes: ReturnType<typeof useGetNodeByIdFromSelectedNodes>
) => {
    return useCallback(
        (plainValue: ITreeSelectPlainValue | null | undefined): ITreeSelectNode | undefined => {
            if (!plainValue) return undefined;

            const keyField = fieldNames?.value || 'id';
            const id = plainValue;
            let node = getNodeByIdFromDataSet(id);
            if (node) return node;

            node = getNodeByIdFromSelectedNodes(id);
            if (node) return node;

            const result = {} as ITreeSelectNode;
            result[keyField] = plainValue;
            return result;
        },
        [fieldNames, getNodeByIdFromDataSet, getNodeByIdFromSelectedNodes]
    );
};

/**
 * Convert value like (string|number)[] to row node
 */
export const usePlainValuesToNodes = (api: ITreeSelectApi) => {
    const treeProps = api.getProps();
    const getNodeByIdFromDataSet = useGetNodeByIdFromDataSet(api.getDataSet());
    const getNodeByIdFromSelectedNodes = useGetNodeByIdFromSelectedNodes(api.getValues());
    const plainValueToNode = usePlainValueToNode(treeProps.fieldNames, getNodeByIdFromDataSet, getNodeByIdFromSelectedNodes);
    return useCallback(
        (plainValues: ITreeSelectPlainValue | ITreeSelectPlainValue[] | null | undefined) => {
            if (!plainValues) return undefined;
            const values = isArray(plainValues) ? (plainValues as ITreeSelectPlainValue[]) : ([plainValues] as ITreeSelectPlainValue[]);
            const result: ITreeSelectNode[] = [];
            for (const value of values) {
                const node = plainValueToNode(value);
                if (!node) continue;
                result.push(node);
            }

            return result;
        },
        [plainValueToNode]
    );
};

/**
 * Get node by Id from dataSet
 */
const useGetNodeByIdFromDataSet = (nodes: ITreeSelectNode[] | undefined) => {
    const nodesRef = useRef<ITreeSelectNode[] | undefined>();
    nodesRef.current = nodes;
    return useCallback((id: string | number): ITreeSelectNode | undefined => {
        if (!nodesRef.current || !id) return undefined;

        const recursive = (_nodes: ITreeSelectNode[], _id: string | number): ITreeSelectNode | undefined => {
            for (const _node of _nodes) {
                if (_node.id === _id) return _node;
                if (!_node.children) continue;
                const _result = recursive(_node.children, _id);
                if (_result) return _result;
            }
            return undefined;
        };

        return recursive(nodesRef.current, id);
    }, []);
};

/**
 * Get node by Id from selected nodes list
 */
const useGetNodeByIdFromSelectedNodes = (nodes: ITreeSelectNode[] | undefined) => {
    const nodesRef = useRef<ITreeSelectNode[] | undefined>();
    nodesRef.current = nodes;
    return useCallback((id: string | number): ITreeSelectNode | undefined => {
        if (!nodesRef.current || !id) return undefined;

        for (const node of nodesRef.current) {
            if (node.id === id) return node;
        }
        return undefined;
    }, []);
};
