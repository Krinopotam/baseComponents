import {DForm, IDFormCallbacks, IDFormMode, IDFormProps} from 'baseComponents/dForm/dForm';
import {IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';

import {ButtonsRender} from 'baseComponents/modal/renders/buttonsRender';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {Modal} from 'baseComponents/modal';
import React from 'react';

interface IDFormModalRenderProps {
    /** the form ID (important property) */
    formId: string;

    /** form buttons collection */
    buttons?: IFormButtons;

    /** Form buttons api */
    buttonsApi?: IButtonsRowApi;

    /** Form callbacks */
    callbacks?: IDFormCallbacks;

    /** Is the form open centered */
    centered?: boolean;

    /** form api */
    formApi: IDFormModalApi;

    /** Child dynamic form props only */
    formProps: IDFormProps;

    /** Dynamic modal form props (contains formProps values)  */
    modalFormProps: IDFormModalProps;

    /** On submit button click callback */
    onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;

    /** On cancel button click callback */
    onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const DFormModalRender = ({formId, buttons, buttonsApi, callbacks, formApi, formProps, modalFormProps}: IDFormModalRenderProps): JSX.Element => {
    const formMode = modalFormProps.formMode || 'create'; //form model does not initialized yet
    const modalTitle = useFormTitle(formMode, modalFormProps.title);

    return (
        <Modal
            dispatcherFormId={formId}
            open={modalFormProps.isOpened}
            //onOk={formApi.submitForm} // Not required, as separate parameters for buttons are used
            onCancel={formApi.close}
            centered
            destroyOnClose={true}
            footer={<ButtonsRender formId={formId} buttons={buttons} formType={modalFormProps.formType} buttonsApi={buttonsApi} arrowsSelection={false} context={formApi} />}
            maskClosable={false}
            keyboard={false}
            wrapClassName={'managed-dynamic-buttons-row'} //This class is needed to limit the scope of the component that controls the buttons (buttonsRow)
            title={modalTitle}
        >
            {modalFormProps.isOpened ? <DForm callbacks={callbacks} apiRef={formApi} {...formProps} /> : null}
        </Modal>
    );
};

const useFormTitle = (formMode: IDFormMode, title?: React.ReactNode) => {
    if (title) return title;
    if (formMode === 'view') return 'Просмотр';
    if (formMode === 'create') return 'Создание';
    if (formMode === 'clone') return 'Клонирование';
    if (formMode === 'update') return 'Редактирование';
    return '&nbsp;';
};
