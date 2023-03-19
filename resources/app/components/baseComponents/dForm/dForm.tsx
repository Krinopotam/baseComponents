/**
 * @DynamicForm
 * @version 0.0.37.76
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import './css/antdAnimation.css';

import {DModel, IDFormModelCallbacks, IDFormSubmitResultObject, IDFormSubmitResultPromise} from './dModel';
import {IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';
import {IDFormApi, useInitFormApi} from 'baseComponents/dForm/hooks/api';
import React, {useEffect, useRef, useState} from 'react';

import {FormRender} from './renders/formRender';
import {IDFormFieldsProps} from 'baseComponents/dForm/components/baseComponent';
import {IFormType} from '../modal';
import {IRuleType} from './validators/baseValidator';
import {TPromise} from 'baseComponents/serviceTypes';
import {getUuid} from 'helpers/helpersString';
import {useCallbacks} from 'baseComponents/dForm/hooks/callbacks';
import {useGetButtons} from './hooks/buttons';
import {useUpdateMessageBoxTheme} from 'baseComponents/messageBox/hooks/updateModalTheme';
import {useGetActualProps} from "baseComponents/libs/commonHooks/getActualProps";

//import './dynamicForm.css';

//region Types
/** Form properties*/
// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormProps {
    /** A mutable object to merge with these controls api */
    apiRef?: unknown;
    
    /** Form formId */
    formId?: string;

    /** Buttons properties */
    buttons?: IFormButtons | null;

    /** Form callbacks */
    callbacks?: IDFormCallbacks;

    /** Form CSS class */
    className?: string;

    /** Form container class name */
    containerClassName?: string;

    /** Indent from the beginning of the controls (default 12)  */
    contentIndent?: number;

    /** Form data */
    dataSet?: IDFormDataSet;

    /** Parent form data */
    parentDataSet?: IDFormDataSet;

    /** Fields properties */
    fieldsProps: IDFormFieldsProps;

    /** Form type */
    formType?: IFormType;

    /** label column parameters, for example span:'8' */
    labelCol?: Record<string, unknown>;

    /** Form layout (horizontal or vertical). Vertical is default */
    layout?: 'horizontal' | 'vertical';

    /** Form mode */
    formMode?: IDFormMode;

    /** Disable automatic hiding the fields if they depend on the fields for which the values are not set */
    noAutoHideDependedFields?: boolean;

    /** Tabs properties */
    tabsProps?: IDFormTabsProps;

    /** Form parent item data */
    // formParentData?: IFormDataSet;

    /** No use controls data */
    unfilledForm?: boolean;

    /** Validation rules */
    validationRules?: IDFormFieldValidationRules;

    /** wrapper column parameters, for example span:'16' */
    wrapperCol?: Record<string, unknown>;

    /** Should the form request confirmation before the form submitting or cancel, if the form data was changed by the user  */
    confirmChanges?: boolean;

    /** Confirm message before the form submitting */
    submitConfirmMessage?: React.ReactNode;

    // /** Close dirty controls confirm message. If null or empty string - no confirm */
    // closeFormConfirmMessage?: string | null;
}

export interface IDFormTabsProps {
    /** Tabs panes height (default 40)*/
    height?: number;
}

export type IDFormMode = 'view' | 'create' | 'update' | 'clone' | 'delete';

/** Form data set type */
export interface IDFormDataSet extends Record<string, unknown> {
    id?: string | number;
}

export type IDFormDataSourcePromise = TPromise<{data: Record<string, unknown>}, {message: string; code: number}>;

export type IDFormFieldValidationRules = Record<string, IRuleType[]>;

export interface IDFormCallbacks {
    /** fires when the value of a field changed */
    onFieldValueChanged?: (fieldName: string, value: unknown, prevValue: unknown, formApi: IDFormApi) => boolean | void;

