import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IDFormFieldGridProps, GridComponent} from 'baseComponents/dForm/components/gridComponent';
import {IConfigGetter} from './dFormConfig';
import {IRuleType} from '../validators/baseValidator';
import {DFormModalConfig} from './dFormModalConfig';


export class GridComponentConfig  implements IConfigGetter {
    private _config: IDFormFieldGridProps = {} as IDFormFieldGridProps;
    private readonly _id: string;
    private _validationRules: IRuleType[] = [];

    constructor(id: string) {
        this._id = id;
        this._config.component = GridComponent; 
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
    default(value: IDFormFieldGridProps['default']) {
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

    /** Columns properties */
    columns(value: IDFormFieldGridProps['columns']) {
        this._config.columns = value;
        return this;
    }

    /** Parameters for remote data fetching*/
    dataSource(value: IDFormFieldGridProps['dataSource']) {
        this._config.dataSource = value;
        return this;
    }

    /** Grid height */
    height(value: IDFormFieldGridProps['height']) {
        this._config.height = value;
        return this;
    }

    /** Hide all edit buttons */
    noButtons(value: IDFormFieldGridProps['noButtons']) {
        this._config.noButtons = value;
        return this;
    }

    /** Should confirm before delete */
    confirmDelete(value: IDFormFieldGridProps['confirmDelete']) {
        this._config.confirmDelete = value;
        return this;
    }


    /** Get component config */
    getConfig() {
        return {id: this._id, fieldProps: this._config, rules: this._validationRules};
    }

    /** Edit controls properties */
    editFormProps(value: IDFormFieldGridProps['editFormProps'] | DFormModalConfig) {
        if (value instanceof  DFormModalConfig) this._config.editFormProps = value.getConfig();
        else this._config.editFormProps = value;
        return this;
    }

    /** Add validation rules */
    validationRules(...args: IRuleType[]) {
        for (const rule of args) {
            this._validationRules.push(rule)
        }
        
        return this;
    }
}