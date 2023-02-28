/**
 * @InputComponent
 * @version 0.0.29.4
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
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
    const value = formApi.model.getValue(fieldName) as string | number | undefined;

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            formApi.model.setValue(fieldName, e.target.value || null);
            formApi.model.setDirty(fieldName, true);
        },
        [fieldName, formApi.model]
    );
    const onBlur = useCallback(() => {
        formApi.model.setTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    useEffect(() => {
        formApi.model.setReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <Input
            autoFocus={fieldProps.autoFocus}
            disabled={formApi.model.isDisabled(fieldName)}
            maxLength={fieldProps.maxLength}
            name={fieldName}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={fieldProps.placeholder}
            readOnly={formApi.model.isReadOnly(fieldName)}
            showCount={fieldProps.showCount}
            value={value}
        />
    );
};
