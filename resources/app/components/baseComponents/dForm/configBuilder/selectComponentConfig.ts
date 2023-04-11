import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {IRuleType} from '../validators/baseValidator';
import {IDFormFieldSelectProps, SelectComponent} from 'baseComponents/dForm/components/selectComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class SelectComponentConfig<T>  extends BaseComponentConfig<T> {
    protected _config: Record<string, unknown> = {};
    protected readonly _id: keyof T;
    protected _validationRules: IRuleType[] = [];

    constructor(id: keyof T) {
        super(id);
        this._id = id;
        this._config.component = SelectComponent; 
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

    /** Initial selected option */
    default(value: IDFormFieldSelectProps['default']) {
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

    
    dataSet(value: IDFormFieldSelectProps['dataSet']) {
        this._config.dataSet = value;
        return this;
    }

    /** Show clear button */
    allowClear(value: IDFormFieldSelectProps['allowClear']) {
        this._config.allowClear = value;
        return this;
    }

    /** Whether the current search will be cleared on selecting an item. Only applies when mode is set to multiple or tags (default true) */
    autoClearSearchValue(value: IDFormFieldSelectProps['autoClearSearchValue']) {
        this._config.autoClearSearchValue = value;
        return this;
    }

    /** The custom clear icon */
    clearIcon(value: IDFormFieldSelectProps['clearIcon']) {
        this._config.clearIcon = value;
        return this;
    }

    /** Whether active first option by default */
    defaultActiveFirstOption(value: IDFormFieldSelectProps['defaultActiveFirstOption']) {
        this._config.defaultActiveFirstOption = value;
        return this;
    }

    /** Initial open state of dropdown */
    defaultOpen(value: IDFormFieldSelectProps['defaultOpen']) {
        this._config.defaultOpen = value;
        return this;
    }

    /** The className of dropdown menu */
    popupClassName(value: IDFormFieldSelectProps['popupClassName']) {
        this._config.popupClassName = value;
        return this;
    }

    /** Customize dropdown content */
    dropdownRender(value: IDFormFieldSelectProps['dropdownRender']) {
        this._config.dropdownRender = value;
        return this;
    }

    /** Customize node label, value, options field name */
    fieldNames(value: IDFormFieldSelectProps['fieldNames']) {
        this._config.fieldNames = value;
        return this;
    }

    /** If true, filter options by input, if function, filter options against it. */
    filterOption(value: IDFormFieldSelectProps['filterOption']) {
        this._config.filterOption = value;
        return this;
    }

    /** Sort function for search options sorting, see Array sort compareFunction */
    filterSort(value: IDFormFieldSelectProps['filterSort']) {
        this._config.filterSort = value;
        return this;
    }

    /** Whether to embed label in value, turn the format of value from string to ( value: string, label: ReactNode ) */
    labelInValue(value: IDFormFieldSelectProps['labelInValue']) {
        this._config.labelInValue = value;
        return this;
    }

    /** Config popup height (default 256) */
    listHeight(value: IDFormFieldSelectProps['listHeight']) {
        this._config.listHeight = value;
        return this;
    }

    /** Indicate loading state */
    loading(value: IDFormFieldSelectProps['loading']) {
        this._config.loading = value;
        return this;
    }

    /** Max tag count to show. responsive will cost render performance */
    maxTagCount(value: IDFormFieldSelectProps['maxTagCount']) {
        this._config.maxTagCount = value;
        return this;
    }

    /** Placeholder for not showing tags */
    maxTagPlaceholder(value: IDFormFieldSelectProps['maxTagPlaceholder']) {
        this._config.maxTagPlaceholder = value;
        return this;
    }

    /** Max tag text length to show */
    maxTagTextLength(value: IDFormFieldSelectProps['maxTagTextLength']) {
        this._config.maxTagTextLength = value;
        return this;
    }

    /** The custom menuItemSelected icon with multiple options */
    menuItemSelectedIcon(value: IDFormFieldSelectProps['menuItemSelectedIcon']) {
        this._config.menuItemSelectedIcon = value;
        return this;
    }

    /** Set mode of Select */
    mode(value: IDFormFieldSelectProps['mode']) {
        this._config.mode = value;
        return this;
    }

    /** Specify content to show when no result matches */
    notFoundContent(value: IDFormFieldSelectProps['notFoundContent']) {
        this._config.notFoundContent = value;
        return this;
    }

    /** Which prop value of option will be used for filter if filterOption is true. If options is set, it should be set to label */
    optionFilterProp(value: IDFormFieldSelectProps['optionFilterProp']) {
        this._config.optionFilterProp = value;
        return this;
    }

    /** Which prop value of option will render as content of select. */
    optionLabelProp(value: IDFormFieldSelectProps['optionLabelProp']) {
        this._config.optionLabelProp = value;
        return this;
    }

    /** The position where the selection box pops up */
    placement(value: IDFormFieldSelectProps['placement']) {
        this._config.placement = value;
        return this;
    }

    /** The custom remove icon */
    removeIcon(value: IDFormFieldSelectProps['removeIcon']) {
        this._config.removeIcon = value;
        return this;
    }

    /** Whether to show the drop-down arrow: true(for single select), false(for multiple select) */
    showArrow(value: IDFormFieldSelectProps['showArrow']) {
        this._config.showArrow = value;
        return this;
    }

    /** Whether select is searchable: single: false, multiple: true */
    showSearch(value: IDFormFieldSelectProps['showSearch']) {
        this._config.showSearch = value;
        return this;
    }

    /** The custom suffix icon */
    suffixIcon(value: IDFormFieldSelectProps['suffixIcon']) {
        this._config.suffixIcon = value;
        return this;
    }

    /** Customize tag render, only applies when mode is set to multiple or tags */
    tagRender(value: IDFormFieldSelectProps['tagRender']) {
        this._config.tagRender = value;
        return this;
    }

    /** Separator used to tokenize, only applies when mode="tags" */
    tokenSeparators(value: IDFormFieldSelectProps['tokenSeparators']) {
        this._config.tokenSeparators = value;
        return this;
    }

    /** Disable virtual scroll when set to false */
    virtual(value: IDFormFieldSelectProps['virtual']) {
        this._config.virtual = value;
        return this;
    }


    /** Add validation rules */
    validationRules(...args: IRuleType[]) {
        for (const rule of args) {
            this._validationRules.push(rule)
        }
        
        return this;
    }

    /** Get validation rules */
    getValidationRules() {
        return this._validationRules;
    }

    /** Get component id */
    getId() {
        return this._id as keyof T;
    }

    /** Get field config */
    getConfig() {
        return this._config as IDFormFieldSelectProps
    }
}