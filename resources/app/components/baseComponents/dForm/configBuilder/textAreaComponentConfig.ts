import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IDFormFieldTextAreaProps, TextAreaComponent} from 'baseComponents/dForm/components/textAreaComponent';
import {IConfigGetter} from './dFormConfig';
import {IRuleType} from '../validators/baseValidator';


export class TextAreaComponentConfig  implements IConfigGetter {
    private _config: IDFormFieldTextAreaProps = {} as IDFormFieldTextAreaProps;
    private readonly _id: string;
    private _validationRules: IRuleType[] = [];

    constructor(id: string) {
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


    /** Get component config */
    getConfig() {
        return {id: this._id, fieldProps: this._config, rules: this._validationRules};
    }

    /** Add validation rules */
    validationRules(...args: IRuleType[]) {
        for (const rule of args) {
            this._validationRules.push(rule)
        }
        
        return this;
    }
}