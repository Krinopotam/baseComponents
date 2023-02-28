/**
 * @SwitchComponent
 * @version 0.0.29.0
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {Switch} from 'antd';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldSwitchProps extends IDFormFieldProps {
    /** Default value */
    default?: boolean;

    /** The content to be shown when the state is checked */
    checkedChildren?: React.ReactNode;

    /** The content to be shown when the state is unchecked */
    unCheckedChildren?: React.ReactNode;

    /** Loading state of switch */
    loading?: boolean;
}

export const SwitchComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldSwitchProps;
    const value = formApi.model.getValue(fieldName) as boolean | undefined;

    const onChange = useCallback(
        (checked: boolean) => {
            formApi.model.setValue(fieldName, checked || false);
            formApi.model.setDirty(fieldName, true);
            formApi.model.setTouched(fieldName, true);
        },
        [fieldName, formApi.model]
    );

    useEffect(() => {
        formApi.model.setReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <Switch
            autoFocus={fieldProps.autoFocus}
            checked={value}
            checkedChildren={fieldProps.checkedChildren}
            disabled={formApi.model.isDisabled(fieldName) || formApi.model.isReadOnly(fieldName)}
            loading={fieldProps.loading}
            onChange={onChange}
            unCheckedChildren={fieldProps.unCheckedChildren}
        />
    );
};
