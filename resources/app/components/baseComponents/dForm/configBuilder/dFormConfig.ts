import {IDFormProps} from 'baseComponents/dForm/dForm';
import {BaseComponentConfig} from './baseComponentConfig';
import {IDFormFieldProps} from '../components/baseComponent';
import {IRuleType} from '../validators/baseValidator';


export class DFormConfig<T>  {
    protected _config: Record<string, unknown> = {};

    constructor(formId: string) {
        this._config.formId = formId; 
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

    /** Form callbacks */
    callbacks(value: IDFormProps['callbacks']) {
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


    /** Add fields or fields inline groups */
    addFields(...args: BaseComponentConfig<T>[]) {
        this.addFieldsConfig(undefined, args);
        return this;
    }

    /** Add tabs */
    addTab(tabName: string, ...args: BaseComponentConfig<T>[]) {
        this.addFieldsConfig(tabName, args);
        return this;
    }

    /** Add field properties to form config */
    protected addFieldsConfig(tabName: string | undefined, configs: BaseComponentConfig<T>[]) {
        for (const config of configs) {
            this.updateFieldsProps(config, tabName);
        }
        return this;
    }

    /** Update the field properties */
    protected updateFieldsProps(configClass: BaseComponentConfig<T>, tabName?: string) {
        const id  = configClass.getId();
        const fieldProps = configClass.getConfig();
        const validationRules = configClass.getValidationRules();
        
        if (!fieldProps || !id) return;
        if (!this._config.fieldsProps) this._config.fieldsProps = {};
        const formFieldsProps = this._config.fieldsProps as Record<keyof T, IDFormFieldProps>;
        formFieldsProps[id] = <T>{...fieldProps};

        if (!this._config.validationRules) this._config.validationRules = {};
        const formValidationRules = this._config.validationRules as Record<keyof T, IRuleType[]>;
        if (validationRules && validationRules.length > 0) formValidationRules[id] = <T>[...validationRules];

        if (typeof tabName !== 'undefined') formFieldsProps[id].tab = tabName;
    }

    /** Get form config */
    getConfig() {
        return this._config as unknown as IDFormProps
    }
}