import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IDFormTextEditorProps, TextEditorComponent} from 'baseComponents/dForm/components/textEditorComponent';
import {IConfigGetter} from './dFormConfig';
import {IRuleType} from '../validators/baseValidator';


export class TextEditorComponentConfig  implements IConfigGetter {
    private _config: IDFormTextEditorProps = {} as IDFormTextEditorProps;
    private readonly _id: string;
    private _validationRules: IRuleType[] = [];

    constructor(id: string) {
        this._id = id;
        this._config.component = TextEditorComponent; 
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
    default(value: IDFormTextEditorProps['default']) {
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

    /** Allowed formats. This is separate from adding a control in the Toolbar. For example, you can configure Quill to allow bolded content to be pasted into an editor that has no bold button in the toolbar */
    formats(value: IDFormTextEditorProps['formats']) {
        this._config.formats = value;
        return this;
    }

    /** Toolbars buttons config */ //TODO add type
    toolbar(value: IDFormTextEditorProps['toolbar']) {
        this._config.toolbar = value;
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