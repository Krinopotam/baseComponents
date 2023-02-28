/**
 * @PasswordComponent
 * @version 0.0.29.4
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {Input} from 'antd';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldPasswordProps extends IDFormFieldProps {
    /** Default value */
    default?: string | number;

    /** Show input counter */
    showCount?: boolean;

    /** Max input length */
    maxLength?: number;

    /** Icons render */
    iconRender?: (visible: boolean) => React.ReactNode;
}

export const PasswordComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldPasswordProps;
    const value = formApi.model.getValue(fieldName) as string | number | readonly string[] | undefined;

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
        <Input.Password
            autoFocus={fieldProps.autoFocus}
            disabled={formApi.model.isDisabled(fieldName)}
            iconRender={fieldProps.iconRender}
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
