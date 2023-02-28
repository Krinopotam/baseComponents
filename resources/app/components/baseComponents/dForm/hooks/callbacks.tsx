import React, { useMemo } from 'react';

import { IDFormApi } from 'baseComponents/dForm/hooks/api';
import { IDFormModelCallbacks } from 'baseComponents/dForm/dModel';
import { IDFormProps } from 'baseComponents/dForm/dForm';
import { MessageBox } from 'baseComponents/messageBox';

/**
 * Preparing callbacks for redirection to the model
 * @param formProps
 * @param formApi
 */
export const useCallbacks = (formProps: IDFormProps, formApi: IDFormApi) => {
    return useMemo((): IDFormModelCallbacks => {
        return {
            // Fields callbacks

            /** fires when the value of a field changed */
            onFieldValueChanged: (fieldName: string, value: unknown, prevValue: unknown) => {
                formProps.callbacks?.onFieldValueChanged?.(fieldName, value, prevValue, formApi);
            },

            /** fires when the touched state of a field changed */
            onFieldTouchedStateChanged: (fieldName: string, state: boolean) => {
                formProps.callbacks?.onFieldTouchedStateChanged?.(fieldName, state, formApi);
            },

            /** fires when the dirty state of a field changed */
            onFieldDirtyStateChanged: (fieldName: string, state: boolean) => {
                formProps.callbacks?.onFieldDirtyStateChanged?.(fieldName, state, formApi);
            },

            /** fires when the error of a field changed */
            onFieldErrorChanged: (fieldName: string, error: string) => {
                formProps.callbacks?.onFieldErrorChanged?.(fieldName, error, formApi);
            },

            /** fires when the hidden state of a field changed */
            onFieldHiddenStateChanged: (fieldName: string, state: boolean) => {
                formProps.callbacks?.onFieldHiddenStateChanged?.(fieldName, state, formApi);
            },

            /** fires when read only state of a field changed */
            onFieldReadOnlyStateChanged: (fieldName: string, state: boolean) => {
                formProps.callbacks?.onFieldReadOnlyStateChanged?.(fieldName, state, formApi);
            },

            /** fires when the disable state of a field changes  */
            onFieldDisabledStateChanged: (fieldName: string, state: boolean) => {
                formProps.callbacks?.onFieldDisabledStateChanged?.(fieldName, state, formApi);
            },

            /** fires when a field is completely initialized, its data is loaded */
            onFieldReady: (fieldName: string) => {
                formProps.callbacks?.onFieldReady?.(fieldName, formApi);
            },

            // Tabs callbacks
            /** fires when the hidden state of a tab changed */
            onTabHiddenStateChanged: (tabName: string, state: boolean) => {
                formProps.callbacks?.onFieldHiddenStateChanged?.(tabName, state, formApi);
            },

            /** fires when read only state of a tab changed */
            onTabReadOnlyStateChanged: (tabName: string, state: boolean) => {
                formProps.callbacks?.onTabReadOnlyStateChanged?.(tabName, state, formApi);
            },

            /** fires when the disable state of a tab changes  */
            onTabDisabledStateChanged: (tabName: string, state: boolean) => {
                formProps.callbacks?.onTabDisabledStateChanged?.(tabName, state, formApi);
            },

            // The form callback
            /** fires when the dirty state of the form changed */
            onFormDirtyStateChanged: (state: boolean) => {
                formProps.callbacks?.onFormDirtyStateChanged?.(state, formApi);
            },

            /** fires when the read only state of the form changed */
            onFormReadOnlyStateChanged: (state: boolean) => {
                formProps.callbacks?.onFormReadOnlyStateChanged?.(state, formApi);
            },

            /** fires when the form began initialization (renders for the first time) */
            onFormInit: () => {
                formProps.callbacks?.onFormInit?.(formApi);
            },

            /** fires when a form ready state changed */
            onFormReadyStateChanged: (state: boolean) => {
                if (formProps.callbacks?.onFormReadyStateChanged?.(state, formApi) === false) return;
                console.log('formReady: ' + state); //TODO: Remove after tests
                if (state) formApi.buttonsApi.disabled('ok', false);
                else formApi.buttonsApi.disabled('ok', true);
            },

            /** fires when a field validated */
            onFieldValidated: (fieldName: string, value: unknown, error: string, isSubmit: boolean) => {
                formProps.callbacks?.onFieldValidated?.(fieldName, value, error, isSubmit, formApi);
            },

            /** fires when the form validated */
            onFormValidated: (values: Record<string, unknown>, errors: Record<string, string>, isSubmit: boolean) => {
                formProps.callbacks?.onFormValidated?.(values, errors, isSubmit, formApi);
            },

            /** fires when the form has errors */
            onFormHasErrors: (values: Record<string, unknown>, errors: Record<string, unknown>) => {
                formProps.callbacks?.onFormHasErrors?.(values, errors, formApi);
            },

            /** fires when the form has no errors */
            onFormHasNoErrors: (values: Record<string, unknown>) => {
                if (formProps.callbacks?.onFormHasNoErrors?.(values, formApi) === false) return;
                formApi.buttonsApi.disabled('ok', false);
            },

            /** fires when the form trying to fetch data */
            onDataFetch: () => {
                return formProps.callbacks?.onDataFetch?.(formApi);
            },

            /** fires when the form fetch success */
            onDataFetchSuccess: (result: {data: Record<string, unknown>}) => {
                if (formProps.callbacks?.onDataFetchSuccess?.(result, formApi) === false) return;
                //formApi.buttonsApi.disabled('ok', false);
            },

            /** fires when the form fetch failed */
            onDataFetchError: (message: string, code: number) => {
                if (formProps.callbacks?.onDataFetchError?.(message, code, formApi) === false) return;

                const box = MessageBox.confirm({
                    content: (
                        <>
                            <p>{message}</p>
                            <p>{'Попробовать снова?'}</p>
                        </>
                    ),
                    type: 'error',
                    buttons: {
                        ok: {
                            onClick: () => {
                                box.destroy();
                                formApi.model.fetchData();
                            },
                        },
                    },
                });
            },

            /** fires after the completion of fetching the data, regardless of the result */
            onDataFetchComplete: () => {
                formProps.callbacks?.onDataFetchComplete?.(formApi);
            },

            /** fires on submit validation */
            onSubmitValidation: (values: Record<string, unknown>, errors: Record<string, string | undefined>) => {
                formProps.callbacks?.onSubmitValidation?.(values, errors, formApi);
            },

            /** fires on submitting the form */
            onSubmit: (values: Record<string, unknown>) => {
                formApi.buttonsApi.disabled('ok', true);
                if (!formProps.confirmChanges) formApi.buttonsApi.loading('ok', true);
                return formProps.callbacks?.onSubmit?.(values, formApi);
            },

            /** fires on submit success */
            onSubmitSuccess: (values: Record<string, unknown>, resultValues: Record<string, unknown> | undefined) => {
                formProps.callbacks?.onSubmitSuccess?.(values, resultValues, formApi);
            },

            /** fires on submit error */
            onSubmitError: (values: Record<string, unknown>, message: string, code: number) => {
                if (formProps.callbacks?.onSubmitError?.(values, message, code, formApi) === false) return;
                MessageBox.alert({content: message, type: 'error'});
            },

            /** fires after the completion of sending the form, regardless of the result */
            onSubmitComplete: (values: Record<string, unknown>, errors: Record<string, string | undefined>) => {
                if (formProps.callbacks?.onSubmitComplete?.(values, errors, formApi) === false) return;
                formApi.buttonsApi.disabled('ok', false);
            },
        };
    }, [formProps.callbacks, formProps.confirmChanges, formApi]);
};
