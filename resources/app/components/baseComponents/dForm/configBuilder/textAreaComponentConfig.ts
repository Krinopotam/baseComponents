import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IRuleType} from '../validators/baseValidator';
import {IDFormFieldTextAreaProps, TextAreaComponent} from 'baseComponents/dForm/components/textAreaComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class TextAreaComponentConfig<T>  extends BaseComponentConfig<T> {
    protected _config: Record<string, unknown> = {};
    protected readonly _id: keyof T;
    protected _validationRules: IRuleType[] = [];

    constructor(id: keyof T) {
        super(id);
        this._id = id;
        this._config.component = TextAreaComponent; 
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

    /** Default value */
    default(value: IDFormFieldTextAreaProps['default']) {
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

    /** Height auto size feature, can be set to true | false or an object ( minRows: 2, maxRows: 6 ) */
    autoSize(value: IDFormFieldTextAreaProps['autoSize']) {
        this._config.autoSize = value;
        return this;
    }

    /** Specifies the visible width of a text area */
    cols(value: IDFormFieldTextAreaProps['cols']) {
        this._config.cols = value;
        return this;
    }

    /** Specifies the visible number of lines in a text area */
    rows(value: IDFormFieldTextAreaProps['rows']) {
        this._config.rows = value;
        return this;
    }

    /** Text wrap parameters. Specifies how the text in a text area is to be wrapped when submitted in a form */
    wrap(value: IDFormFieldTextAreaProps['wrap']) {
        this._config.wrap = value;
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
        return this._config as IDFormFieldTextAreaProps
    }
}