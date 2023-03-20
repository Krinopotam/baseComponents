import React, {useMemo} from 'react';

import {IDFormCallbacks, IDFormDataSet} from 'baseComponents/dForm/dForm';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {MessageBox} from 'baseComponents/messageBox';

/**
 * Preparing callbacks for redirection to the form
 * @param formModalApi
 * @param modalFormProps
 */
export const useCallbacks = (formModalApi: IDFormModalApi, modalFormProps: IDFormModalProps) => {
    return useMemo((): IDFormCallbacks => {
        return {
            // Fields callbacks
            /** fires when the value of a field changed */
            onFieldValueChanged: (fieldName: string, value: unknown, prevValue: unknown) => {
                return modalFormProps.callbacks?.onFieldValueChanged?.(fieldName, value, prevValue, formModalApi);
            },

            /** fires when the touched state of a field changed */
            onFieldTouchedStateChanged: (fieldName: string, state: boolean) => {
                return modalFormProps.callbacks?.onFieldTouchedStateChanged?.(fieldName, state, formModalApi);
            },

            /** fires when the dirty state of a field changed */
            onFieldDirtyStateChanged: (fieldName: string, state: boolean) => {
                return modalFormProps.callbacks?.onFieldDirtyStateChanged?.(fieldName, state, formModalApi);
            },

            /** fires when the error of a field changed */
            onFieldErrorChanged: (fieldName: string, error: string) => {
                return modalFormProps.callbacks?.onFieldErrorChanged?.(fieldName, error, formModalApi);
            },

            /** fires when the hidden state of a field changed */
            onFieldHiddenStateChanged: (fieldName: string, state: boolean) => {
                return modalFormProps.callbacks?.onFieldHiddenStateChanged?.(fieldName, state, formModalApi);
            },

            /** fires when read only state of a field changed */
            onFieldReadOnlyStateChanged: (fieldName: string, state: boolean) => {
                return modalFormProps.callbacks?.onFieldReadOnlyStateChanged?.(fieldName, state, formModalApi);
            },

            /** fires when the disable state of a field changes  */
            onFieldDisabledStateChanged: (fieldName: string, state: boolean) => {
                return modalFormProps.callbacks?.onFieldDisabledStateChanged?.(fieldName, state, formModalApi);
            },

            /** fires when a field is completely initialized, its data is loaded */
            onFieldReady: (fieldName: string) => {
                return modalFormProps.callbacks?.onFieldReady?.(fieldName, formModalApi);
            },

            // Tabs callbacks
            /** fires when the hidden state of a tab changed */
            onTabHiddenStateChanged: (tabName: string, state: boolean) => {
                return modalFormProps.callbacks?.onFieldHiddenStateChanged?.(tabName, state, formModalApi);
            },
            /** fires when read only state of a tab changed */
            onTabReadOnlyStateChanged: (tabName: string, state: boolean) => {
                return modalFormProps.callbacks?.onTabReadOnlyStateChanged?.(tabName, state, formModalApi);
            },

            /** fires when the disable state of a tab changes  */
            onTabDisabledStateChanged: (tabName: string, state: boolean) => {
                return modalFormProps.callbacks?.onTabDisabledStateChanged?.(tabName, state, formModalApi);
            },

            // Form callbacks
            /** fires when the dirty state of the form changed */
            onFormDirtyStateChanged: (state: boolean) => {
                return modalFormProps.callbacks?.onFormDirtyStateChanged?.(state, formModalApi);
            },

            /** fires when the read only state of the form changed */
            onFormReadOnlyStateChanged: (state: boolean) => {
                return modalFormProps.callbacks?.onFormReadOnlyStateChanged?.(state, formModalApi);
            },

            /** fires when the form began initialization (renders for the first time) */
            onFormInit: () => {
                return modalFormProps.callbacks?.onFormInit?.(formModalApi);
            },

            /** fires when a form ready state changed */
            onFormReadyStateChanged: (state: boolean) => {
                return modalFormProps.callbacks?.onFormReadyStateChanged?.(state, formModalApi);
            },

            /** fires when a field validated */
            onFieldValidated: (fieldName: string, value: unknown, error: string, isSubmit: boolean) => {
                return modalFormProps.callbacks?.onFieldValidated?.(fieldName, value, error, isSubmit, formModalApi);
            },

            /** fires when the form validated */
            onFormValidated: (values: Record<string, unknown>, errors: Record<string, string>, isSubmit: boolean) => {
                return modalFormProps.callbacks?.onFormValidated?.(values, errors, isSubmit, formModalApi);
            },

            /** fires when the form has errors */
            onFormHasErrors: (values: Record<string, unknown>, errors: Record<string, unknown>) => {
                return modalFormProps.callbacks?.onFormHasErrors?.(values, errors, formModalApi);
            },

            /** fires when the form has no errors */
            onFormHasNoErrors: (values: Record<string, unknown>) => {
                return modalFormProps.callbacks?.onFormHasNoErrors?.(values, formModalApi);
            },

            /** fires when the form trying to fetch data */
            onDataFetch: () => {
                return modalFormProps.callbacks?.onDataFetch?.(formModalApi);
            },

            /** fires when the form fetch success */
            onDataFetchSuccess: (result: {data: Record<string, unknown>}) => {
                return modalFormProps.callbacks?.onDataFetchSuccess?.(result, formModalApi);
            },

            /** fires when the form fetch failed */
            onDataFetchError: (message: string, code: number) => {
                if (modalFormProps.callbacks?.onDataFetchError?.(message, code, formModalApi) === false) return false;

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
                                formModalApi.model.fetchData();
                            },
                        },
                        cancel: {
                            onClick: () => {
                                box.destroy();
                                formModalApi.forceClose?.();
                            },
                        },
                    },
                });

                return false;
            },

            /** fires after the completion of fetching the data, regardless of the result */
            onDataFetchComplete: () => {
                return modalFormProps.callbacks?.onDataFetchComplete?.(formModalApi);
            },

            /** fires on submit validation */
            onSubmitValidation: (values: Record<string, unknown>, errors: Record<string, string | undefined>) => {
                return modalFormProps.callbacks?.onSubmitValidation?.(values, errors, formModalApi);
            },

            /** fires on submitting the form */
            onSubmit: (values: Record<string, unknown>) => {
                formModalApi.buttonsApi.disabled?.('ok', true);
                formModalApi.buttonsApi.disabled?.('cancel', true);
                if (!modalFormProps.confirmChanges) formModalApi.buttonsApi.loading?.('ok', true);
                return modalFormProps.callbacks?.onSubmit?.(values, formModalApi);
            },

            /** fires on submit success */
            onSubmitSuccess: (values: Record<string, unknown>, resultValues: Record<string, unknown> | undefined) => {
                if (modalFormProps.callbacks?.onSubmitSuccess?.(values, resultValues, formModalApi) === false) return false;
                formModalApi.forceClose();
            },

            /** fires on submit error */
            onSubmitError: (values: Record<string, unknown>, message: string, code: number) => {
                return modalFormProps.callbacks?.onSubmitError?.(values, message, code, formModalApi);
            },

            /** fires after the completion of sending the form, regardless of the result */
            onSubmitComplete: (values: Record<string, unknown>, errors: Record<string, string | undefined>) => {
                if (modalFormProps.callbacks?.onSubmitComplete?.(values, errors, formModalApi) === false) return false;
                formModalApi.buttonsApi.disabled?.('ok', false);
                formModalApi.buttonsApi.disabled?.('cancel', false);
                formModalApi.buttonsApi.loading?.('ok', false);
            },
            /** fires, when the dataSet change */
            onDataSetChange: (dataSet: IDFormDataSet | undefined) => {
                return modalFormProps.callbacks?.onDataSetChange?.(dataSet, formModalApi);
            },
        } as IDFormCallbacks;
    }, [formModalApi, modalFormProps.callbacks, modalFormProps.confirmChanges]);
};
