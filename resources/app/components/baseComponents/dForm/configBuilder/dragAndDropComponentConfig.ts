import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IRuleType} from '../validators/baseValidator';
import {IDFormFieldDragAndDropProps, DragAndDropComponent} from 'baseComponents/dForm/components/dragAndDropComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class DragAndDropComponentConfig<T>  extends BaseComponentConfig<T> {
    protected _config: Record<string, unknown> = {};
    protected readonly _id: keyof T;
    protected _validationRules: IRuleType[] = [];

    constructor(id: keyof T) {
        super(id);
        this._id = id;
        this._config.component = DragAndDropComponent; 
    }


    /** Help class */
    helpClass(value: IDFormFieldProps['helpClass']) {
        this._config.helpClass = value;
        return this;
    }

    /** Field label */
    label(value: IDFormFieldProps['label']) {
        this._config.label = value;
        return this;
    }

    /** Field placeholder*/
    placeholder(value: IDFormFieldProps['placeholder']) {
        this._config.placeholder = value;
        return this;
    }

    /** tab name */
    tab(value: IDFormFieldProps['tab']) {
        this._config.tab = value;
        return this;
    }

    /** inline group name */
    inlineGroup(value: IDFormFieldProps['inlineGroup']) {
        this._config.inlineGroup = value;
        return this;
    }

    /** Field default value */
    default(value: IDFormFieldProps['default']) {
        this._config.default = value;
        return this;
    }

    /** If field default state is hidden */
    hidden(value: IDFormFieldProps['hidden']) {
        this._config.hidden = value;
        return this;
    }

    /** If field default state is disabled */
    disabled(value: IDFormFieldProps['disabled']) {
        this._config.disabled = value;
        return this;
    }

    /** If field default state is readonly */
    readOnly(value: IDFormFieldProps['readOnly']) {
        this._config.readOnly = value;
        return this;
    }

    /** List of fields that must be filled in order to display this field */
    dependsOn(value: IDFormFieldProps['dependsOn']) {
        this._config.dependsOn = value;
        return this;
    }

    /** Field width */
    width(value: IDFormFieldProps['width']) {
        this._config.width = value;
        return this;
    }

    /** Get focus by default */
    autoFocus(value: IDFormFieldProps['autoFocus']) {
        this._config.autoFocus = value;
        return this;
    }

    /** Field callbacks */
    callbacks(value: IDFormFieldProps['callbacks']) {
        this._config.callbacks = value;
        return this;
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


    /** Add validation rules */
    validationRules(...args: IRuleType[]) {
        for (const rule of args) {
            this._validationRules.push(rule)
        }
        
        return this;
    }

    /** Get validation rules */
    getValidationRules() {
        return this._validationRules;
    }

    /** Get component id */
    getId() {
        return this._id as keyof T;
    }

    /** Get field config */
    getConfig() {
        return this._config as IDFormFieldDragAndDropProps
    }
}