    /** fires when the touched state of a field changed */
    onFieldTouchedStateChanged?: (fieldName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the dirty state of a field changed */
    onFieldDirtyStateChanged?: (fieldName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the error of a field changed */
    onFieldErrorChanged?: (fieldName: string, error: string, formApi: IDFormApi) => boolean | void;

    /** fires when the hidden state of a field changed */
    onFieldHiddenStateChanged?: (fieldName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the hidden state of a tab changed */
    onTabHiddenStateChanged?: (tabName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when read only state of a field changed */
    onFieldReadOnlyStateChanged?: (fieldName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when read only state of a tab changed */
    onTabReadOnlyStateChanged?: (tabName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the disable state of a field changes  */
    onFieldDisabledStateChanged?: (fieldName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the disable state of a tab changes  */
    onTabDisabledStateChanged?: (tabName: string, state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when a field is completely initialized, its data is loaded */
    onFieldReady?: (fieldName: string, formApi: IDFormApi) => boolean | void;

    /** fires when the dirty state of the form changed */
    onFormDirtyStateChanged?: (state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the read only state of the form changed */
    onFormReadOnlyStateChanged?: (state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the form began initialization (renders for the first time) */
    onFormInit?: (formApi: IDFormApi) => boolean | void;

    /** fires when the form initialized and all fields have fully loaded all the data */
    onFormReadyStateChanged?: (state: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when a field validated */
    onFieldValidated?: (fieldName: string, value: unknown, error: string, isSubmit: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the form validated */
    onFormValidated?: (values: Record<string, unknown>, errors: Record<string, string>, isSubmit: boolean, formApi: IDFormApi) => boolean | void;

    /** fires when the form has errors */
    onFormHasErrors?: (values: Record<string, unknown>, errors: Record<string, unknown>, formApi: IDFormApi) => boolean | void;

    /** fires when the form has no errors */
    onFormHasNoErrors?: (values: Record<string, unknown>, formApi: IDFormApi) => boolean | void;

    /** fires when the form trying to fetch data */
    onDataFetch?: (formApi: IDFormApi) => IDFormDataSourcePromise | undefined;

    /** fires when the form fetch success */
    onDataFetchSuccess?: (result: {data: Record<string, unknown>}, formApi: IDFormApi) => boolean | void;

    /** fires when the form fetch failed */
    onDataFetchError?: (message: string, code: number, formApi: IDFormApi) => boolean | void;

    /** fires after the completion of fetching the data, regardless of the result */
    onDataFetchComplete?: (formApi: IDFormApi) => boolean | void;

    /** fires on submitting validation */
    onSubmitValidation?: (values: Record<string, unknown>, errors: Record<string, string | undefined>, formApi: IDFormApi) => void | boolean;

    /** Fires on submitting the form. Can returns Promise, Object, Boolean or Void */
    onSubmit?: (values: Record<string, unknown>, formApi: IDFormApi) => IDFormSubmitResultPromise | IDFormSubmitResultObject | boolean | void;

    /** fires on submit success */
    onSubmitSuccess?: (values: Record<string, unknown>, resultValues: Record<string, unknown> | undefined, formApi: IDFormApi) => boolean | void;

    /** fires on submit error */
    onSubmitError?: (values: Record<string, unknown>, message: string, code: number, formApi: IDFormApi) => boolean | void;

    /** fires after the completion of sending the form, regardless of the result */
    onSubmitComplete?: (values: Record<string, unknown>, errors: Record<string, string | undefined>, formApi: IDFormApi) => boolean | void;

    /** fires, when the dataSet change */
    onDataSetChange?: (dataSet: IDFormDataSet | undefined, FormApi: IDFormApi) => IDFormDataSet | undefined;
}

//endregion

export const DForm = (props: IDFormProps): JSX.Element => {
    useUpdateMessageBoxTheme(); //set current theme to messageBox

    const [formProps, updateFormProps] = useGetActualProps(props); //props can be set both by parent component and via api

    //region Common component states
    const [formId] = useState(formProps.formId || 'dForm-' + getUuid());
    const [formApi] = useState((formProps.apiRef || {}) as IDFormApi);
    const [buttonsApi] = useState({} as IButtonsRowApi);
    const formButtons = useGetButtons(formProps, formApi); //init buttons
    //endregion

    const callbacks = useCallbacks(formProps, formApi);
    const formModel = useFormModel(formId, formProps, callbacks);
    useInitFormApi(formId, formApi, formModel, formProps, buttonsApi, updateFormProps);

    useInitialFetchData(formApi);

    useFormMounted(formApi);

    return <FormRender formApi={formApi} formButtons={formButtons} />;
};

const useFormModel = (formId: string, formProps: IDFormProps, callbacks: IDFormModelCallbacks) => {
    const modelRef = useRef<DModel>();
    if (!modelRef.current) modelRef.current = new DModel(formId, formProps, callbacks);

    return modelRef.current;
};

const useFormMounted = (formApi: IDFormApi) => {
    useEffect(() => {
        formApi.model.setFormMounted(true);
        return () => {
            formApi.model.setFormMounted(false);
        };
    });
};

const useInitialFetchData = (formApi: IDFormApi) => {
    useEffect(() => {
        const formMode = formApi.model.getFormMode();
        if (formMode !== 'update' && formMode !== 'clone' && formMode !== 'view') return;
        formApi.model.fetchData();
    }, [formApi]);
};
