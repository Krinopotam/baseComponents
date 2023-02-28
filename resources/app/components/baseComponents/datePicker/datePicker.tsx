/**
 * @CustomDatePicker
 * @version 0.0.0.5
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {DatePicker as AntDatePicker} from 'antd';
import 'antd/es/date-picker/style/index';
import {Dayjs} from 'dayjs';
import {DisabledTime} from 'rc-picker/lib/interface';
import {SharedTimeProps} from 'rc-picker/lib/panels/TimePanel/index';
import React from 'react';

export type IDatePickerProps = Omit<React.ComponentProps<typeof AntDatePicker>, 'hashId'> & {
    readOnly?: boolean;
    showTime?: boolean | SharedTimeProps<Dayjs>;
    disabledTime?: DisabledTime<Dayjs>;
    showNow?: boolean;
};

const DatePicker = ({readOnly, allowClear, open, inputReadOnly, panelRender, showTime, format, ...props}: IDatePickerProps): JSX.Element => {
    const defaultDateFormat = 'DD.MM.YYYY';
    const defaultTimeFormat = 'HH:mm:ss';
    const dateTimeFormat = format || defaultDateFormat + (showTime ? ' ' + defaultTimeFormat : '');

    let showTimeFormat = showTime;
    if (showTimeFormat === true) showTimeFormat = {format: dateTimeFormat} as SharedTimeProps<Dayjs>;

    return (
        <AntDatePicker
            {...props}
            allowClear={readOnly ? false : allowClear}
            open={readOnly ? false : open}
            inputReadOnly={readOnly ? true : inputReadOnly}
            panelRender={readOnly ? () => null : panelRender}
            showTime={showTimeFormat}
            format={dateTimeFormat}
        />
        //<AntDatePicker {...props} />
    );
};
export default DatePicker;
