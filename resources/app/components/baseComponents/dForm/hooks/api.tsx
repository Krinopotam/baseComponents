import React, {useCallback} from 'react';
import {Space, Typography} from 'antd';

import {DModel} from 'baseComponents/dForm/dModel';
import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import {IDFormProps} from 'baseComponents/dForm/dForm';
import {MessageBox} from 'baseComponents/messageBox';

/** Form api */
export interface IDFormApi {
    /** Get the current form props */
    getFormId: () => string;

    /** Form model instance */
    model: DModel;

    /** Buttons row API */
    buttonsApi: IButtonsRowApi;

    /** Get the current form props */
    getFormProps: () => IDFormProps;

    /** Update the current form props (will cause rerender of the form) */
    setFormProps: (formProps: Partial<IDFormProps>) => void;

    /** Validate form */
    validateForm: (showAlert: boolean) => Record<string, string | undefined>;

    /** Submit form */
    submitForm: () => void;

    /** force render update method */
    forceUpdate: () => void;
}

export const useInitFormApi = (
    formId: string,
    formApi: IDFormApi,
    model: DModel,
    formProps: IDFormProps,
    buttonsApi: IButtonsRowApi,
    updateFormProps: (props: IDFormProps) => void
) => {
    formApi.model = model;
    const apiGetFormId = useApiGetFormId(formId);
    const apiGetFormProps = useApiGetFormProps(formProps);
    const apiSetFormProps = useApiSetFormProps(formProps, updateFormProps);
    const apiValidateForm = useApiValidateForm(formApi);
    const apiSubmitForm = useApiSubmitForm(formApi);
    if (!formApi.buttonsApi) formApi.buttonsApi = buttonsApi; //The parent can already have this API.Do not reload
    if (!formApi.getFormId) formApi.getFormId = apiGetFormId;
    if (!formApi.getFormProps) formApi.getFormProps = apiGetFormProps;
    if (!formApi.setFormProps) formApi.setFormProps = apiSetFormProps;
    if (!formApi.validateForm) formApi.validateForm = apiValidateForm;
    if (!formApi.submitForm) formApi.submitForm = apiSubmitForm;
};

/** Get the current form ID */
export const useApiGetFormId = (formId: string) => {
    return useCallback(() => {
        return formId;
    }, [formId]);
};

/** Get the current form props */
export const useApiGetFormProps = (formProps: IDFormProps) => {
    return useCallback(() => {
        return formProps;
    }, [formProps]);
};

/** Update the current form props (will cause rerender of the form) */
export const useApiSetFormProps = (formProps: IDFormProps, setFormProps: (props: IDFormProps) => void) => {
    return useCallback(
        (props: Partial<IDFormProps>) => {
            setFormProps({...formProps, ...props});
        },
        [formProps, setFormProps]
    );
};

export const useApiValidateForm = (formApi: IDFormApi) => {
    return useCallback(
        (showAlert?: boolean) => {
            const errors = formApi.model.validateForm();
            formApi.buttonsApi.disabled('ok', Object.keys(errors).length > 0);

            if (Object.keys(errors).length === 0 || !showAlert) return errors;

            let messageContent: React.ReactNode = 'Необходимо исправить ошибки';
            messageContent = (
                <span>
                    {messageContent}:
                    <Space direction="vertical" size={0}>
                        {Object.keys(errors).map((key) => {
                            const fieldLabel = formApi.model.getFieldLabel(key) || key;
                            return (
                                <Typography.Text key={key} style={{fontSize: 12}} type="secondary">
                                    {fieldLabel}: {errors[key]}
                                </Typography.Text>
                            );
                        })}
                    </Space>
                </span>
            );

            MessageBox.alert({content: messageContent, type: 'error'});

            return errors;
        },
        [formApi]
    );
};

const useApiSubmitForm = (formApi: IDFormApi) => {
    return useCallback(() => {
        formApi.model.incrementSubmitCount();

        const errors = formApi.validateForm(true);
        if (Object.keys(errors).length > 0) return;

        const formProps = formApi.getFormProps();

        if (!formProps.confirmChanges) {
            formApi.buttonsApi.loading('ok', true);
            formApi.model.submit();
            return;
        }

        const waiter = MessageBox.confirmWaiter({
            content: formProps.submitConfirmMessage || 'Сохранить сделанные изменения?',
            okText: 'Да',
            cancelText: 'Отмена',
            onOk: () => {
                formApi.model.submit(undefined, undefined, onComplete);
            },
        });

        const onComplete = () => {
            waiter.destroy();
        };
    }, [formApi]);
};
