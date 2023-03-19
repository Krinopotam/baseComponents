import {Col, Row, Space, Tooltip, TreeSelectProps} from 'antd';
import {DFormModal, IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import React, {useEffect, useMemo, useState} from 'react';
import {splitObject} from 'helpers/helpersObjects';
import Button from 'baseComponents/button/button';
import {getUuid} from 'helpers/helpersString';
import {TreeSelectRender} from 'baseComponents/treeSelect/renders/treeSelectRender';
import {useEditableInit} from 'baseComponents/treeSelect/hooks/useEditForm';
import {ITreeSelectApi, useInitApi} from 'baseComponents/treeSelect/hooks/api';
import {useGetActualProps} from 'baseComponents/libs/commonHooks/getActualProps';
import {TPromise} from 'baseComponents/serviceTypes';

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

export type ITreeSelectValue = ITreeSelectNode | ITreeSelectNode[] | null;

interface ITeeSelectFieldNames {
    title?: string;
    value?: string;
    children?: string;
}

export type IAntTreeSelectProps = Omit<TreeSelectProps, 'treeNodeLabelProp' | 'treeData' | 'onClear'>;

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface ITreeSelectProps extends IAntTreeSelectProps {
    /** A mutable object to merge with these controls api */
    apiRef?: ITreeSelectApi;

    /** Tree TreeSelect id */
    treeSelectId?: string;

    /** Is TreeSelect read only  */
    readOnly?: boolean; //TODO: Make readonly

    /** Value */
    value?: ITreeSelectValue;

    /** Value */
    defaultValueCallback?: (data: ITreeSelectNode[]) => ITreeSelectNode | ITreeSelectNode[];

    /**  Title renderer */
    titleRender?: (treeNode: ITreeSelectNode | unknown) => React.ReactNode;

    /**  Label renderer */
    labelRender?: (treeNode: ITreeSelectNode | unknown) => React.ReactNode;

    /**  Custom filter */
    filterTreeNode?: boolean | ((inputValue: string, treeNode: ITreeSelectNode | unknown) => boolean);

    /** Local data set */
    dataSet?: ITreeSelectNode[];

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

    /** The TreeSelect callbacks */
    callbacks?: ITreeSelectCallbacks;
}

export interface ITreeSelectCallbacks {
    /** Fires when the component is ready for use (when it fully downloaded all the data, if necessary) */
    onReady?: () => void;

    /** Fires on change selected values */
    onChange?: (value: ITreeSelectValue) => void;

    /** Fires on input value cleared */
    onClear?: () => void;

    /** fires when the TreeSelect trying to fetch data */
    onDataFetch?: (search: string, api: ITreeSelectApi) => ITreeSelectSourcePromise | undefined;

    /** fires when the TreeSelect fetch success */
    onDataFetchSuccess?: (result: {data: ITreeSelectNode[]}, api: ITreeSelectApi) => boolean | void;

    /** fires when the TreeSelect fetch failed */
    onDataFetchError?: (message: string, code: number, api: ITreeSelectApi) => boolean | void;

    /** fires after the completion of fetching the data, regardless of the result */
    onDataFetchComplete?: (api: ITreeSelectApi) => boolean | void;
}

export type ITreeSelectSourcePromise = TPromise<{data: ITreeSelectNode[]}, {message: string; code: number}>;

export type ITreeSelectPlainValue = string | number;

//endregion

export const TreeSelect = (props: ITreeSelectProps): JSX.Element => {
    const [treeProps, updateProps] = useGetActualProps(props); //props can be set both by parent component and via api
    const antProps = useGetAntTreeSelectProps(treeProps);
    const [componentId] = useState(treeProps.treeSelectId || 'treeSelect-' + getUuid());
    const [api] = useState((treeProps.apiRef || {}) as ITreeSelectApi);
    useInitApi({api, componentId, treeProps, updateProps});

    useEffect(() => {
        api.setIsAllFetched(false);
        api.setDataSet(undefined);
        api.setValues(null);
    }, [api]);

    /** Set dataSet if props changed*/
    useEffect(() => {
        api.setDataSet(treeProps.dataSet);
    }, [api.setDataSet, api, treeProps.dataSet]);

    /** Set data value if props changed*/
    useEffect(() => {
        api.setValues(treeProps.value || null);
    }, [api, treeProps.value]);

    /** Fetch on load */
    useEffect(() => {
        if (treeProps.fetchMode === 'onLoad' && !treeProps.minSearchLength) {
            api.fetchData('');
            return;
        }

        if (!api.getIsReady()) treeProps.callbacks?.onReady?.();
    }, [api, treeProps.callbacks, treeProps.fetchMode, treeProps.minSearchLength]);

    /*
    useEffect(() => {
        if ((treeProps.dataSet !== undefined && internalValue == null) || (treeProps.dataSet !== undefined && internalValue?.value === undefined)) {
            const defValue = defaultValueCallback?.(treeProps.dataSet);

            if (typeof defaultValueCallback == 'function' && defValue !== undefined) {
                setValue(defValue);
                treeProps.callbacks?.onChange?.(defValue);
            }
        }
    }, [defaultValueCallback, internalValue, treeProps.callbacks, setValue, treeProps.dataSet]);

    */
    const [openCreateHandler, openUpdateHandler, editFormProps] = useEditableInit(api);

    if (!editFormProps) return <TreeSelectRender api={api} antProps={antProps} />;

    return (
        <Row wrap={false}>
            {/*<Col flex="auto">{treeSelect}</Col> */}
            <TreeSelectRender api={api} antProps={antProps} />
            <Col>
                <Space wrap={false} size={0}>
                    <Tooltip title="Добавить">
                        <Button icon={<PlusOutlined />} onClick={openCreateHandler} />
                    </Tooltip>
                    <Tooltip title="Редактировать">
                        <Button icon={<EditOutlined />} onClick={openUpdateHandler} disabled={!api.getValues() || api.getValues().length !== 1} />
                    </Tooltip>
                </Space>
            </Col>
            {editFormProps?.isOpened && <DFormModal {...editFormProps} />}
        </Row>
    );
};

const useGetAntTreeSelectProps = (props: ITreeSelectProps) => {
    return useMemo((): IAntTreeSelectProps => {
        const result = splitObject(props, [
            'apiRef',
            'treeSelectId',
            'readOnly',
            'value',
            'defaultValueCallback',
            'titleRender',
            'labelRender',
            'filterTreeNode',
            'dataSet',
            'fetchMode',
            'noCacheFetchedData',
            'minSearchLength',
            'debounce',
            'selectedLabelProp',
            'fieldNames',
            'editableFormProps',
            'callbacks',
        ]);

        return result[1] as IAntTreeSelectProps;
    }, [props]);
};
