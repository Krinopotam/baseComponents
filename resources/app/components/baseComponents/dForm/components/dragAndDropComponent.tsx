/**
 * @DragAndDropComponent
 * @version 0.0.28.88
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {HttpRequestHeader, ItemRender, ShowUploadListInterface, UploadListProgressProps, UploadListType, UploadType} from 'antd/es/upload/interface';
import {RcFile, UploadChangeParam, UploadFile} from 'antd/es/upload';
import React, {useCallback, useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import {InboxOutlined} from '@ant-design/icons';
import {Upload} from 'antd';

const {Dragger} = Upload;

//TODO add descriptions, rework default value
// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldDragAndDropProps extends IDFormFieldProps {
    accept?: string;
    action?: string | ((file: RcFile) => string) | ((file: RcFile) => Promise<string>);
    beforeUpload?: (file: RcFile, fileList: RcFile[]) => boolean | Promise<File>;
    data?: Record<string, unknown> | ((file: UploadFile<unknown>) => Record<string, unknown> | Promise<Record<string, unknown>>);
    defaultFileList?: Array<UploadFile<unknown>>;
    directory?: boolean;
    fileList?: Array<UploadFile<unknown>>;
    headers?: HttpRequestHeader;
    iconRender?: (file: UploadFile<unknown>, listType?: UploadListType) => React.ReactNode;
    isImageUrl?: (file: UploadFile) => boolean;
    itemRender?: ItemRender<unknown>;
    listType?: UploadListType;
    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount?: number;
    method?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';
    multiple?: boolean;
    fileName?: string;
    openFileDialogOnClick?: boolean;
    previewFile?: (file: File | Blob) => Promise<string>;
    progress?: UploadListProgressProps;
    showUploadList?: boolean | ShowUploadListInterface;
    withCredentials?: boolean;
    onChange?: (info: UploadChangeParam<UploadFile<unknown>>) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDownload?: (file: UploadFile<unknown>) => void;
    onPreview?: (file: UploadFile<unknown>) => void;
    onRemove?: (file: UploadFile<unknown>) => void | boolean | Promise<void | boolean>;
    type?: UploadType;
}

export const DragAndDropComponent = ({formApi, fieldName}: IDFormComponentProps): JSX.Element => {
    const formProps = formApi.getFormProps();
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldDragAndDropProps;
    //const value = formApi.model.getValue(fieldName) as string | number | readonly string[] | undefined;

    const onChange = useCallback(
        (e: UploadChangeParam<UploadFile<unknown>>) => {
            formApi.model.setFieldValue(fieldName, e.fileList || null);
            formApi.model.setFieldDirty(fieldName, true);
            formApi.model.setFieldTouched(fieldName, true);
            fieldProps.onChange?.(e);
        },
        [fieldName, fieldProps, formApi.model]
    );

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    // TODO comb, display help depending on the settings
    return (
        <Dragger
            accept={fieldProps.accept}
            action={fieldProps.action}
            beforeUpload={fieldProps.beforeUpload}
            data={fieldProps.data}
            defaultFileList={fieldProps.defaultFileList}
            directory={fieldProps.directory}
            disabled={formApi.model.isFieldReadOnly(fieldName) || formApi.model.isFieldDisabled(fieldName)}
            fileList={fieldProps.fileList}
            headers={fieldProps.headers}
            iconRender={fieldProps.iconRender}
            isImageUrl={fieldProps.isImageUrl}
            itemRender={fieldProps.itemRender}
            listType={fieldProps.listType}
            maxCount={fieldProps.maxCount}
            method={fieldProps.method}
            multiple={fieldProps.multiple}
            name={fieldProps.fileName}
            onChange={onChange}
            onDownload={fieldProps.onDownload}
            onDrop={fieldProps.onDrop}
            onPreview={fieldProps.onPreview}
            onRemove={fieldProps.onRemove}
            openFileDialogOnClick={fieldProps.openFileDialogOnClick}
            previewFile={fieldProps.previewFile}
            progress={fieldProps.progress}
            showUploadList={fieldProps.showUploadList}
            type={fieldProps.type}
            withCredentials={fieldProps.withCredentials}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
            <p className="ant-upload-hint">Поддержка одиночной или массовой загрузки.</p>
        </Dragger>
    );
};
