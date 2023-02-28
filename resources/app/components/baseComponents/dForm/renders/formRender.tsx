/**
 * @RenderForm
 * @version 0.0.30.15
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';
import React, {useEffect, useSyncExternalStore} from 'react';

import {ButtonsRender} from 'baseComponents/modal/renders/buttonsRender';
import {Form} from 'antd';
import {FormBodyRender} from './formBodyRender';
import {IDFormApi} from 'baseComponents/dForm/hooks/api';
import {IDFormProps} from '../dForm';
import {LoadingContainer} from 'baseComponents/loadingContainer/loadingContainer';

interface IFormRenderProps {
    /** form ID */
    formId: string;

    /** form api instance */
    formApi: IDFormApi;

    /** form properties */
    formProps: IDFormProps;

    /** Form buttons api */
    buttonsApi: IButtonsRowApi;

    /** form buttons collection */
    formButtons: IFormButtons;

    /** is form loading status */
    isLoading?: boolean;

    /** is form in submitting process */
    isSubmitting?: boolean;
}

export const FormRender = ({formId, formApi, formProps, buttonsApi, formButtons}: IFormRenderProps): JSX.Element => {
    useExternalRenderCall(formApi);
    formApi.model.setFormInitialized(false);

    let labelCol = formProps.labelCol;
    if (!labelCol) labelCol = formProps.layout === 'horizontal' ? {span: 8} : {span: 0};

    let wrapperCol = formProps.wrapperCol;
    if (!wrapperCol) wrapperCol = formProps.layout === 'horizontal' ? {span: 16} : {span: 24};

    return (
        <div className={'managed-dynamic-buttons-row ' + (formProps.containerClassName || '')}>
            <LoadingContainer
                isLoading={formApi.model.isFormFetching() || (formApi.model.isFormSubmitting() && !formProps.confirmChanges)}
                notHideContent={true}
            >
                <Form
                    className={formProps.className}
                    name={formProps.name}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    //onFinish={formApi.model.submit}
                    autoComplete="off"
                    layout={formProps.layout === 'horizontal' ? 'horizontal' : 'vertical'}
                >
                    <FormInit formApi={formApi} />

                    <FormBodyRender formApi={formApi} formProps={formProps} />

                    <ButtonsRender
                        formId={formId}
                        buttons={formButtons}
                        formType={formProps.formType}
                        buttonsApi={buttonsApi}
                        arrowsSelection={false}
                        context={formApi}
                    />
                </Form>
            </LoadingContainer>
        </div>
    );
};

const useExternalRenderCall = (formApi: IDFormApi) => {
    const subscribe = formApi.model.subscribeRenderForm();

    const getSnapshot = () => {
        return formApi.model.getFormRenderSnapshot();
    };

    return useSyncExternalStore(subscribe, getSnapshot);
};

/** Special component to fire onFormInit event before another events*/
const FormInit = ({formApi}: {formApi: IDFormApi}): JSX.Element | null => {
    useEffect(() => {
        formApi.model.setFormInitialized(true);
    }, [formApi.model]);

    return null;
};
