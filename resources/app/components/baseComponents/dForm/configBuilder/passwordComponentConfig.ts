import {IDFormFieldPasswordProps, PasswordComponent} from 'baseComponents/dForm/components/passwordComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class PasswordComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = PasswordComponent; 
    }


    /** Default value */
    default(value: IDFormFieldPasswordProps['default']) {
        this._config.default = value;
        return this;
    }

    /** Show input counter */
    showCount(value: IDFormFieldPasswordProps['showCount']) {
        this._config.showCount = value;
        return this;
    }

    /** Max input length */
    maxLength(value: IDFormFieldPasswordProps['maxLength']) {
        this._config.maxLength = value;
        return this;
    }

    /** Icons render */
    iconRender(value: IDFormFieldPasswordProps['iconRender']) {
        this._config.iconRender = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldPasswordProps
    }
}