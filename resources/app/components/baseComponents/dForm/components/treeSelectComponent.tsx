/**
 * @TreeSelectComponent
 * @version 0.0.30.34
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {ITreeSelectNode, ITreeSelectProps, ITreeSelectValue, TreeSelect} from 'baseComponents/treeSelect';
import React, {useCallback, useEffect} from 'react';

//region Types
type IDFormFieldTreeSelectProps_ = ITreeSelectProps & IDFormFieldProps;

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTreeSelectProps extends IDFormFieldTreeSelectProps_ {
    /** Default value */
    default?: ITreeSelectValue;

    /** Is user can clear value. Default: true */
    allowClear?: boolean;

    /** @deprecated The callback should not be used. Use callbacks.onChange instead  */
    onCustomChange?: (value: unknown) => void;
}

//endregion

export const TreeSelectComponent = ({formApi, fieldName}: IDFormComponentProps): JSX.Element => {
    const formProps = formApi.getFormProps();
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTreeSelectProps;
    const value = formApi.model.getFieldValue(fieldName) as ITreeSelectNode | ITreeSelectNode[] | undefined;

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
            autoFocus={fieldProps.autoFocus}
            defaultValueCallback={fieldProps.defaultValueCallback}
            style={{width: '100%'}}
            disabled={formApi.model.isFieldDisabled(fieldName)}
            readOnly={formApi.model.isFieldReadOnly(fieldName)}
            value={value}
            placeholder={fieldProps.placeholder || 'Выберите из списка'}
            allowClear={typeof fieldProps.allowClear === 'undefined' ? true : fieldProps.allowClear}
            fetchMode={fieldProps.fetchMode}
            dataSet={fieldProps.dataSet}
            multiple={fieldProps.multiple}
            treeCheckable={fieldProps.treeCheckable}
            minSearchLength={fieldProps.minSearchLength}
            labelRender={fieldProps.labelRender}
            titleRender={fieldProps.titleRender}
            filterTreeNode={fieldProps.filterTreeNode}
            fieldNames={fieldProps.fieldNames}
            selectedLabelProp={fieldProps.selectedLabelProp}
            debounce={fieldProps.debounce}
            noCacheFetchedData={fieldProps.noCacheFetchedData}
            editableFormProps={fieldProps.editableFormProps}
            callbacks={{
                onChange: onChange,
                onClear: onClear,
                ...fieldProps.callbacks
            }}
            onBlur={onBlur}
        />
    );
};
