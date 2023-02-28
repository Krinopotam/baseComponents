import {IDFormProps} from 'baseComponents/dForm/dForm';
import {IDFormFieldProps} from '../components/baseComponent';
import {IRuleType} from '../validators/baseValidator';

export interface IConfigGetter{
    getConfig:() => {id: string, fieldProps: object, rules: IRuleType[]};
}

export class DFormConfig  {
    private _config: IDFormProps = {} as IDFormProps;




    /** An mutable object to merge with these controls api */
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
    fieldsProps(value: IDFormProps['fieldsProps']) {
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

    /** Form name */
    name(value: IDFormProps['name']) {
        this._config.name = value;
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
    validationRules(value: IDFormProps['validationRules']) {
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
    addFields(...args: (IConfigGetter | Record<string, IConfigGetter[]>)[]) {
        this.addFieldsConfig(undefined, args);
        return this;
    }

    /** Add tabs */
    addTab(tabName: string, ...args: (IConfigGetter | Record<string, IConfigGetter[]>)[]) {
        this.addFieldsConfig(tabName, args);
        return this;
    }

    /** Add field properties to form config */
    private addFieldsConfig(tabName: string | undefined, fieldClassList: (IConfigGetter | Record<string, IConfigGetter[]>)[]) {
        for (const fieldClass of fieldClassList) {
            if (typeof fieldClass !== 'object') continue;
            if (fieldClass.getConfig) {
                const fieldClass1 = fieldClass as IConfigGetter;
                this.updateFieldsProps(fieldClass1, undefined, tabName);
                continue;
            }

            const fieldsClassesGroup = fieldClass as Record<string, IConfigGetter[]>;
            for (const groupName in fieldsClassesGroup) {
                const groupFieldsClasses = fieldsClassesGroup[groupName];
                if (!Array.isArray(groupFieldsClasses)) continue;

                for (const fieldClass2 of groupFieldsClasses) {
                    if (!fieldClass2.getConfig) continue;
                    this.updateFieldsProps(fieldClass2, groupName, tabName);
                }
            }
        }
        return this;
    }

    /** Update the field properties */
    private updateFieldsProps(fieldClass: IConfigGetter, groupName?: string, tabName?: string) {
        const fieldConfig = fieldClass.getConfig();
        if (!fieldConfig.fieldProps) return;
        if (!this._config.fieldsProps) this._config.fieldsProps = {};
        const formFieldsProps = this._config.fieldsProps;
        const fieldProps = fieldConfig.fieldProps as IDFormFieldProps;
        formFieldsProps[fieldConfig.id] = {...fieldProps};

        if (!this._config.validationRules) this._config.validationRules = {};
        if (fieldConfig.rules && fieldConfig.rules.length > 0) this._config.validationRules[fieldConfig.id] = [...fieldConfig.rules];

        if (typeof groupName !== 'undefined') formFieldsProps[fieldConfig.id].inlineGroup = groupName;
        if (typeof tabName !== 'undefined') formFieldsProps[fieldConfig.id].tab = tabName;
    }

    /** Get form config */
    getConfig() {
        return this._config;
    }
}