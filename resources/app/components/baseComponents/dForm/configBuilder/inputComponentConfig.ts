import {IDFormFieldInputProps, InputComponent} from 'baseComponents/dForm/components/inputComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class InputComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = InputComponent; 
    }


    /** Default value */
    default(value: IDFormFieldInputProps['default']) {
        this._config.default = value;
        return this;
    }

    /** Whether show text count */
    showCount(value: IDFormFieldInputProps['showCount']) {
        this._config.showCount = value;
        return this;
    }

    /** The max length */
    maxLength(value: IDFormFieldInputProps['maxLength']) {
        this._config.maxLength = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldInputProps
    }
}