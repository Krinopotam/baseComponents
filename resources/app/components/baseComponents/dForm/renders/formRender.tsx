/**
 * @RenderForm
 * @version 0.0.30.25
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import { IFormButtons } from 'baseComponents/buttonsRow';
import React, { useEffect, useSyncExternalStore } from 'react';

import { ButtonsRender } from 'baseComponents/modal/renders/buttonsRender';
import { Form } from 'antd';
import { FormBodyRender } from './formBodyRender';
import { IDFormApi } from 'baseComponents/dForm/hooks/api';
import { LoadingContainer } from 'baseComponents/loadingContainer/loadingContainer';

interface IFormRenderProps {
    /** form api instance */
    formApi: IDFormApi;

    /** form buttons collection */
    formButtons: IFormButtons;

    /** is form loading status */
    isLoading?: boolean;

    /** is form in submitting process */
    isSubmitting?: boolean;
}

export const FormRender = ({formApi, formButtons}: IFormRenderProps): JSX.Element => {
    useExternalRenderCall(formApi);

    const formProps = formApi.getFormProps(); 
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
                    name={formApi.getFormId()}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    //onFinish={formApi.model.submit}
                    autoComplete="off"
                    layout={formProps.layout === 'horizontal' ? 'horizontal' : 'vertical'}
                >
                    <FormInit formApi={formApi} />

                    <FormBodyRender formApi={formApi} />

                    <ButtonsRender
                        formId={formApi.getFormId()}
                        buttons={formButtons}
                        formType={formProps.formType}
                        buttonsApi={formApi.buttonsApi}
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
        formApi.model.setFormInit();
    }, [formApi.model]);

    return null;
};
