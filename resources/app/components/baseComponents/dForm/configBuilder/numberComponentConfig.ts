import {IDFormFieldNumberProps, NumberComponent} from 'baseComponents/dForm/components/numberComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class NumberComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = NumberComponent; 
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

    /** Default value */
    default(value: IDFormFieldNumberProps['default']) {
        this._config.default = value;
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


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldNumberProps
    }
}