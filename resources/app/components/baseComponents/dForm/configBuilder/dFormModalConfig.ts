import {IDFormProps} from 'baseComponents/dForm/dForm';
import {BaseComponentConfig} from './baseComponentConfig';
import {IDFormFieldProps} from '../components/baseComponent';
import {IRuleType} from '../validators/baseValidator';
import {DFormConfig} from './dFormConfig';
import {IDModalProps, IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';


export class DFormModalConfig<T>  extends DFormConfig<T> {

    constructor(formId: string) {
        super (formId); 
    }


    /** A mutable object to merge with these controls api */
    apiRef(value: IDFormProps['apiRef']) {
        this._config.apiRef = value;
        return this;
    }

    /** Buttons properties */
    buttons(value: IDFormProps['buttons']) {
        this._config.buttons = value;
        return this;
    }

    /** Modal controls callbacks */
    callbacks(value: IDModalProps['callbacks']) {
        this._config.callbacks = value;
        return this;
    }

    /** Form CSS class */
    className(value: IDFormProps['className']) {
        this._config.className = value;
        return this;
    }

    /** Form container class name */
    containerClassName(value: IDFormProps['containerClassName']) {
        this._config.containerClassName = value;
        return this;
    }

    /** Indent from the beginning of the controls (default 12)  */
    contentIndent(value: IDFormProps['contentIndent']) {
        this._config.contentIndent = value;
        return this;
    }

    /** Form data */
    dataSet(value: IDFormProps['dataSet']) {
        this._config.dataSet = value;
        return this;
    }

    /** Parent form data */
    parentDataSet(value: IDFormProps['parentDataSet']) {
        this._config.parentDataSet = value;
        return this;
    }

    /** Fields properties */
    fieldsProps(value: Record<keyof T, IDFormFieldProps>) {
        this._config.fieldsProps = value;
        return this;
    }

    /** Form type */
    formType(value: IDFormProps['formType']) {
        this._config.formType = value;
        return this;
    }

    /** label column parameters, for example span:'8' */
    labelCol(value: IDFormProps['labelCol']) {
        this._config.labelCol = value;
        return this;
    }

    /** Form layout (horizontal or vertical). Vertical is default */
    layout(value: IDFormProps['layout']) {
        this._config.layout = value;
        return this;
    }

    /** Form mode */
    formMode(value: IDFormProps['formMode']) {
        this._config.formMode = value;
        return this;
    }

    /** The form is read only */
    readOnly(value: IDFormProps['readOnly']) {
        this._config.readOnly = value;
        return this;
    }

    /** Disable automatic hiding the fields if they depend on the fields for which the values are not set */
    noAutoHideDependedFields(value: IDFormProps['noAutoHideDependedFields']) {
        this._config.noAutoHideDependedFields = value;
        return this;
    }

    /** Tabs properties */
    tabsProps(value: IDFormProps['tabsProps']) {
        this._config.tabsProps = value;
        return this;
    }

    /** No use controls data */
    unfilledForm(value: IDFormProps['unfilledForm']) {
        this._config.unfilledForm = value;
        return this;
    }

    /** Validation rules */
    validationRules(value: Record<keyof T, IRuleType[]>) {
        this._config.validationRules = value;
        return this;
    }

    /** wrapper column parameters, for example span:'16' */
    wrapperCol(value: IDFormProps['wrapperCol']) {
        this._config.wrapperCol = value;
        return this;
    }

    /** Should the form request confirmation before the form submitting or cancel, if the form data was changed by the user  */
    confirmChanges(value: IDFormProps['confirmChanges']) {
        this._config.confirmChanges = value;
        return this;
    }

    /** Confirm message before the form submitting */
    submitConfirmMessage(value: IDFormProps['submitConfirmMessage']) {
        this._config.submitConfirmMessage = value;
        return this;
    }

    /** Confirm message before the form closing, if form is dirty */
    closeFormConfirmMessage(value: IDModalProps['closeFormConfirmMessage']) {
        this._config.closeFormConfirmMessage = value;
        return this;
    }

    /** Modal controls title */
    title(value: IDModalProps['title']) {
        this._config.title = value;
        return this;
    }

    /**Modal window width */
    width(value: IDModalProps['width']) {
        this._config.width = value;
        return this;
    }

    /**Modal window min width */
    minWidth(value: IDModalProps['minWidth']) {
        this._config.minWidth = value;
        return this;
    }

    /**Modal window max width */
    maxWidth(value: IDModalProps['maxWidth']) {
        this._config.maxWidth = value;
        return this;
    }

    /** Content body height*/
    bodyHeight(value: IDModalProps['bodyHeight']) {
        this._config.bodyHeight = value;
        return this;
    }

    /** Content body min height*/
    bodyMinHeight(value: IDModalProps['bodyMinHeight']) {
        this._config.bodyMinHeight = value;
        return this;
    }

    /** Content body max height*/
    bodyMaxHeight(value: IDModalProps['bodyMaxHeight']) {
        this._config.bodyMaxHeight = value;
        return this;
    }

    /** Content body CSS style (will be overwritten by bodyHeight, bodyMinHeight, bodyMaxHeight if set)*/
    bodyStyle(value: IDModalProps['bodyStyle']) {
        this._config.bodyStyle = value;
        return this;
    }

    /** Content body wil not be scrollable */
    notScrollable(value: IDModalProps['notScrollable']) {
        this._config.notScrollable = value;
        return this;
    }

    /** Is modal can be resizable */
    resizable(value: IDModalProps['resizable']) {
        this._config.resizable = value;
        return this;
    }

    /** Is controls visible (for open for without api) */
    isOpened(value: IDModalProps['isOpened']) {
        this._config.isOpened = value;
        return this;
    }


    /** Get form config */
    getConfig() {
        return this._config as unknown as IDFormModalProps 
    }

    /** Add tabs */
    addTab(tabName: string, ...args: BaseComponentConfig<T>[]) {
        this.addFieldsConfig(tabName, args);
        return this;
    }

    /** Add fields or fields inline groups */
    addFields(...args: BaseComponentConfig<T>[]) {
        this.addFieldsConfig(undefined, args);
        return this;
    }
}