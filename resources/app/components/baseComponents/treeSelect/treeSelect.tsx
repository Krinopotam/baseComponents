import {TreeSelect as AntdTreeSelect, Col, Row, Space, Spin, Tooltip, TreeSelectProps} from 'antd';
import {DFormModal, IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import React, {CSSProperties, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {cloneObject, isArray, mergeObjects} from 'helpers/helpersObjects';

import Button from 'baseComponents/button/button';
import {WebServices} from 'baseComponents/libs/services/webServices'; //:TODO выпилить!
import {getUuid} from 'helpers/helpersString';
import runDebounce from 'lodash/debounce';

//region Types
export interface ITreeSelectNode extends Record<string, unknown> {
    /** Node id */
    id?: string | number;
    /** Node value (same as id, used to avoid antd bug) */
    value?: string | number;
    // defaultValueCallback?: (data: ITreeSelectNode[]) => ITreeSelectNode | ITreeSelectNode[];
    /** Node name */
    title?: string | React.ReactNode;
    /** Selected node name. Property treeNodeLabelProp need to be set */
    label?: string | React.ReactNode;
    /** Children nodes */
    children?: ITreeSelectNode[];
    /** Is node selectable*/
    selectable?: boolean;
    /** Is node disabled*/
    disabled?: boolean;
    /** Is node checkable*/
    checkable?: boolean;
    /** is node checkbox must be disabled*/
    disableCheckbox?: boolean;
    /** Is node is leaf (must't have children)*/
    isLeaf?: boolean;
    /** Service rendered title, used if component has title render */
    __title?: string | React.ReactNode;
    /** Service rendered label, used if component has label render */
    __label?: string | React.ReactNode;
}

export interface ITreeSelectDataSource {
    method: 'post' | string;
    url: string;
    parameters: {
        action: string;
        method: string;
        data?: {
            limit?: number;
            search?: string;
            parentId?: string;
        } | null;
    };
}

export type ITreeSelectValue = ITreeSelectNode | ITreeSelectNode[] | null;

interface ITeeSelectFieldNames {
    title?: string;
    value?: string;
    children?: string;
}

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface ITreeSelectProps {
    /** Is TreeSelect read only  */
    readOnly?: boolean; //TODO: Make readonly

    /** Value */
    value?: ITreeSelectValue;

    /** Value */
    defaultValueCallback?: (data: ITreeSelectNode[]) => ITreeSelectNode | ITreeSelectNode[];

    /** Allow multiple select values */
    multiple?: TreeSelectProps['multiple'];

    /** Show check boxes in multiple mode */
    treeCheckable?: TreeSelectProps['treeCheckable'];

    /** Fires when the component is ready for use (when it fully downloaded all the data, if necessary) */
    onReady?: () => void;

    /** Fires on change selected values */
    onChange: (value: ITreeSelectValue) => void;

    /**  Title renderer */
    titleRender?: (treeNode: ITreeSelectNode | unknown) => React.ReactNode;

    /**  Label renderer */
    labelRender?: (treeNode: ITreeSelectNode | unknown) => React.ReactNode;

    /**  Custom filter */
    filterTreeNode?: boolean | ((inputValue: string, treeNode: ITreeSelectNode | unknown) => boolean);

    /** Local data set */
    dataSet?: ITreeSelectNode[];

    /** Parameters for remote data fetching*/
    dataSource?: ITreeSelectDataSource;

    /**Additional data properties for appending to dataSource request data*/
    dataSourceAdditionalData?: Record<string, unknown>;

    /**  Start etching remote data on load control or on use control (example, open dropdown). Default OnLoad */
    fetchMode?: 'onLoad' | 'onUse' | 'onUseForce';

    /**  Loaded data without parameters (like searchString) will not be cached */
    noCacheFetchedData?: boolean;

    /**  Minimum length of search string before fetch data */
    minSearchLength?: number;

    /**  debounce in ms */
    debounce?: number;

    /**Selected value label. Will render as content of select. Default: title */
    selectedLabelProp?: string;

    /** Customize node label, value, children field name */
    fieldNames?: ITeeSelectFieldNames;

    /** Edit item controls props. If not set then component not editable */
    editableFormProps?: IDFormModalProps;

    /** Main field in data source to fetch data for editable controls */
    editableFormDataSourceFieldId?: string;

    /** The webServices class instance if we want caching to be at the level of the transmitted instance.Otherwise, a new instance will be created and caching will be at the level of the component */
    webServices?: WebServices;
}

interface ITreeSelectInternalValue {
    value: string | number;
    label: React.ReactNode;
}

export type ITreeSelectPlainValue = string | number;

//endregion

export const TreeSelect = ({
    defaultValueCallback,
    readOnly,
    disabled,
    onClear,
    onChange,
    value: valueFromProps,
    dropdownStyle,
    titleRender,
    labelRender,
    fieldNames,
    selectedLabelProp,
    filterTreeNode,
    multiple,
    dataSet: dataSetFromProps,
    dataSource: dataSourceFromProps,
    dataSourceAdditionalData,
    fetchMode = 'onLoad',
    noCacheFetchedData,
    minSearchLength,
    debounce,
    onReady,
    dropdownRender,
    notFoundContent,
    showSearch,
    treeDefaultExpandAll,
    webServices: webServicesFromProps,
    editableFormProps,
    editableFormDataSourceFieldId,
    ...props
}: ITreeSelectProps & Omit<TreeSelectProps, 'treeNodeLabelProp'>): JSX.Element => {
    const isMountedRef = useIsMountedRef();
    const [componentId] = useState(getUuid());
    const [fetchId] = useState('treeListSelect_' + componentId);
    const [dataSet, setDataSet] = useDataSet(titleRender, labelRender, isMountedRef);
    const [isReady, setIsReady] = useState(false);
    const [fetching, setFetching] = React.useState(false); //is fetching now
    const [fetchError, setError] = React.useState(''); //has fetching error
    const [allFetched, setAllFetched] = React.useState(false);
    const [minSymbols, setMinSymbols] = React.useState(0);
    const [webServices] = useState(webServicesFromProps ? webServicesFromProps : new WebServices());
    const [dataSource, setDataSource] = useState(dataSourceFromProps);
    const selectedNodesRef = useRef<ITreeSelectNode[]>([]);
    const plainValuesToNodes = usePlainValuesToNodes(dataSet, fieldNames, selectedNodesRef);
    const [internalValue, setValue] = useValue(selectedNodesRef, fieldNames, labelRender, titleRender, multiple);

    useEffect(() => {
        setAllFetched(false);
        setDataSet(undefined);
        setValue(null);
        setDataSource(dataSourceFromProps);
    }, [dataSourceFromProps, setDataSet, setValue]);

    useEffect(() => {
        setDataSet(dataSetFromProps);
    }, [dataSetFromProps, setDataSet]);

    useEffect(() => {
        setValue(valueFromProps || null);
    }, [valueFromProps, setValue]);

    const dataFetcher = useDataFetcher({
        fetchId,
        webServices,
        setDataSet,
        isReady,
        setIsReady,
        setFetching,
        allFetched,
        setAllFetched,
        setError,
        setMinSymbols,
        noCacheFetchedData,
        minSearchLength,
        onReady,
        isMountedRef,
    });

    const debounceFetcher = runDebounce(dataFetcher, debounce || 0);

    useEffect(() => {
        if (dataSource && fetchMode === 'onLoad' && !minSearchLength) {
            dataFetcher('', dataSource, dataSourceAdditionalData);
            return;
        }

        if (!isReady) onReady?.();
    }, [dataFetcher, dataSource, dataSourceAdditionalData, fetchMode, isReady, minSearchLength, onReady]);

    const _dropDownStyle: CSSProperties = dropdownStyle || {};
    if (!_dropDownStyle.maxHeight) _dropDownStyle.maxHeight = 400;
    if (!_dropDownStyle.overflow) _dropDownStyle.overflow = 'auto';

    //region Destructor
    useEffect(() => {
        return () => {
            webServices.cancelFetch(fetchId, true);
        };
    }, [fetchId, webServices]);
    //endregion

    useEffect(() => {
        if ((dataSet !== undefined && internalValue == null) || (dataSet !== undefined && internalValue?.value === undefined)) {
            const defValue = defaultValueCallback?.(dataSet);

            if (typeof defaultValueCallback == 'function' && defValue !== undefined) {
                setValue(defValue);
                onChange?.(defValue);
            }
        }
    }, [dataSet]);

    // For clarity. Antd has labels for a node(1) and for the selected value(2). fieldNames.label property sets the node label(1) and treeNodeLabelProp sets the selected value label(2)
    // In order not to get confused, we will consider Node's label is title(1), and Label of the selected value is label(2)
    // For the implementation of the capabilities of the Title & Labels  renders, we add to dataSet 2 service fields: __title & __label
    const treeSelect = (
        <AntdTreeSelect
            {...props}
            showSearch={typeof showSearch === 'undefined' ? true : showSearch}
            treeDefaultExpandAll={typeof treeDefaultExpandAll === 'undefined' ? true : treeDefaultExpandAll}
            //labelInValue // We do not use this mode, as it is useless. In this mode, onChange will return an object containing value and label, but you still can’t build a full node
            //loadData={onLoadData}
            disabled={disabled || readOnly} //TODO: implement true readOnly
            dropdownStyle={_dropDownStyle}
            treeData={dataSet}
            fieldNames={{
                //Customize node label, value, children field name. __title - special service field to show rendered node label
                label: !titleRender ? (fieldNames?.title ? fieldNames.title : 'title') : '__title',
                value: fieldNames?.value ? fieldNames.value : 'id',
                children: fieldNames?.children ? fieldNames.children : 'children',
            }}
            treeNodeLabelProp={selectedLabelProp ? selectedLabelProp : labelRender ? '__label' : (fieldNames?.title ? fieldNames.title : 'title')} //Selected value label. Will render as content of select. Default: title
            treeNodeFilterProp={titleRender ? '__title' : (fieldNames?.title ? fieldNames.title : 'title')} //Field to be  used for filtering if filterTreeNode returns true. Default: title
            filterTreeNode={(inputValue, treeNode) => {
                //Whether to filter treeNodes by input value. The value of treeNodeFilterProp is used for filtering by default
                if (dataSource && !allFetched) return true; //Data filtration when requested from the server is carried out by a server
                if (!filterTreeNode) return defaultFilter(inputValue, treeNode);

                if (typeof filterTreeNode === 'function') return filterTreeNode(inputValue, treeNode);
                else return filterTreeNode;
            }}
            value={internalValue}
            onClear={() => {
                onClear?.();
                setValue(null);
            }}
            onChange={(value) => {
                const selectedNodes = plainValuesToNodes(value);
                setValue(selectedNodes || null);
                if (!selectedNodes) {
                    onChange?.(null);
                    return;
                }
                if (multiple) onChange?.(selectedNodes || []);
                else onChange?.(selectedNodes.length > 0 ? selectedNodes[0] : null);
            }}
            onDropdownVisibleChange={(open: boolean) => {
                if (dataSource && open && fetchMode === 'onUse') dataFetcher('', dataSource, dataSourceAdditionalData);
                if (dataSource && open && fetchMode === 'onUseForce') dataFetcher('', dataSource, dataSourceAdditionalData);
            }}
            onSearch={(searchString) => {
                if (dataSource) debounceFetcher(searchString, dataSource, dataSourceAdditionalData);
            }}
            notFoundContent={notFoundContent ? notFoundContent : <NotFound fetching={fetching} error={fetchError} minSymbols={minSymbols} />}
            dropdownRender={
                dropdownRender
                    ? dropdownRender
                    : (menu: React.ReactNode) => (
                          <>
                              {menu}
                              <DropdownStatus fetching={fetching} error={fetchError} minSymbols={minSymbols} />
                          </>
                      )
            }
            multiple={multiple}
        />
    );

    const [openCreateHandler, openUpdateHandler, preparedFormProps] = useEditableInit({
        editableFormProps,
        editableFormDataSourceFieldId,
        internalValue,
        setValue,
        onChange,
        multiple,
        dataSet,
        dataSource,
        setDataSet,
        allFetched,
        setAllFetched,
        webServices,
        fetchId,
    });

    if (!editableFormProps) return treeSelect;

    return (
        <Row wrap={false}>
            <Col flex="auto">{treeSelect}</Col>
            <Col>
                <Space wrap={false} size={0}>
                    <Tooltip title="Добавить">
                        <Button icon={<PlusOutlined />} onClick={openCreateHandler} />
                    </Tooltip>
                    <Tooltip title="Редактировать">
                        <Button icon={<EditOutlined />} onClick={openUpdateHandler} disabled={!internalValue} />
                    </Tooltip>
                </Space>
            </Col>
            {preparedFormProps?.isOpened && <DFormModal {...preparedFormProps} />}
        </Row>
    );
};

const NotFound = ({fetching, error, minSymbols}: {fetching: boolean; error: string; minSymbols: number}): JSX.Element => {
    if (minSymbols || fetching || error) return <></>;
    return <div style={{paddingLeft: '30px', fontSize: '12px'}}>Данные отсутствуют</div>;
};

const DropdownStatus = ({fetching, error, minSymbols}: {fetching: boolean; error: string; minSymbols: number}): JSX.Element => {
    if (minSymbols) return <div style={{paddingLeft: '30px', fontSize: '12px'}}>Введите как минимум {minSymbols} симв.</div>;
    if (fetching)
        return (
            <div style={{paddingLeft: '30px', fontSize: '12px'}}>
                <Spin size="small" /> загрузка...
            </div>
        );
    if (error)
        return (
            <div role="alert" style={{paddingLeft: '30px', fontSize: '12px', color: '#ff4d4f'}}>
                {error}
            </div>
        );

    return <></>;
};

const useDataFetcher = ({
    fetchId,
    webServices,
    setDataSet,
    isReady,
    setIsReady,
    setFetching,
    allFetched,
    setAllFetched,
    setError,
    setMinSymbols,
    noCacheFetchedData,
    minSearchLength,
    onReady,
    isMountedRef,
}: {
    fetchId: string;
    webServices: WebServices;
    setDataSet: (dataSet: ITreeSelectProps['dataSet']) => void;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    setFetching: React.Dispatch<React.SetStateAction<boolean>>;
    allFetched: boolean;
    setAllFetched: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setMinSymbols: React.Dispatch<React.SetStateAction<number>>;
    noCacheFetchedData: ITreeSelectProps['noCacheFetchedData'];
    minSearchLength: ITreeSelectProps['minSearchLength'];
    onReady: ITreeSelectProps['onReady'];
    isMountedRef: React.MutableRefObject<boolean>;
}) => {
    return useCallback(
        (searchString: string, dataSource: ITreeSelectDataSource, dataSourceAdditionalData?: Record<string, unknown>) => {
            if (!isMountedRef.current) return;
            if (!noCacheFetchedData && allFetched) return;

            if (minSearchLength && searchString.length < minSearchLength) {
                setMinSymbols(minSearchLength);
                setDataSet(undefined);
                return;
            }

            setMinSymbols(0);

            setFetching(true);
            setError('');

            if (!dataSource.parameters.data) dataSource.parameters.data = {};
            if (dataSourceAdditionalData) {
                dataSource.parameters.data = mergeObjects(dataSource.parameters.data, dataSourceAdditionalData);
            }

            dataSource.parameters.data.search = searchString;

            webServices
                .webFetchData({
                    fetchId: fetchId,
                    url: dataSource.url,
                    method: dataSource.method as 'get' | 'post',
                    parameters: dataSource.parameters,
                    callbacks: {
                        onSuccess: (data: ITreeSelectProps['dataSet']) => {
                            setDataSet(data);
                            setAllFetched(allFetched || !searchString);

                            if (!isReady) {
                                setIsReady(true);
                                onReady?.();
                            }
                            setFetching(false);
                        },
                        onError: (error) => {
                            setError(error.message);
                            setDataSet(undefined);
                            setFetching(false);
                        },
                    },
                })
                .then();
        },
        [
            isMountedRef,
            noCacheFetchedData,
            allFetched,
            minSearchLength,
            setMinSymbols,
            setFetching,
            setError,
            webServices,
            fetchId,
            setDataSet,
            setAllFetched,
            isReady,
            setIsReady,
            onReady,
        ]
    );
};

const useDataSet = (
    titleRender: ITreeSelectProps['titleRender'],
    labelRender: ITreeSelectProps['labelRender'],
    isMountedRef: React.MutableRefObject<boolean>
): [ITreeSelectProps['dataSet'], (dataSet: ITreeSelectProps['dataSet']) => void] => {
    const [dataSet, setDataSet] = useState<ITreeSelectProps['dataSet']>();

    const setPreparedDataSet = useCallback(
        (newDataSet: ITreeSelectProps['dataSet']) => {
            if (!isMountedRef.current) return;
            if (!newDataSet) {
                setDataSet(undefined);
                return;
            }

            let preparedDataSet: ITreeSelectProps['dataSet'];
            if (titleRender || labelRender) preparedDataSet = prepareNodeRender(newDataSet, titleRender, labelRender);
            else preparedDataSet = newDataSet;

            setDataSet(preparedDataSet);
        },
        [titleRender, labelRender, isMountedRef]
    );

    return [dataSet, setPreparedDataSet];
};

const defaultFilter = (inputValue: string, treeNode: ITreeSelectNode | unknown) => {
    const node = treeNode as ITreeSelectNode;
    if (!node || typeof node.title !== 'string') return false;
    return node.title.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
};

const prepareNodeRender = (
    dataSet: ITreeSelectProps['dataSet'],
    titleRender?: (node: ITreeSelectNode) => React.ReactNode,
    labelRender?: (node: ITreeSelectNode) => React.ReactNode
) => {
    if (!dataSet) return [];
    const newDataSet: ITreeSelectNode[] = [];
    for (const node of dataSet) {
        const _node = {...node};

        if (labelRender) _node['__label'] = labelRender(node);
        if (titleRender) _node['__title'] = titleRender(node);

        newDataSet.push(_node);
        if (node.children) _node.children = prepareNodeRender(_node.children, titleRender, labelRender);
    }

    return newDataSet;
};

const useValue = (
    selectedNodesRef: React.MutableRefObject<ITreeSelectNode[]>,
    fieldNames: ITreeSelectProps['fieldNames'],
    labelRender: ITreeSelectProps['labelRender'],
    titleRender: ITreeSelectProps['titleRender'],
    multiple: ITreeSelectProps['multiple']
): [typeof internalValue, typeof setValue] => {
    const [internalValue, setInternalValue] = useState<ITreeSelectInternalValue | ITreeSelectInternalValue[] | null | undefined>(!multiple ? null : []);
    const convertNodeToValue = useNodeToInternalValue(fieldNames, labelRender, titleRender);

    const setValue = useCallback(
        (nodes: ITreeSelectValue) => {
            if (!nodes) {
                selectedNodesRef.current = [];
                setInternalValue(!multiple ? null : []);
                selectedNodesRef.current = [];
                return selectedNodesRef.current;
            }

            if (!isArray(nodes)) {
                const _node = {...nodes} as ITreeSelectNode;
                const outValue = convertNodeToValue(_node);
                selectedNodesRef.current = [_node];
                if (!multiple) setInternalValue(outValue ? outValue : null);
                else setInternalValue(outValue ? [outValue] : []);
            } else {
                const resultValues = [];
                const resultSelectedNodes = [];
                const _nodes = [...(nodes as ITreeSelectNode[])];
                for (const node of _nodes) {
                    const _node = {...node};
                    const outValue = convertNodeToValue(_node);
                    if (!outValue) continue;
                    resultSelectedNodes.push(_node);
                    resultValues.push(outValue);
                }

                if (!multiple) {
                    setInternalValue(resultValues.length > 0 ? resultValues[0] : null);
                    selectedNodesRef.current = resultSelectedNodes.length > 0 ? [resultSelectedNodes[0]] : [];
                } else {
                    setInternalValue(resultValues);
                    selectedNodesRef.current = resultSelectedNodes;
                }
            }

            return selectedNodesRef.current;
        },
        [convertNodeToValue, multiple, selectedNodesRef]
    );
    return [internalValue, setValue];
};

// Despite the possibility of override the names of the fields through FieldNames, as the value of Antd takes an object of the species {value: string, label: string}
const useNodeToInternalValue = (
    fieldNames: ITreeSelectProps['fieldNames'],
    labelRender: ITreeSelectProps['labelRender'],
    titleRender: ITreeSelectProps['titleRender']
) => {
    return useCallback(
        (node: ITreeSelectNode | null | undefined): ITreeSelectInternalValue | null => {
            if (!node) return null;

            const idField = fieldNames?.value ? fieldNames.value : 'id';
            const id = node[idField] as number | string;

            let label: React.ReactNode | undefined;
            if (labelRender) label = labelRender(node);
            else {
                const titleField = fieldNames?.title ? fieldNames.title : 'title';
                const renderedTitleField = titleRender ? '__title' : '';
                label = node.label ? node.label : undefined;
                if (!label && renderedTitleField) label = node[renderedTitleField];
                if (!label) label = node[titleField] as React.ReactNode;
            }
            return {value: id, label: label || undefined};
        },
        [fieldNames?.title, fieldNames?.value, labelRender, titleRender]
    );
};

/**
 */
const usePlainValueToNode = (
    fieldNames: ITreeSelectProps['fieldNames'],
    getNodeByIdFromDataSet: ReturnType<typeof useGetNodeByIdFromDataSet>,
    getNodeByIdFromSelectedNodes: ReturnType<typeof useGetNodeByIdFromSelectedNodes>
) => {
    return useCallback(
        (plainValue: ITreeSelectPlainValue | null | undefined): ITreeSelectNode | undefined => {
            if (!plainValue) return undefined;

            const idField = fieldNames?.value || 'id';
            const id = plainValue;
            let node = getNodeByIdFromDataSet(id);
            if (node) return node;

            node = getNodeByIdFromSelectedNodes(id);
            if (node) return node;

            const result = {} as ITreeSelectNode;
            result[idField] = plainValue;
            return result;
        },
        [fieldNames, getNodeByIdFromDataSet, getNodeByIdFromSelectedNodes]
    );
};

const usePlainValuesToNodes = (
    dataSet: ITreeSelectProps['dataSet'],
    fieldNames: ITreeSelectProps['fieldNames'],
    selectedNodesRef: React.MutableRefObject<ITreeSelectNode[]>
) => {
    const getNodeByIdFromDataSet = useGetNodeByIdFromDataSet(dataSet);
    const getNodeByIdFromSelectedNodes = useGetNodeByIdFromDataSet(selectedNodesRef.current);
    const plainValueToNode = usePlainValueToNode(fieldNames, getNodeByIdFromDataSet, getNodeByIdFromSelectedNodes);
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
    const nodesRef = useRef<ITreeSelectNode[] | undefined>(nodes);
    nodesRef.current = nodes;
    return useCallback(
        (id: string | number): ITreeSelectNode | undefined => {
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
        },
        [nodesRef]
    );
};

/**
 * Get node by Id from selected nodes list
 */
const useGetNodeByIdFromSelectedNodes = (nodes: ITreeSelectNode[] | undefined) => {
    const nodesRef = useRef<ITreeSelectNode[] | undefined>(nodes);
    nodesRef.current = nodes;
    return useCallback(
        (id: string | number): ITreeSelectNode | undefined => {
            if (!nodesRef.current || !id) return undefined;

            for (const node of nodesRef.current) {
                if (node.id === id) return node;
            }
            return undefined;
        },
        [nodesRef]
    );
};

//region Editable implementation
const useEditableInit = ({
    editableFormProps,
    editableFormDataSourceFieldId,
    internalValue,
    setValue,
    onChange,
    multiple,
    dataSet,
    dataSource,
    setDataSet,
    allFetched,
    webServices,
    fetchId,
}: {
    editableFormProps: ITreeSelectProps['editableFormProps'];
    editableFormDataSourceFieldId: ITreeSelectProps['editableFormDataSourceFieldId'];
    internalValue: ITreeSelectInternalValue | ITreeSelectInternalValue[] | null | undefined;
    setValue: (nodes: ITreeSelectValue) => ITreeSelectNode[];
    onChange: ITreeSelectProps['onChange'];
    multiple: ITreeSelectProps['multiple'];
    dataSet: ITreeSelectProps['dataSet'];
    dataSource: ITreeSelectProps['dataSource'];
    setDataSet: (dataSet: ITreeSelectProps['dataSet']) => void;
    allFetched: boolean;
    setAllFetched: React.Dispatch<React.SetStateAction<boolean>>;
    webServices: WebServices;
    fetchId: string;
}) => {
    const [isEditFormOpened, setEditFormOpened] = useState(false);
    const [mode, setMode] = useState<'create' | 'update'>('create');

    return useMemo((): [(() => void) | undefined, (() => void) | undefined, IDFormModalProps | undefined] => {
        if (!editableFormProps) return [undefined, undefined, undefined];

        const props = cloneObject(editableFormProps);
        props.formMode = mode;
        props.isOpened = isEditFormOpened;
        if (!props.name) props.name = 'SelectItemEdit_' + getUuid();
        if (!props.webService) props.webService = webServices;
        if (!props.width) props.width = 400;
        if (!props.minWidth) props.minWidth = 200;
        if (!props.bodyHeight) props.bodyHeight = 200;
        if (!props.bodyMinHeight) props.bodyMinHeight = 40;
        if (!props.callbacks) props.callbacks = {};

        props.callbacks.onClosed = (formApi, formMode) => {
            setEditFormOpened(false);
            editableFormProps.callbacks?.onClosed?.(formApi, formMode);
        };

        props.callbacks.onBeforeDataSourceFetch = (source) => {
            if (!editableFormDataSourceFieldId || !internalValue) {
                if (editableFormProps.callbacks?.onBeforeDataSourceFetch) return editableFormProps.callbacks.onBeforeDataSourceFetch(source);
                return source;
            }

            const _dataSource = {...source};
            if (!_dataSource.parameters) _dataSource['parameters'] = {};
            if (!_dataSource.parameters.data) _dataSource.parameters.data = {};
            (_dataSource.parameters.data as Record<string, unknown>)[editableFormDataSourceFieldId] = (internalValue as ITreeSelectInternalValue).value;

            if (editableFormProps.callbacks?.onBeforeDataSourceFetch) return editableFormProps.callbacks.onBeforeDataSourceFetch(_dataSource);
            return _dataSource;
        };

        props.callbacks.onSubmitSuccess = (values, resultVal, formApi) => {
            if (!resultVal) {
                editableFormProps.callbacks?.onSubmitSuccess?.(values, resultVal, formApi);
                return;
            }
            setValue(resultVal as ITreeSelectNode);

            if ((dataSource && allFetched) || !dataSource) {
                const _dataSet = [...(dataSet || [])];
                _dataSet.push(resultVal);
                setDataSet(_dataSet);
            }

            webServices.clearCache(fetchId);

            if (!multiple) onChange?.(resultVal || null);
            else onChange?.([resultVal as ITreeSelectNode] || []);

            editableFormProps.callbacks?.onSubmitSuccess?.(values, resultVal, formApi);
        };

        const openCreateHandler = () => {
            setEditFormOpened(true);
            setMode('create');
        };

        const openUpdateHandler = () => {
            setEditFormOpened(true);
            setMode('update');
        };

        return [openCreateHandler, openUpdateHandler, props];
    }, [
        editableFormProps,
        mode,
        isEditFormOpened,
        webServices,
        editableFormDataSourceFieldId,
        internalValue,
        setValue,
        dataSource,
        allFetched,
        fetchId,
        multiple,
        onChange,
        dataSet,
        setDataSet,
    ]);
};
//endregion

function useIsMountedRef() {
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMountedRef;
}