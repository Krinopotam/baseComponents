import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {BaseComponentConfig} from './baseComponentConfig';
import {IDFormFieldTreeSelectProps, TreeSelectComponent} from 'baseComponents/dForm/components/treeSelectComponent';
import {ITreeSelectProps} from 'baseComponents/treeSelect/treeSelect';


export class TreeSelectComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = TreeSelectComponent; 
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

    /** Is TreeSelect read only  */
    readOnly(value: ITreeSelectProps['readOnly']) {
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

    /** The TreeSelect callbacks */
    callbacks(value: ITreeSelectProps['callbacks']) {
        this._config.callbacks = value;
        return this;
    }

    /** A mutable object to merge with these controls api */
    apiRef(value: ITreeSelectProps['apiRef']) {
        this._config.apiRef = value;
        return this;
    }

    /** Tree TreeSelect id */
    treeSelectId(value: ITreeSelectProps['treeSelectId']) {
        this._config.treeSelectId = value;
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
    editFormProps(value: ITreeSelectProps['editFormProps']) {
        this._config.editFormProps = value;
        return this;
    }

    /** Confirm message before node delete */
    nodeDeleteMessage(value: ITreeSelectProps['nodeDeleteMessage']) {
        this._config.nodeDeleteMessage = value;
        return this;
    }

    /** Should confirm before delete */
    confirmDelete(value: ITreeSelectProps['confirmDelete']) {
        this._config.confirmDelete = value;
        return this;
    }

    /** Edit buttons*/
    editButtons(value: ITreeSelectProps['editButtons']) {
        this._config.editButtons = value;
        return this;
    }

    /** @deprecated The callback should not be used. Use callbacks.onChange instead  */
    onCustomChange(value: IDFormFieldTreeSelectProps['onCustomChange']) {
        this._config.onCustomChange = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as IDFormFieldTreeSelectProps
    }
}