/**
 * @DateTimeComponent
 * @version 0.0.35.17
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {CSSProperties, useCallback, useEffect} from 'react';
import dayjs, {Dayjs} from 'dayjs';

import {DatePicker, IDatePickerProps} from 'baseComponents/datePicker';
import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';

//import {DatePicker} from 'Components/datePicker';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldDateTimeProps extends IDFormFieldProps {
    /** Whether to show clear button */
    allowClear?: boolean;

    /** The custom clear icon */
    clearIcon?: React.ReactNode;

    /** Custom rendering function for date cells */
    dateRender?: (currentDate: Dayjs, today: Dayjs) => React.ReactNode;

    /** Default value. If start time or end time is null or undefined, the date range will be an open interval */
    default?: string | Dayjs;

    /** To set default picker date */
    defaultPickerValue?: Dayjs;

    /** Specify the date that cannot be selected */
    disabledDate?: (currentDate: Dayjs) => boolean;

    /** To specify the time that cannot be selected */
    disabledTime?: IDatePickerProps['disabledTime'];

    /** To set the date format, refer to dayjs. Default DD.MM.YYYY HH:mm:ss */
    format?: string;

    /** The picker panel mode */
    mode?: 'time' | 'date' | 'month' | 'year' | 'decade';

    /** To customize the className of the popup calendar */
    popupClassName: string;

    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly?: boolean;

    /** The custom next icon */
    nextIcon?: React.ReactNode;

    /** Customize panel render */
    panelRender?: (originPanel: React.ReactNode) => React.ReactNode;

    /** Set picker type (default date) */
    picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';

    /** The position where the selection box pops up (default bottomLeft) */
    placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

    /** To customize the style of the popup calendar */
    popupStyle?: CSSProperties;

    /** The preset ranges for quick selection */
    presets?:IDatePickerProps['presets']

    /** The custom prev icon */
    prevIcon?: React.ReactNode;

    /** Render extra footer in panel */
    renderExtraFooter?: (mode: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | 'decade') => React.ReactNode;

    /** Whether to show 'Now' button on panel when showTime is set */
    showNow?: boolean;

    /** To provide an additional time selection	object */
    showTime?: boolean;

    /** Whether to show Today button (default true) */
    showToday?: boolean;

    /** The custom suffix icon */
    //suffixIcon?: React.ReactNode;

    /** The custom super next icon */
    superNextIcon?: React.ReactNode;

    /** The custom super prev icon */
    superPrevIcon?: React.ReactNode;

    /** Callback function, can be executed whether the popup calendar is popped up or closed */
    onOpenChange?: (open: boolean) => void;

    /** Callback when click ok button */
    onOk?: (date: Dayjs) => void;
}

export const DateTimeComponent = ({formApi, fieldName}: IDFormComponentProps): JSX.Element => {
    const formProps = formApi.getFormProps();
    const {format, default: defaultFieldValue, ...fieldPros} = formProps.fieldsProps[fieldName] as IDFormFieldDateTimeProps;

    const defaultDateFormat = 'DD.MM.YYYY';
    const defaultTimeFormat = 'HH:mm:ss';
    const dateTimeFormat = format || defaultDateFormat + (fieldPros.showTime ? ' ' + defaultTimeFormat : '');

    let value = formApi.model.getFieldValue(fieldName) as string | undefined;
    let fieldValue = value ? dayjs(value, dateTimeFormat) : undefined;

    let defaultValue: Dayjs | undefined;
    if (!defaultFieldValue) defaultValue = dayjs(new Date());
    else if (defaultFieldValue && typeof defaultFieldValue === 'string') defaultValue = dayjs(defaultFieldValue, dateTimeFormat);
    else if (dayjs.isDayjs(defaultFieldValue)) defaultValue = defaultFieldValue;

    if (!formApi.model.isFieldTouched(fieldName) && !value && defaultValue) {
        // Workaround: update the field model value to the calculated default value.
        // The form model should be the only data source. It does not keep track of the state of the DatePicker.defaultValue prop
        value = defaultValue?.format(dateTimeFormat);
        formApi.model.setFieldValue(fieldName, value, true);
        fieldValue = defaultValue;
    }

    const onChange = useCallback(
        (e: dayjs.Dayjs | null) => {
            formApi.model.setFieldValue(fieldName, e?.format(dateTimeFormat));
            formApi.model.setFieldDirty(fieldName, true);
        },
        [dateTimeFormat, fieldName, formApi.model]
    );
    const onBlur = useCallback(() => {
        formApi.model.setFieldTouched(fieldName, true);
    }, [fieldName, formApi.model]);

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <DatePicker
            {...fieldPros}
            disabled={formApi.model.isFieldDisabled(fieldName)}
            readOnly={formApi.model.isFieldReadOnly(fieldName)}
            format={dateTimeFormat}
            name={fieldName}
            onBlur={onBlur}
            onChange={onChange}
            value={fieldValue}
            style={{width: '100%'}}
        />
    );
};
