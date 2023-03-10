/**
 * @BaseComponent
 * @version 0.0.33.19
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useSyncExternalStore} from 'react';

import Animate from 'rc-animate';
import {Form} from 'antd';
import { IDFormApi } from '../hooks/api';
import {IDFormFieldCheckBoxProps} from "baseComponents/dForm/components/checkboxComponent";
import {IDFormFieldDateTimeProps} from "baseComponents/dForm/components/dateTimeComponent";
import {IDFormFieldDragAndDropProps} from "baseComponents/dForm/components/dragAndDropComponent";
import {IDFormFieldGridProps} from "baseComponents/dForm/components/gridComponent";
import {IDFormFieldInputProps} from "baseComponents/dForm/components/inputComponent";
import {IDFormFieldLinkProps} from "baseComponents/dForm/components/linkComponent";
import {IDFormFieldNumberProps} from "baseComponents/dForm/components/numberComponent";
import {IDFormFieldPasswordProps} from "baseComponents/dForm/components/passwordComponent";
import {IDFormFieldSelectProps} from "baseComponents/dForm/components/selectComponent";
import {IDFormFieldSwitchProps} from "baseComponents/dForm/components/switchComponent";
import {IDFormFieldTextAreaProps} from "baseComponents/dForm/components/textAreaComponent";
import {IDFormFieldTreeSelectProps} from 'baseComponents/dForm/components/treeSelectComponent';
import {IDFormProps} from '../dForm';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldProps {
    /** Field React component */
    component: React.FC<IDFormComponentProps>;

    /** Help class */
    helpClass?: string;

    /** Field label */
    label?: string | React.ReactNode;

    /** Field placeholder*/
    placeholder?: string;

    /** tab name */
    tab?: string;

    /** inline group name */
    inlineGroup?: string;

    /** Field default value */
    default?: unknown;

    /** If field default state is hidden */
    hidden?: boolean;

    /** If field default state is disabled */
    disabled?: boolean;

    /** If field default state is readonly */
    readOnly?: boolean;

    /** List of fields that must be filled in order to display this field */
    dependsOn?: string[];

    /** Field width */
    width?: string | number;

    /** Get focus by default */
    autoFocus?: boolean;
}

/** Fields properties collection */
export type IDFormFieldsProps = Record<string, IDFormFieldProps>;

export type IDFormAnyFieldProps =
    | IDFormFieldProps
    | IDFormFieldCheckBoxProps
    | IDFormFieldDateTimeProps
    | IDFormFieldDragAndDropProps
    | IDFormFieldGridProps
    | IDFormFieldInputProps
    | IDFormFieldLinkProps
    | IDFormFieldNumberProps
    | IDFormFieldPasswordProps
    | IDFormFieldSelectProps
    | IDFormFieldSwitchProps
    | IDFormFieldTextAreaProps
    | IDFormFieldTreeSelectProps;

/** Field component properties */
export interface IDFormComponentProps {
    /** field name */
    fieldName: string;

    /** form api instance */
    formApi: IDFormApi;

    /** form properties */
    formProps: IDFormProps;
}

export const BaseComponent = ({fieldName, formApi, formProps, noLabel}: IDFormComponentProps & {noLabel?: boolean}): JSX.Element => {
    useExternalRenderCall(formApi, fieldName);

    const fieldProps = formProps.fieldsProps[fieldName];

    const error = formApi.model.getFieldError(fieldName);
    const fieldTouched = formApi.model.isFieldTouched(fieldName);
    const fieldHidden = formApi.model.isFieldHidden(fieldName);
    const formSubmitCount = formApi.model.getSubmitCount();

    const Component = formProps.fieldsProps[fieldName].component;

    const style = {
        //marginBottom: formProps.layout !== 'horizontal' ? 0 : undefined,
        width: fieldProps.width,
        flexGrow: fieldProps.width ? 0 : 1,
        flexShrink: fieldProps.width ? 0 : 1,
        flexBasis: fieldProps.width ? undefined : 0,
    };

    return (
        <Animate component="" transitionName="zoom">
            {!fieldHidden ? (
                <Form.Item
                    key={'item_' + fieldName}
                    label={!noLabel ? fieldProps.label : undefined}
                    //name={fieldName} //!Do not specify "name". Components inside Form.Item with "name" property will turn into controlled mode, which makes "defaultValue" and "value" not work anymore
                    help={(fieldTouched || formSubmitCount > 0) && error ? error : ''}
                    validateStatus={(fieldTouched || formSubmitCount > 0) && error ? 'error' : ''}
                    style={style}
                >
                    <Component fieldName={fieldName} formApi={formApi} formProps={formProps} />
                </Form.Item>
            ) : null}
        </Animate>
    );
};

const useExternalRenderCall = (formApi: IDFormApi, fieldName: string) => {
    const subscribe = formApi.model.subscribeRenderField(fieldName);

    const getSnapshot = () => {
        const snaps = formApi.model.getFieldRenderSnapshots();
        if (!snaps[fieldName]) return undefined;
        return snaps[fieldName];
    };

    return useSyncExternalStore(subscribe, getSnapshot);
};
