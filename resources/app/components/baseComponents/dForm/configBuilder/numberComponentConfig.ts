import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IRuleType} from '../validators/baseValidator';
import {IDFormFieldNumberProps, NumberComponent} from 'baseComponents/dForm/components/numberComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class NumberComponentConfig<T>  extends BaseComponentConfig<T> {
    protected _config: Record<string, unknown> = {};
    protected readonly _id: keyof T;
    protected _validationRules: IRuleType[] = [];

    constructor(id: keyof T) {
        super(id);
        this._id = id;
        this._config.component = NumberComponent; 
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
    default(value: IDFormFieldNumberProps['default']) {
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

    /** The label text displayed after (on the right side of) the input field */
    addonAfter(value: IDFormFieldNumberProps['addonAfter']) {
        this._config.addonAfter = value;
        return this;
    }

    /** The label text displayed before (on the left side of) the input field */
    addonBefore(value: IDFormFieldNumberProps['addonBefore']) {
        this._config.addonBefore = value;
        return this;
    }

    /** Whether to show +- controls, or set custom arrows icon */
    controls(value: IDFormFieldNumberProps['controls']) {
        this._config.controls = value;
        return this;
    }

    /** Decimal separator. Syntactic sugar of `formatter`. Config decimal separator of display. */
    decimalSeparator(value: IDFormFieldNumberProps['decimalSeparator']) {
        this._config.decimalSeparator = value;
        return this;
    }

    /** Specifies the format of the value presented. Transform `value` to display value show in input */
    formatter(value: IDFormFieldNumberProps['formatter']) {
        this._config.formatter = value;
        return this;
    }

    /** If enable keyboard behavior */
    keyboard(value: IDFormFieldNumberProps['keyboard']) {
        this._config.keyboard = value;
        return this;
    }

    /** Max input length */
    maxLength(value: IDFormFieldNumberProps['maxLength']) {
        this._config.maxLength = value;
        return this;
    }

    /** The max value */
    max(value: IDFormFieldNumberProps['max']) {
        this._config.max = value;
        return this;
    }

    /** The min value */
    min(value: IDFormFieldNumberProps['min']) {
        this._config.min = value;
        return this;
    }

    /** Specifies the value extracted from formatter. Parse display value to validate number */
    parser(value: IDFormFieldNumberProps['parser']) {
        this._config.parser = value;
        return this;
    }

    /** The precision of input value. Will use formatter when config of formatter. Syntactic sugar of `formatter`. Config precision of display. */
    precision(value: IDFormFieldNumberProps['precision']) {
        this._config.precision = value;
        return this;
    }

    /** The prefix icon for the Input */
    prefix(value: IDFormFieldNumberProps['prefix']) {
        this._config.prefix = value;
        return this;
    }

    /** The number to which the current value is increased or decreased. It can be an integer or decimal */
    step(value: IDFormFieldNumberProps['step']) {
        this._config.step = value;
        return this;
    }

    /** Set value as string to support high precision decimals. Will return string value by onChange */
    stringMode(value: IDFormFieldNumberProps['stringMode']) {
        this._config.stringMode = value;
        return this;
    }

    /** Up handler */
    upHandler(value: IDFormFieldNumberProps['upHandler']) {
        this._config.upHandler = value;
        return this;
    }

    /** Down handler */
    downHandler(value: IDFormFieldNumberProps['downHandler']) {
        this._config.downHandler = value;
        return this;
    }

    /** Class name */
    className(value: IDFormFieldNumberProps['className']) {
        this._config.className = value;
        return this;
    }

    /** Prefix class name */
    prefixCls(value: IDFormFieldNumberProps['prefixCls']) {
        this._config.prefixCls = value;
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
        return this._config as IDFormFieldNumberProps
    }
}