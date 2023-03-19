import {useMemo, useState} from 'react';
import {getUuid} from 'helpers/helpersString';
import {ITreeSelectNode} from 'baseComponents/treeSelect';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {ITreeSelectApi} from 'baseComponents/treeSelect/hooks/api';

export const useEditableInit = (api: ITreeSelectApi):[typeof openCreateHandler, typeof openUpdateHandler, typeof formProps] => {
    const treeProps = api.getProps();
    const treeFormProps = treeProps.editableFormProps;
    const [formApi] = useState<IDFormModalApi>((treeFormProps?.apiRef || {}) as IDFormModalApi);
    const [isEditFormOpened, setEditFormOpened] = useState(false);
    const [formId] = useState(treeFormProps?.formId || 'SelectItemEdit-' + getUuid());

    const openCreateHandler = () => {
        setEditFormOpened(true);
        formApi.open('create');
    };

    const openUpdateHandler = () => {
        const values = api.getValues();
        if (values.length < 1) return;
        setEditFormOpened(true);
        formApi.open('update', values[0]);
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

        props.isOpened = isEditFormOpened;

        if (!props.callbacks) props.callbacks = {};

        props.callbacks.onClosed = (formApi) => {
            setEditFormOpened(false);
            treeFormProps.callbacks?.onClosed?.(formApi);
        };

        props.callbacks.onOpen = (formApi, dataSet) => {
            setEditFormOpened(true);
            return treeFormProps.callbacks?.onOpen?.(formApi, dataSet);
        };

        props.callbacks.onSubmitSuccess = (values, resultVal, formApi) => {
            if (!resultVal || treeFormProps.callbacks?.onSubmitSuccess?.(values, resultVal, formApi) === false) return;

            api.setValues([resultVal as ITreeSelectNode]);

            if (!treeProps.callbacks?.onDataFetch ||api.getIsAllFetched()) {
                api.setDataSet([...(api.getDataSet() || []), resultVal]);
            }

            if (!treeProps.multiple) treeProps.callbacks?.onChange?.(resultVal || null);
            else treeProps.callbacks?.onChange?.([resultVal as ITreeSelectNode] || []);
        };

        return props;
    }, [treeFormProps, formApi, formId, isEditFormOpened, api, treeProps]);

    return [openCreateHandler, openUpdateHandler, formProps];
};
