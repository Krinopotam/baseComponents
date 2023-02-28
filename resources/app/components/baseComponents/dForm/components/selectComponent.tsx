/**
 * @SelectComponent
 * @version 0.0.32.18
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useCallback, useEffect} from 'react';
import {Select, Space} from 'antd';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {LabeledValue} from 'antd/es/select';
import {SelectProps} from "rc-select/lib/Select";

const {Option} = Select;

/**
 * Item of select control or enum table column
 */
export interface ISelectComponentElement {
    id: string | number;
    title: string | React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
}

type BaseValueType = RawValueType | null;
type RawValueType = string | number;

interface DisplayValueType {
    key?: React.Key;
    value?: RawValueType;
    label?: React.ReactNode;
    title?: string | number;
    disabled?: boolean;
}

type CustomTagProps = {
    label: React.ReactNode;
    value: unknown;
    disabled: boolean;
    onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    closable: boolean;
};

type OptionType = {
    label: React.ReactNode;
    value?: BaseValueType;
    disabled?: boolean;
};

type ValueType = string | string[] | number | number[] | LabeledValue | LabeledValue[];

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldSelectProps extends IDFormFieldProps {
    dataSet: ISelectComponentElement[];

    /** Show clear button */
    allowClear?: boolean;

    /** Whether the current search will be cleared on selecting an item. Only applies when mode is set to multiple or tags (default true) */
    autoClearSearchValue?: boolean;

    /** The custom clear icon */
    clearIcon?: React.ReactNode;

    /** Whether active first option by default */
    defaultActiveFirstOption?: boolean;

    /** Initial open state of dropdown */
    defaultOpen?: boolean;

    /** Initial selected option */
    default?: ValueType;

    /** The className of dropdown menu */
    popupClassName?: string;

    /** Customize dropdown content */
    dropdownRender?: (originNode: React.ReactElement) => React.ReactElement;

    /** Customize node label, value, options field name */
    fieldNames?:SelectProps['fieldNames'],

    /** If true, filter options by input, if function, filter options against it. */
    filterOption?: boolean | ((inputValue: string, option?: OptionType) => boolean);

    /** Sort function for search options sorting, see Array sort compareFunction */
    filterSort?: (optionA: OptionType, optionB: OptionType) => number;

    /** Whether to embed label in value, turn the format of value from string to ( value: string, label: ReactNode ) */
    labelInValue?: boolean;

    /** Config popup height (default 256) */
    listHeight?: number;

    /** Indicate loading state */
    loading?: boolean;

    /** Max tag count to show. responsive will cost render performance */
    maxTagCount?: number | 'responsive';

    /** Placeholder for not showing tags */
    maxTagPlaceholder?: React.ReactNode | ((omittedValues: DisplayValueType[]) => React.ReactNode);

    /** Max tag text length to show */
    maxTagTextLength?: number;

    /** The custom menuItemSelected icon with multiple options */
    menuItemSelectedIcon?: React.ReactNode;

    /** Set mode of Select */
    mode?: 'multiple' | 'tags';

    /** Specify content to show when no result matches */
    notFoundContent?: React.ReactNode;

    /** Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label */
    optionFilterProp?: string;

    /** Which prop value of option will render as content of select. */
    optionLabelProp?: string;

    /** The position where the selection box pops up */
    placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

    /** The custom remove icon */
    removeIcon?: React.ReactNode;

    /** Whether to show the drop-down arrow: true(for single select), false(for multiple select) */
    showArrow?: boolean;

    /** Whether select is searchable: single: false, multiple: true */
    showSearch?: boolean;

    /** The custom suffix icon */
    suffixIcon?: React.ReactNode;

    /** Customize tag render, only applies when mode is set to multiple or tags */
    tagRender?: (props: CustomTagProps) => React.ReactElement;

    /** Separator used to tokenize, only applies when mode="tags" */
    tokenSeparators?: string[];

    /** Disable virtual scroll when set to false */
    virtual?: boolean;
}

/**
 * Base Select control
 *
 * @param formModelApi
 * @param formProps
 * @param fieldName
 * @constructor
 */
export const SelectComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldSelectProps;
    const value = formApi.model.getValue(fieldName) as string | string[] | number | number[] | LabeledValue | LabeledValue[];

    const onChange = useCallback(
        (value: ValueType) => {
            formApi.model.setValue(fieldName, value);
            formApi.model.setDirty(fieldName, true);
        },
        [fieldName, formApi.model]
    );
    const onBlur = useCallback(() => {
        formApi.model.setTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    // make options list
    const options: React.ReactNode[] = [];
    let currentValue = undefined;
    const defIdx = 0;
    for (let idx = 0; idx < fieldProps.dataSet.length; idx++) {
        const item = fieldProps.dataSet[idx];
        const label = SelectComponentElementRenterTitle(item, false);
        const option = (
            <Option value={item.id} disabled={item.disabled} key={'sel_key_' + idx}>
                {label}
            </Option>
        );
        options.push(option);
        if (item.id == value)
            currentValue = {
                value: fieldProps.dataSet[defIdx].id as string,
                label: label,
            };
    }

    useEffect(() => {
        formApi.model.setReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <Select
            allowClear={typeof fieldProps.allowClear === 'undefined' ? true : fieldProps.allowClear}
            autoClearSearchValue={fieldProps.autoClearSearchValue}
            autoFocus={fieldProps.autoFocus}
            clearIcon={fieldProps.clearIcon}
            defaultActiveFirstOption={fieldProps.defaultActiveFirstOption}
            defaultOpen={fieldProps.defaultOpen}
            disabled={formApi.model.isDisabled(fieldName) || formApi.model.isReadOnly(fieldName)}
            fieldNames={fieldProps.fieldNames}
            filterOption={fieldProps.filterOption}
            filterSort={fieldProps.filterSort}
            labelInValue={fieldProps.labelInValue}
            listHeight={fieldProps.listHeight}
            loading={fieldProps.loading}
            maxTagCount={fieldProps.maxTagCount}
            maxTagPlaceholder={fieldProps.maxTagPlaceholder}
            maxTagTextLength={fieldProps.maxTagTextLength}
            menuItemSelectedIcon={fieldProps.menuItemSelectedIcon}
            mode={fieldProps.mode}
            notFoundContent={fieldProps.notFoundContent}
            onBlur={onBlur}
            onChange={onChange}
            optionFilterProp={fieldProps.optionFilterProp}
            optionLabelProp={fieldProps.optionLabelProp}
            placeholder={fieldProps.placeholder}
            placement={fieldProps.placement}
            popupClassName={fieldProps.popupClassName}
            removeIcon={fieldProps.removeIcon}
            showArrow={fieldProps.showArrow}
            showSearch={fieldProps.showSearch}
            suffixIcon={fieldProps.suffixIcon}
            tagRender={fieldProps.tagRender}
            tokenSeparators={fieldProps.tokenSeparators}
            value={currentValue}
            virtual={fieldProps.virtual}
        >
            {options}
        </Select>
    );
};

/**
 * Default render for select element
 * @constructor
 */
export const SelectComponentElementRenterTitle = (fieldProps: ISelectComponentElement, setColorDisabled = true) => {
    const color = setColorDisabled && fieldProps.disabled ? 'grey' : undefined;
    return fieldProps.icon ? (
        <Space style={{color: color}}>
            {fieldProps.icon}
            {fieldProps.title}
        </Space>
    ) : (
        <span style={{color: color}}>{fieldProps.title}</span>
    );
};
