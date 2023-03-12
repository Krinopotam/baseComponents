/**
 * @CheckboxComponent
 * @version 0.0.28.93
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import TabulatorGrid, {IGridRowData} from "baseComponents/tabulatorGrid/tabulatorGrid";
import {IReactTabulatorProps} from "baseComponents/tabulatorGrid/reactTabulator/reactTabulator";

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTabulatorGridProps extends IDFormFieldProps {
    /** Grid columns */
    columns:  IReactTabulatorProps['columns'] ;

    /** Grid data set */
    dataSet?: IGridRowData[];
}

export const TabulatorGridComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTabulatorGridProps;
    //const value = formApi.model.getFieldValue(fieldName) as boolean;

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return <TabulatorGrid columns={fieldProps.columns} dataSet={fieldProps.dataSet} />;
};
