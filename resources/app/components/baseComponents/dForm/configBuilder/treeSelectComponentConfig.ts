import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IDFormFieldTreeSelectProps, TreeSelectComponent} from 'baseComponents/dForm/components/treeSelectComponent';
import {IConfigGetter} from './dFormConfig';
import {IRuleType} from '../validators/baseValidator';
import {ITreeSelectProps} from 'baseComponents/treeSelect/treeSelect';


export class TreeSelectComponentConfig  implements IConfigGetter {
    private _config: IDFormFieldTreeSelectProps = {} as IDFormFieldTreeSelectProps;
    private readonly _id: string;
    private _validationRules: IRuleType[] = [];

    constructor(id: string) {
        this._id = id;
        this._config.component = TreeSelectComponent; 
    }


    /** If field default state is readonly */
    readOnly(value: IDFormFieldProps['readOnly']) {
        this._config.readOnly = value;
        return this;
    }

    /** Value */
    value(value: ITreeSelectProps['value']) {
        this._config.value = value;
        return this;
    }

    /** Value */
    defaultValueCallback(value: ITreeSelectProps['defaultValueCallback']) {
        this._config.defaultValueCallback = value;
        return this;
    }

    /** Allow multiple select values */
    multiple(value: ITreeSelectProps['multiple']) {
        this._config.multiple = value;
        return this;
    }

    /** Show check boxes in multiple mode */
    treeCheckable(value: ITreeSelectProps['treeCheckable']) {
        this._config.treeCheckable = value;
        return this;
    }

    /** Fires when the component is ready for use (when it fully downloaded all the data, if necessary) */
    onReady(value: ITreeSelectProps['onReady']) {
        this._config.onReady = value;
        return this;
    }

    /**  Title renderer */
    titleRender(value: ITreeSelectProps['titleRender']) {
        this._config.titleRender = value;
        return this;
    }

    /**  Label renderer */
    labelRender(value: ITreeSelectProps['labelRender']) {
        this._config.labelRender = value;
        return this;
    }

    /**  Custom filter */
    filterTreeNode(value: ITreeSelectProps['filterTreeNode']) {
        this._config.filterTreeNode = value;
        return this;
    }

    /** Local data set */
    dataSet(value: ITreeSelectProps['dataSet']) {
        this._config.dataSet = value;
        return this;
    }

    /** Parameters for remote data fetching*/
    dataSource(value: ITreeSelectProps['dataSource']) {
        this._config.dataSource = value;
        return this;
    }

    /**Additional data properties for appending to dataSource request data*/
    dataSourceAdditionalData(value: ITreeSelectProps['dataSourceAdditionalData']) {
        this._config.dataSourceAdditionalData = value;
        return this;
    }

    /**  Start etching remote data on load control or on use control (example, open dropdown). Default OnLoad */
    fetchMode(value: ITreeSelectProps['fetchMode']) {
        this._config.fetchMode = value;
        return this;
    }

    /**  Loaded data without parameters (like searchString) will not be cached */
    noCacheFetchedData(value: ITreeSelectProps['noCacheFetchedData']) {
        this._config.noCacheFetchedData = value;
        return this;
    }

    /**  Minimum length of search string before fetch data */
    minSearchLength(value: ITreeSelectProps['minSearchLength']) {
        this._config.minSearchLength = value;
        return this;
    }

    /**  debounce in ms */
    debounce(value: ITreeSelectProps['debounce']) {
        this._config.debounce = value;
        return this;
    }

    /**Selected value label. Will render as content of select. Default: title */
    selectedLabelProp(value: ITreeSelectProps['selectedLabelProp']) {
        this._config.selectedLabelProp = value;
        return this;
    }

    /** Customize node label, value, children field name */
    fieldNames(value: ITreeSelectProps['fieldNames']) {
        this._config.fieldNames = value;
        return this;
    }

    /** Edit item controls props. If not set then component not editable */
    editableFormProps(value: ITreeSelectProps['editableFormProps']) {
        this._config.editableFormProps = value;
        return this;
    }

    /** Main field in data source to fetch data for editable controls */
    editableFormDataSourceFieldId(value: ITreeSelectProps['editableFormDataSourceFieldId']) {
        this._config.editableFormDataSourceFieldId = value;
        return this;
    }

    /** The webServices class instance if we want caching to be at the level of the transmitted instance.Otherwise, a new instance will be created and caching will be at the level of the component */
    webServices(value: ITreeSelectProps['webServices']) {
        this._config.webServices = value;
        return this;
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
    default(value: IDFormFieldTreeSelectProps['default']) {
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

    /** Is user can clear value. Default: true */
    allowClear(value: IDFormFieldTreeSelectProps['allowClear']) {
        this._config.allowClear = value;
        return this;
    }

    
    onCustomChange(value: IDFormFieldTreeSelectProps['onCustomChange']) {
        this._config.onCustomChange = value;
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