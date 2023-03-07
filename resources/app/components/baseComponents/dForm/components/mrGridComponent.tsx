/**
 * @CheckboxComponent
 * @version 0.0.28.93
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import MRGrid, {IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {MRT_ColumnDef} from 'material-react-table';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldMrGridProps extends IDFormFieldProps {
    /** Grid columns */
    columns: MRT_ColumnDef[];

    /** Grid data set */
    dataSet?: IGridRowData[];
}

export const MrGridComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldMrGridProps;
    const value = formApi.model.getValue(fieldName) as boolean;

    useEffect(() => {
        formApi.model.setReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return <MRGrid columns={fieldProps.columns} dataSet={fieldProps.dataSet} />;
};
