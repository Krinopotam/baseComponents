/**
 * @CheckboxComponent
 * @version 0.0.28.93
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';

import {Checkbox} from 'antd';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldCheckBoxProps extends IDFormFieldProps {
    /** default value */
    default?: boolean;

    /** The indeterminate checked state of checkbox */
    indeterminate?: boolean;
}

export const CheckboxComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldCheckBoxProps;
    const value = formApi.model.getValue(fieldName) as boolean;

    const onChange = useCallback(
        (e: CheckboxChangeEvent) => {
            formApi.model.setValue(fieldName, e.target.checked || false);
            formApi.model.setTouched(fieldName, true);
            formApi.model.setDirty(fieldName, true);
        },
        [fieldName, formApi.model]
    );

    useEffect(() => {
        formApi.model.setReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <Checkbox
            checked={value}
            disabled={formApi.model.isDisabled(fieldName) || formApi.model.isReadOnly(fieldName)}
            onChange={onChange}
            autoFocus={fieldProps.autoFocus}
            indeterminate={fieldProps.indeterminate}
        />
    );
};
