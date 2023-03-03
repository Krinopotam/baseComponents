import {IDFormFieldDragAndDropProps, DragAndDropComponent} from 'baseComponents/dForm/components/dragAndDropComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class DragAndDropComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = DragAndDropComponent; 
    }


    
    accept(value: IDFormFieldDragAndDropProps['accept']) {
        this._config.accept = value;
        return this;
    }

    
    action(value: IDFormFieldDragAndDropProps['action']) {
        this._config.action = value;
        return this;
    }

    
    beforeUpload(value: IDFormFieldDragAndDropProps['beforeUpload']) {
        this._config.beforeUpload = value;
        return this;
    }

    
    data(value: IDFormFieldDragAndDropProps['data']) {
        this._config.data = value;
        return this;
    }

    
    defaultFileList(value: IDFormFieldDragAndDropProps['defaultFileList']) {
        this._config.defaultFileList = value;
        return this;
    }

    
    directory(value: IDFormFieldDragAndDropProps['directory']) {
        this._config.directory = value;
        return this;
    }

    
    fileList(value: IDFormFieldDragAndDropProps['fileList']) {
        this._config.fileList = value;
        return this;
    }

    
    headers(value: IDFormFieldDragAndDropProps['headers']) {
        this._config.headers = value;
        return this;
    }

    
    iconRender(value: IDFormFieldDragAndDropProps['iconRender']) {
        this._config.iconRender = value;
        return this;
    }

    
    isImageUrl(value: IDFormFieldDragAndDropProps['isImageUrl']) {
        this._config.isImageUrl = value;
        return this;
    }

    
    itemRender(value: IDFormFieldDragAndDropProps['itemRender']) {
        this._config.itemRender = value;
        return this;
    }

    
    listType(value: IDFormFieldDragAndDropProps['listType']) {
        this._config.listType = value;
        return this;
    }

    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount(value: IDFormFieldDragAndDropProps['maxCount']) {
        this._config.maxCount = value;
        return this;
    }

    
    method(value: IDFormFieldDragAndDropProps['method']) {
        this._config.method = value;
        return this;
    }

    
    multiple(value: IDFormFieldDragAndDropProps['multiple']) {
        this._config.multiple = value;
        return this;
    }

    
    fileName(value: IDFormFieldDragAndDropProps['fileName']) {
        this._config.fileName = value;
        return this;
    }

    
    openFileDialogOnClick(value: IDFormFieldDragAndDropProps['openFileDialogOnClick']) {
        this._config.openFileDialogOnClick = value;
        return this;
    }

    
    previewFile(value: IDFormFieldDragAndDropProps['previewFile']) {
        this._config.previewFile = value;
        return this;
    }

    
    progress(value: IDFormFieldDragAndDropProps['progress']) {
        this._config.progress = value;
        return this;
    }

    
    showUploadList(value: IDFormFieldDragAndDropProps['showUploadList']) {
        this._config.showUploadList = value;
        return this;
    }

    
    withCredentials(value: IDFormFieldDragAndDropProps['withCredentials']) {
        this._config.withCredentials = value;
        return this;
    }

    
    onChange(value: IDFormFieldDragAndDropProps['onChange']) {
        this._config.onChange = value;
        return this;
    }

    
    onDrop(value: IDFormFieldDragAndDropProps['onDrop']) {
        this._config.onDrop = value;
        return this;
    }

    
    onDownload(value: IDFormFieldDragAndDropProps['onDownload']) {
        this._config.onDownload = value;
        return this;
    }

    
    onPreview(value: IDFormFieldDragAndDropProps['onPreview']) {
        this._config.onPreview = value;
        return this;
    }

    
    onRemove(value: IDFormFieldDragAndDropProps['onRemove']) {
        this._config.onRemove = value;
        return this;
    }

    
    type(value: IDFormFieldDragAndDropProps['type']) {
        this._config.type = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldDragAndDropProps
    }
}