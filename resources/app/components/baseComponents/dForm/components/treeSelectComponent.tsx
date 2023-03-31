/**
 * @TreeSelectComponent
 * @version 0.0.30.36
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {ITreeSelectProps, ITreeSelectValue, TreeSelect} from 'baseComponents/treeSelect';
import React, {useCallback, useEffect, useMemo} from 'react';
import {splitObject} from 'helpers/helpersObjects';

//region Types
type IDFormFieldTreeSelectProps_ = ITreeSelectProps & IDFormFieldProps;

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTreeSelectProps extends IDFormFieldTreeSelectProps_ {
    /** Default value */
    default?: ITreeSelectValue | string;

    /** @deprecated The callback should not be used. Use callbacks.onChange instead  */
    onCustomChange?: (value: unknown) => void;
}

//endregion

export const TreeSelectComponent = ({formApi, fieldName}: IDFormComponentProps): JSX.Element => {
    const formProps = formApi.getFormProps();

    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTreeSelectProps;
    const treeProps = useGetTreeSelectProps(fieldProps);
    const value = formApi.model.getFieldValue(fieldName) as ITreeSelectValue | string;

    const onChange = useCallback(
        (value: ITreeSelectValue) => {
            formApi.model.setFieldValue(fieldName, value || null);
            formApi.model.setFieldDirty(fieldName, true);

            fieldProps.callbacks?.onChange?.(value);
            fieldProps.onCustomChange?.(value);
        },
        [fieldName, fieldProps, formApi.model]
    );
    const onBlur = useCallback(() => {
        formApi.model.setFieldTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    const onClear = useCallback(() => {
        formApi.model.setFieldDirty(fieldName, true);
        formApi.model.setFieldTouched(fieldName, true);
        fieldProps.callbacks?.onClear?.();
    }, [fieldName, fieldProps.callbacks, formApi.model]);

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <TreeSelect
            style={{width: '100%'}}
            {...treeProps}
            autoFocus={fieldProps.autoFocus}
            defaultValueCallback={fieldProps.defaultValueCallback}
            disabled={formApi.model.isFieldDisabled(fieldName)}
            readOnly={formApi.model.isFieldReadOnly(fieldName)}
            value={value}
            placeholder={fieldProps.placeholder || 'Выберите из списка'}
            allowClear={fieldProps.allowClear !== false}
            callbacks={{
                onChange: onChange,
                onClear: onClear,
                ...fieldProps.callbacks,
            }}
            onBlur={onBlur}
        />
    );
};

const useGetTreeSelectProps = (props: IDFormFieldTreeSelectProps) => {
    return useMemo((): ITreeSelectProps => {
        const result = splitObject(props, [
            'onCustomChange',
            'component',
            'helpClass',
            'label',
            'placeholder',
            'tab',
            'inlineGroup',
            'default',
            'hidden',
            'dependsOn',
            'width',
            'autoFocus',
        ]);

        return result[1] as ITreeSelectProps;
    }, [props]);
};
