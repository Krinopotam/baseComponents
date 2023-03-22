import {useMemo, useState} from 'react';
import {getUuid} from 'helpers/helpersString';
import {ITreeSelectNode} from 'baseComponents/treeSelect';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {ITreeSelectApi} from 'baseComponents/treeSelect/hooks/api';

export const useEditableInit = (api: ITreeSelectApi): [typeof formProps, typeof formApi] => {
    const treeProps = api.getProps();
    const treeFormProps = treeProps.editFormProps;
    const [formApi] = useState<IDFormModalApi>((treeFormProps?.apiRef || {}) as IDFormModalApi);
    const [formId] = useState(treeFormProps?.formId || 'SelectItemEdit-' + getUuid());

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

        const userOnSubmitSuccess =  props.callbacks?.onSubmitSuccess
        props.callbacks.onSubmitSuccess = (values, resultVal, formApi) => {
            if (!resultVal || userOnSubmitSuccess?.(values, resultVal, formApi) === false) return;

            const resultNode = {...(formApi.model.getFormDataSet() || {}), ...resultVal};

            const formProps = formApi.getFormProps();
            if (formProps.formMode === 'update') api.updateNodes(resultNode);
            else {
                const parents = api.getValues();
                const parent = parents && parents.length > 0 ? parents[0] : undefined;
                api.addNodes(parent, resultNode);
            }

            api.setValues([resultNode as ITreeSelectNode]);

            /*if (!treeProps.callbacks?.onDataFetch || api.getIsAllFetched()) {
                api.setDataSet([...(api.getDataSet() || []), resultNode]);
            }*/
        };

        return props;
    }, [treeFormProps, formApi, formId, api]);

    return [formProps, formApi];
};
