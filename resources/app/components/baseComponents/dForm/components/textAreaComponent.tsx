/**
 * @TextAreaComponent
 * @version 0.0.29.49
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps} from './baseComponent';
import {IDFormFieldInputProps} from './inputComponent';
import {Input} from 'antd';
import {TextAreaProps} from 'antd/es/input/TextArea';

const {TextArea} = Input;

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTextAreaProps extends IDFormFieldInputProps {
    /** Height auto size feature, can be set to true | false or an object ( minRows: 2, maxRows: 6 ) */
    autoSize?: TextAreaProps['autoSize'];

    /** Specifies the visible width of a text area */
    cols?: number;

    /** Specifies the visible number of lines in a text area */
    rows?: number;

    /** Default value */
    default?: string | number;

    /** Text wrap parameters. Specifies how the text in a text area is to be wrapped when submitted in a form */
    wrap?: 'soft | hard';
}

export const TextAreaComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTextAreaProps;
    const value = formApi.model.getFieldValue(fieldName) as string | number | readonly string[] | undefined;

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <TextArea
            autoFocus={fieldProps.autoFocus}
            autoSize={fieldProps.autoSize}
            cols={fieldProps.cols}
            disabled={formApi.model.isFieldDisabled(fieldName)}
            maxLength={fieldProps.maxLength}
            name={fieldName}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={fieldProps.placeholder}
            readOnly={formApi.model.isFieldReadOnly(fieldName)}
            rows={fieldProps.rows}
            showCount={fieldProps.showCount}
            value={value}
            wrap={fieldProps.wrap}
        />
    );
};
