/**
 * @InputComponent
 * @version 0.0.29.12
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import React, {useCallback, useEffect} from 'react';

import {Input} from 'antd';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldInputProps extends IDFormFieldProps {
    /** Default value */
    default?: string | number;

    /** Whether show text count */
    showCount?: boolean;

    /** The max length */
    maxLength?: number;
}

export const InputComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldInputProps;
    const value = formApi.model.getFieldValue(fieldName) as string | number | undefined;

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            formApi.model.setFieldValue(fieldName, e.target.value || null);
            formApi.model.setFieldDirty(fieldName, true);
        },
        [fieldName, formApi.model]
    );
    const onBlur = useCallback(() => {
        formApi.model.setFieldTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <Input
            autoFocus={fieldProps.autoFocus}
            disabled={formApi.model.isFieldDisabled(fieldName)}
            maxLength={fieldProps.maxLength}
            name={fieldName}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={fieldProps.placeholder}
            readOnly={formApi.model.isFieldReadOnly(fieldName)}
            showCount={fieldProps.showCount}
            value={value}
        />
    );
};
