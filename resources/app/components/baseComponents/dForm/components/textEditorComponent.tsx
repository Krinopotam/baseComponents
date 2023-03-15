/**
 * @TextEditorComponent
 * @version 0.0.29.92
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import 'react-quill/dist/quill.snow.css';

import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps} from './baseComponent';
import {IDFormFieldInputProps} from './inputComponent';
import ReactQuill from 'react-quill';

//TODO add all properties
// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormTextEditorProps extends IDFormFieldInputProps {
    /** Default value */
    default?: string | number;

    /** Allowed formats. This is separate from adding a control in the Toolbar. For example, you can configure Quill to allow bolded content to be pasted into an editor that has no bold button in the toolbar */
    formats: ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'color', 'background'];

    /** Toolbars buttons config */ //TODO add type
    toolbar: [];
}

const defaultColorList = [
    '#000000',
    '#e60000',
    '#ff9900',
    '#ffff00',
    '#008a00',
    '#0066cc',
    '#9933ff',
    '#ffffff',
    '#facccc',
    '#ffebcc',
    '#ffffcc',
    '#cce8cc',
    '#cce0f5',
    '#ebd6ff',
    '#bbbbbb',
    '#f06666',
    '#ffc266',
    '#ffff66',
    '#66b966',
    '#66a3e0',
    '#c285ff',
    '#888888',
    '#a10000',
    '#b26b00',
    '#b2b200',
    '#006100',
    '#0047b2',
    '#6b24b2',
    '#444444',
    '#5c0000',
    '#663d00',
    '#666600',
    '#003700',
    '#002966',
    '#3d1466',
];

const defaultFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'color', 'background'];

const defaultToolbar = [
    [{header: [1, 2, false]}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
    [{color: defaultColorList}],
    [{background: defaultColorList}],
    ['link'],
    ['clean'],
];

export const TextEditorComponent = ({formApi, fieldName}: IDFormComponentProps): JSX.Element => {
    const formProps = formApi.getFormProps();
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormTextEditorProps;
    const value = formApi.model.getFieldValue(fieldName) as string | undefined;
    const formats = fieldProps.formats || defaultFormats;
    const toolbar = fieldProps.toolbar || defaultToolbar;

    const modules = {
        toolbar: toolbar,
    };

    //TODO improve disabled mode
    const onChange = useCallback(
        (value: string) => {
            formApi.model.setFieldValue(fieldName, value || undefined);
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
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            modules={modules}
            formats={formats}
            readOnly={formApi.model.isFieldReadOnly(fieldName) || formApi.model.isFieldDisabled(fieldName)}
        />
    );
};
