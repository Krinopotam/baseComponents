import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import {IDFormApi} from 'baseComponents/dForm/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {IDFormProps} from 'baseComponents/dForm/dForm';
import {MessageBox} from 'baseComponents/messageBox';
import {cloneObject} from 'helpers/helpersObjects';
import {useCallback} from 'react';

export interface IDFormModalApi extends Omit<IDFormApi, 'getFormProps' | 'setFormProps'> {
    /** Get the current modal form props */
    getFormProps: () => IDFormModalProps;

    /** Update the current modal form props (will cause rerender of the modal form). Can't update field props, because it is used in form model */
    setFormProps: (formProps: Partial<Omit<IDFormModalProps, 'fieldsProps'>>) => void;

    /** Open controls */
    open: (formMode: IDFormProps['formMode'], dataSet?: IDFormProps['dataSet'], formParentData?: IDFormProps['parentDataSet']) => void;

    /** Close controls with confirmation*/
    close: () => void;

    /** Close controls without confirmation*/
    forceClose: () => void;
}

export const useInitModalFormApi = (
    formApi: IDFormModalApi,
    modalFormProps: IDFormModalProps,
    buttonsApi: IButtonsRowApi,
    updateFormProps: (props: IDFormProps) => void
) => {
    formApi.buttonsApi = buttonsApi;
    formApi.getFormProps = useApiGetModalFormProps(modalFormProps);
    formApi.setFormProps = useApiSetModalFormProps(modalFormProps, updateFormProps);
    formApi.open = useApiFormOpen(formApi);
    formApi.close = useApiTryToCloseForm(formApi);
    formApi.forceClose = useApiFormForceClose(formApi);
};

const useApiGetModalFormProps = (modalFormProps: IDFormModalProps) => {
    return useCallback(() => {
        return modalFormProps;
    }, [modalFormProps]);
};

const useApiSetModalFormProps = (modalFormProps: IDFormModalProps, setModalFormProps: (props: IDFormModalProps) => void) => {
    return useCallback(
        (props: Partial<Omit<IDFormModalProps, 'fieldsProps'>>) => {
            setModalFormProps({...modalFormProps, ...props});
        },
        [modalFormProps, setModalFormProps]
    );
};

const useApiFormOpen = (formApi: IDFormModalApi) => {
    return useCallback(
        (formMode: IDFormProps['formMode'], dataSet?: IDFormProps['dataSet'], parentDataSet?: IDFormProps['parentDataSet']) => {
            if (!formMode) {
                if (process.env.NODE_ENV !== 'production') console.warn('The form mode is not set');
                return;
            }

            const clonedDataSet = dataSet ? cloneObject(dataSet) : undefined;
            const clonedParentData = parentDataSet ? parentDataSet : undefined;
            const modalFormProps = formApi.getFormProps();
            if (modalFormProps?.callbacks?.onOpen?.(formApi, formMode, clonedDataSet, clonedParentData) === false) return;

            formApi.setFormProps({
                isOpened: true,
                formMode: formMode,
                dataSet: clonedDataSet,
                parentDataSet: clonedParentData,
            });

            modalFormProps?.callbacks?.onOpened?.(formApi, formMode, clonedDataSet, clonedParentData);
        },
        [formApi]
    );
};

/** Api method: force close form. Form will be closed without confirmation  */
const useApiFormForceClose = (formApi: IDFormModalApi) => {
    return useCallback(() => {
        const modalFormProps = formApi.getFormProps();

        if (modalFormProps.callbacks?.onClosing?.(formApi, modalFormProps.formMode) === false) return false;

        formApi.setFormProps({isOpened: false});
        modalFormProps.callbacks?.onClosed?.(formApi, modalFormProps.formMode);
    }, [formApi]);
};

/** Api method: try to close modal form */
const useApiTryToCloseForm = (formApi: IDFormModalApi) => {
    return useCallback(() => {
        const modalFormProps = formApi.getFormProps();
        if (modalFormProps?.callbacks?.onClosing?.(formApi, modalFormProps.formMode) === false) return;

        if (formApi.model.isFormDirty() && modalFormProps.confirmChanges) {
            MessageBox.confirm({
                content: modalFormProps.closeFormConfirmMessage || 'Отменить сделанные изменения?',
                okText: 'Да',
                cancelText: 'Нет',
                onOk: () => {
                    formApi.forceClose();
                },
            });

            return;
        }

        formApi.forceClose();
    }, [formApi]);
};

