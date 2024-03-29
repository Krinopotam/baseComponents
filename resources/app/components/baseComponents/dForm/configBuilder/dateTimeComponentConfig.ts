import {IDFormFieldProps} from 'baseComponents/dForm/components/baseComponent';
import {BaseComponentConfig} from './baseComponentConfig';
import {IDFormFieldDateTimeProps, DateTimeComponent} from 'baseComponents/dForm/components/dateTimeComponent';


export class DateTimeComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = DateTimeComponent; 
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

    /** Default value. If start time or end time is null or undefined, the date range will be an open interval */
    default(value: IDFormFieldDateTimeProps['default']) {
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

    /** Whether to show clear button */
    allowClear(value: IDFormFieldDateTimeProps['allowClear']) {
        this._config.allowClear = value;
        return this;
    }

    /** The custom clear icon */
    clearIcon(value: IDFormFieldDateTimeProps['clearIcon']) {
        this._config.clearIcon = value;
        return this;
    }

    /** Custom rendering function for date cells */
    dateRender(value: IDFormFieldDateTimeProps['dateRender']) {
        this._config.dateRender = value;
        return this;
    }

    /** To set default picker date */
    defaultPickerValue(value: IDFormFieldDateTimeProps['defaultPickerValue']) {
        this._config.defaultPickerValue = value;
        return this;
    }

    /** Specify the date that cannot be selected */
    disabledDate(value: IDFormFieldDateTimeProps['disabledDate']) {
        this._config.disabledDate = value;
        return this;
    }

    /** To specify the time that cannot be selected */
    disabledTime(value: IDFormFieldDateTimeProps['disabledTime']) {
        this._config.disabledTime = value;
        return this;
    }

    /** To set the date format, refer to dayjs. Default DD.MM.YYYY HH:mm:ss */
    format(value: IDFormFieldDateTimeProps['format']) {
        this._config.format = value;
        return this;
    }

    /** The picker panel mode */
    mode(value: IDFormFieldDateTimeProps['mode']) {
        this._config.mode = value;
        return this;
    }

    /** To customize the className of the popup calendar */
    popupClassName(value: IDFormFieldDateTimeProps['popupClassName']) {
        this._config.popupClassName = value;
        return this;
    }

    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly(value: IDFormFieldDateTimeProps['inputReadOnly']) {
        this._config.inputReadOnly = value;
        return this;
    }

    /** The custom next icon */
    nextIcon(value: IDFormFieldDateTimeProps['nextIcon']) {
        this._config.nextIcon = value;
        return this;
    }

    /** Customize panel render */
    panelRender(value: IDFormFieldDateTimeProps['panelRender']) {
        this._config.panelRender = value;
        return this;
    }

    /** Set picker type (default date) */
    picker(value: IDFormFieldDateTimeProps['picker']) {
        this._config.picker = value;
        return this;
    }

    /** The position where the selection box pops up (default bottomLeft) */
    placement(value: IDFormFieldDateTimeProps['placement']) {
        this._config.placement = value;
        return this;
    }

    /** To customize the style of the popup calendar */
    popupStyle(value: IDFormFieldDateTimeProps['popupStyle']) {
        this._config.popupStyle = value;
        return this;
    }

    /** The preset ranges for quick selection */
    presets(value: IDFormFieldDateTimeProps['presets']) {
        this._config.presets = value;
        return this;
    }

    /** The custom prev icon */
    prevIcon(value: IDFormFieldDateTimeProps['prevIcon']) {
        this._config.prevIcon = value;
        return this;
    }

    /** Render extra footer in panel */
    renderExtraFooter(value: IDFormFieldDateTimeProps['renderExtraFooter']) {
        this._config.renderExtraFooter = value;
        return this;
    }

    /** Whether to show 'Now' button on panel when showTime is set */
    showNow(value: IDFormFieldDateTimeProps['showNow']) {
        this._config.showNow = value;
        return this;
    }

    /** To provide an additional time selection	object */
    showTime(value: IDFormFieldDateTimeProps['showTime']) {
        this._config.showTime = value;
        return this;
    }

    /** Whether to show Today button (default true) */
    showToday(value: IDFormFieldDateTimeProps['showToday']) {
        this._config.showToday = value;
        return this;
    }

    /** The custom super next icon */
    superNextIcon(value: IDFormFieldDateTimeProps['superNextIcon']) {
        this._config.superNextIcon = value;
        return this;
    }

    /** The custom super prev icon */
    superPrevIcon(value: IDFormFieldDateTimeProps['superPrevIcon']) {
        this._config.superPrevIcon = value;
        return this;
    }

    /** Callback function, can be executed whether the popup calendar is popped up or closed */
    onOpenChange(value: IDFormFieldDateTimeProps['onOpenChange']) {
        this._config.onOpenChange = value;
        return this;
    }

    /** Callback when click ok button */
    onOk(value: IDFormFieldDateTimeProps['onOk']) {
        this._config.onOk = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as IDFormFieldDateTimeProps
    }
}