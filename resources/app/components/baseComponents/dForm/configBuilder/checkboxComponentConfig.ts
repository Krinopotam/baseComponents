import {IDFormFieldCheckBoxProps, CheckboxComponent} from 'baseComponents/dForm/components/checkboxComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class CheckboxComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = CheckboxComponent; 
    }


    /** default value */
    default(value: IDFormFieldCheckBoxProps['default']) {
        this._config.default = value;
        return this;
    }

    /** The indeterminate checked state of checkbox */
    indeterminate(value: IDFormFieldCheckBoxProps['indeterminate']) {
        this._config.indeterminate = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldCheckBoxProps
    }
}