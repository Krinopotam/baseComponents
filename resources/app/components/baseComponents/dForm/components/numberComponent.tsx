/**
 * @NumberComponent
 * @version 0.0.30.13
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {InputNumber} from 'antd';
import {InputNumberProps} from "antd/es/input-number";

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldNumberProps extends IDFormFieldProps {
    /** The label text displayed after (on the right side of) the input field */
    addonAfter?: React.ReactNode;

    /** The label text displayed before (on the left side of) the input field */
    addonBefore?: React.ReactNode;

    /** Whether to show +- controls, or set custom arrows icon */
    controls?: InputNumberProps['controls']

    /** Decimal separator. Syntactic sugar of `formatter`. Config decimal separator of display. */
    decimalSeparator?: string;

    /** Default value */
    default?: string | number;

    /** Specifies the format of the value presented. Transform `value` to display value show in input */
    formatter?: InputNumberProps['formatter'];

    /** If enable keyboard behavior */
    keyboard?: boolean;

    /** Max input length */
    maxLength?: number;

    /** The max value */
    max?: number;

    /** The min value */
    min?: number;

    /** Specifies the value extracted from formatter. Parse display value to validate number */
    parser?: InputNumberProps['parser'];

    /** The precision of input value. Will use formatter when config of formatter. Syntactic sugar of `formatter`. Config precision of display. */
    precision?: number;

    /** The prefix icon for the Input */
    prefix?: React.ReactNode;

    /** The number to which the current value is increased or decreased. It can be an integer or decimal */
    step?: number | string;
    /** Set value as string to support high precision decimals. Will return string value by onChange */
    stringMode?: boolean;

    /** Up handler */
    upHandler?: React.ReactNode;

    /** Down handler */
    downHandler?: React.ReactNode;

    /** Class name */
    className?: string;

    /** Prefix class name */
    prefixCls?: string;
}

export const NumberComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldNumberProps;

    const value = formApi.model.getFieldValue(fieldName) as number | undefined;

    const onChange = useCallback(
        (val: string | number | null) => {
            formApi.model.setFieldValue(fieldName, val || 0);
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
        <InputNumber
            addonAfter={fieldProps.addonAfter}
            addonBefore={fieldProps.addonBefore}
            autoFocus={fieldProps.autoFocus}
            className={fieldProps.className}
            controls={fieldProps.controls}
            decimalSeparator={fieldProps.decimalSeparator}
            disabled={formApi.model.isFieldDisabled(fieldName)}
            downHandler={fieldProps.downHandler}
            formatter={fieldProps.formatter}
            keyboard={fieldProps.keyboard}
            max={fieldProps.max}
            maxLength={fieldProps.maxLength}
            min={fieldProps.min}
            name={fieldName}
            onBlur={onBlur}
            onChange={onChange}
            parser={fieldProps.parser}
            placeholder={fieldProps.placeholder}
            precision={fieldProps.precision}
            prefix={fieldProps.prefix}
            prefixCls={fieldProps.prefixCls}
            readOnly={formApi.model.isFieldReadOnly(fieldName)}
            step={fieldProps.step}
            stringMode={fieldProps.stringMode}
            style={{width: '100%'}}
            upHandler={fieldProps.upHandler}
            value={value}
        />
    );
};
