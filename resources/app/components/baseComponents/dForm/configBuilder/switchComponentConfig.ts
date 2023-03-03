import {IDFormFieldSwitchProps, SwitchComponent} from 'baseComponents/dForm/components/switchComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class SwitchComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = SwitchComponent; 
    }


    /** Default value */
    default(value: IDFormFieldSwitchProps['default']) {
        this._config.default = value;
        return this;
    }

    /** The content to be shown when the state is checked */
    checkedChildren(value: IDFormFieldSwitchProps['checkedChildren']) {
        this._config.checkedChildren = value;
        return this;
    }

    /** The content to be shown when the state is unchecked */
    unCheckedChildren(value: IDFormFieldSwitchProps['unCheckedChildren']) {
        this._config.unCheckedChildren = value;
        return this;
    }

    /** Loading state of switch */
    loading(value: IDFormFieldSwitchProps['loading']) {
        this._config.loading = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldSwitchProps
    }
}