/**
 * @LinkComponent
 * @version 0.0.29.7
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldLinkProps extends IDFormFieldProps {
    /** Anchor url */
    href?: string;

    /** Anchor target */
    target?: '_blank' | '_self' | '_parent' | '_top';
}

export const LinkComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldLinkProps;
    const value = formApi.model.getFieldValue(fieldName) as string | undefined;

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <a href={fieldProps.href} target={fieldProps.target}>
            {value}
        </a>
    );
};
