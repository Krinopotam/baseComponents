import {useMemo, useState} from 'react';
import {getUuid} from 'helpers/helpersString';
import {ITreeSelectNode} from 'baseComponents/treeSelect';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {ITreeSelectApi} from 'baseComponents/treeSelect/hooks/api';
import {addNodeToDataSet, updateNodeInDataSet, removeNodesFromDataSet} from 'baseComponents/treeSelect/helpers/dataSetMethods';
import {MessageBox} from 'baseComponents/messageBox';
import {isPromise, mergeObjects} from 'helpers/helpersObjects';
import {MessageBoxApi} from 'components/baseComponents/messageBox/messageBoxApi';

export const useEditableInit = (api: ITreeSelectApi): [typeof formProps, typeof openCreateHandler, typeof openUpdateHandler, typeof deleteHandler] => {
    const treeProps = api.getProps();
    const treeFormProps = treeProps.editableFormProps;
    const [formApi] = useState<IDFormModalApi>((treeFormProps?.apiRef || {}) as IDFormModalApi);
    const [formId] = useState(treeFormProps?.formId || 'SelectItemEdit-' + getUuid());

    const openCreateHandler = () => {
        formApi.open('create');
    };

    const openUpdateHandler = () => {
        const values = api.getValues();
        if (values.length !== 1) return;
        formApi.open('update', values[0]);
    };

    const deleteHandler = () => {
        const keyField = treeProps.fieldNames?.value || 'id';
        const childrenField = treeProps.fieldNames?.children || 'children';
        const values = api.getValues();
        if (values.length < 1) return;
        const dataSetClone = [...api.getDataSet()];
        removeNodesFromDataSet(dataSetClone, values, keyField, childrenField);
        api.setValues(null);
        api.setDataSet(dataSetClone);
    };

    const formProps: IDFormModalProps | undefined = useMemo(() => {
        if (!treeFormProps) return undefined;

        const defaultProps = {
            width: 400,
            minWidth: 200,
            bodyHeight: 200,
            bodyMinHeight: 40,
        };

        const props = {...defaultProps, ...treeFormProps, ...{apiRef: formApi, formId: formId}};

        if (!props.callbacks) props.callbacks = {};

        props.callbacks.onSubmitSuccess = (values, resultVal, formApi) => {
            if (!resultVal || treeFormProps.callbacks?.onSubmitSuccess?.(values, resultVal, formApi) === false) return;

            const resultNode = {...(formApi.model.getFormDataSet() || {}), ...resultVal};
            const treeProps = api.getProps();
            const keyField = treeProps.fieldNames?.value || 'id';
            const childrenField = treeProps.fieldNames?.children || 'children';

            const formProps = formApi.getFormProps();
            const dataSetClone = [...api.getDataSet()];
            if (formProps.formMode === 'update') updateNodeInDataSet(dataSetClone, resultNode, keyField, childrenField);
            else {
                if (!resultNode[keyField]) resultNode[keyField] = getUuid();
                const parents = api.getValues();
                const parent = parents && parents.length > 0 ? parents[0] : undefined;
                addNodeToDataSet(dataSetClone, parent, resultNode, keyField, childrenField);
            }

            api.setValues([resultNode as ITreeSelectNode]);
            api.setDataSet(dataSetClone);

            /*if (!treeProps.callbacks?.onDataFetch || api.getIsAllFetched()) {
                api.setDataSet([...(api.getDataSet() || []), resultNode]);
            }*/

            if (!treeProps.multiple) treeProps.callbacks?.onChange?.(resultNode || null);
            else treeProps.callbacks?.onChange?.([resultNode as ITreeSelectNode] || []);
        };

        return props;
    }, [treeFormProps, formApi, formId, api, treeProps]);

    return [formProps, openCreateHandler, openUpdateHandler, deleteHandler];
};

const deleteHandler = (api: ITreeSelectApi) => {
    const treeProps = api.getProps();

    const keyField = treeProps.fieldNames?.value || 'id';
    const childrenField = treeProps.fieldNames?.children || 'children';
    const selectedNodes = api.getValues();
    if (selectedNodes.length < 1) return;
    const dataSetClone = [...api.getDataSet()];
    removeNodesFromDataSet(dataSetClone, selectedNodes, keyField, childrenField);
    api.setValues(null);
    api.setDataSet(dataSetClone);

    let messageBox: MessageBoxApi;
    const removeRows = () => {
        const deletePromise = treeProps.callbacks?.onDelete?.(selectedNodes, api);

        if (isPromise(deletePromise)) {
            if (!gridProps.confirmDelete) gridApi.setIsLoading(true);
            const promiseResult = deletePromise as IGridDeletePromise;
            promiseResult
                .then(() => {
                    if (!gridApi.getIsMounted()) return;
                    gridApi.deleteRows(selectedRows);
                    if (!gridProps.confirmDelete) gridApi.setIsLoading(false);
                    else if (messageBox) messageBox.destroy();
                })
                .catch((error) => {
                    if (!gridApi.getIsMounted()) return;
                    if (!gridProps.confirmDelete) gridApi.setIsLoading(false);
                    else if (messageBox) messageBox.destroy();
                    MessageBox.alert({content: error.message, type: 'error'});
                });
            return;
        }

        gridApi.deleteRows(selectedRows);
        if (messageBox) messageBox.destroy();
    };

    if (api.confirmDelete) {
        messageBox = MessageBox.confirmWaiter({
            content: api.rowDeleteMessage || 'Удалить выбранные строки?',
            onOk: removeRows,
        });
    } else {
        removeRows();
    }
};
