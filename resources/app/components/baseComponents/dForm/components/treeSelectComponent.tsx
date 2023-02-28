/**
 * @TreeSelectComponent
 * @version 0.0.30.33
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {ITreeSelectNode, ITreeSelectProps, ITreeSelectValue, TreeSelect} from 'baseComponents/treeSelect';
import React, {useCallback, useEffect, useMemo} from 'react';
import {cloneObject, mergeObjects} from 'helpers/helpersObjects';

import {IDFormApi} from "baseComponents/dForm/hooks/api";

//region Types
type IDFormFieldTreeSelectProps_ = Omit<ITreeSelectProps, 'onChange'> & IDFormFieldProps;

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTreeSelectProps extends IDFormFieldTreeSelectProps_ {
    /** Default value */
    default?: ITreeSelectValue;

    /** Is user can clear value. Default: true */
    allowClear?: boolean;

    onCustomChange?: (value: unknown) => void;
}

//endregion

export const TreeSelectComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTreeSelectProps;
    const value = formApi.model.getValue(fieldName) as ITreeSelectNode | ITreeSelectNode[] | undefined;

    const onChange = useCallback(
        (value: ITreeSelectValue) => {
            formApi.model.setValue(fieldName, value || null);
            formApi.model.setDirty(fieldName, true);

            if (fieldProps.onCustomChange !== undefined && typeof fieldProps.onCustomChange === 'function') {
                fieldProps.onCustomChange(value);
            }
        },
        [fieldName, fieldProps, formApi.model]
    );
    const onBlur = useCallback(() => {
        formApi.model.setTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    const onClear = useCallback(() => {
        formApi.model.setDirty(fieldName, true);
        formApi.model.setTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    const dataSource = usePrepareDataSource(formApi, fieldProps);

    useEffect(() => {
        formApi.model.setReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <TreeSelect
            autoFocus={fieldProps.autoFocus}
            defaultValueCallback={fieldProps.defaultValueCallback}
            dataSourceAdditionalData={fieldProps.dataSourceAdditionalData}
            style={{width: '100%'}}
            disabled={formApi.model.isDisabled(fieldName)}
            readOnly={formApi.model.isReadOnly(fieldName)}
            value={value}
            dataSource={dataSource}
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
            webServices={fieldProps.webServices || formProps.webService}
            debounce={fieldProps.debounce}
            noCacheFetchedData={fieldProps.noCacheFetchedData}
            editableFormDataSourceFieldId={fieldProps.editableFormDataSourceFieldId}
            editableFormProps={fieldProps.editableFormProps}
            onClear={onClear}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

/**
 * Add the values of the fields that the field depends on to the dataset
 * @param formApi
 * @param fieldProps
 * @returns
 */
const usePrepareDataSource = (formApi: IDFormApi, fieldProps: IDFormFieldTreeSelectProps) => {
    return useMemo(() => {
        if (!fieldProps.dataSource) return undefined;
        if (!fieldProps.dependsOn) return fieldProps.dataSource;

        const values: Record<string, unknown> = {};
        // Get a list of fields values which this field depends on
        for (const name of fieldProps.dependsOn) values[name] = formApi.model.getValue(name);

        const dataSourceExtra = {parameters: {data: values || {}}};

        return mergeObjects(cloneObject(fieldProps.dataSource), dataSourceExtra || {}) as IDFormFieldTreeSelectProps['dataSource'];
    }, [fieldProps.dependsOn, fieldProps.dataSource, formApi.model]);
};
