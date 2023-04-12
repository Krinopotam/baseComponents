import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {BaseComponentConfig} from './baseComponentConfig';
import {IDFormFieldSwitchProps, SwitchComponent} from 'baseComponents/dForm/components/switchComponent';


export class SwitchComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = SwitchComponent; 
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
    default(value: IDFormFieldSwitchProps['default']) {
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
        return this._config as IDFormFieldSwitchProps
    }
}