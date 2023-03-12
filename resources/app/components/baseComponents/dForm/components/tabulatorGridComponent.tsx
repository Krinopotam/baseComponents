/**
 * @CheckboxComponent
 * @version 0.0.28.93
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useEffect} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import TabulatorGrid, {IGridCallbacks, IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTabulatorGridProps extends IDFormFieldProps {
    /** Grid Id */
    id?: string;

    /** Grid columns */
    columns: IReactTabulatorProps['columns'];

    /** Grid data set */
    dataSet?: IGridRowData[];

    /** Grid height */
    bodyHeight?: number | string | 'fill';

    /** Grid class name */
    className?: string;

    /** table style size */
    size?: 'small' | 'middle' | 'large';

    buttons?: Record<'view' | 'create' | 'clone' | 'update' | 'delete', IFormButton | null> | IFormButtons;

    /** Table can't be edited */
    readonly?: boolean;

    /** Edit modal controls parameters */
    editFormProps?: IDFormModalProps;

    /** Rows multiSelect */
    multiSelect?: boolean;

    /** Disable row hover effect */
    noHover?: boolean;

    /** Grid callbacks */
    callbacks?: IGridCallbacks;

    /** Confirm message before rows delete */
    rowDeleteMessage?: React.ReactNode;

    /** Tree view mode */
    treeMode?: boolean;

    /** Should confirm before delete */
    confirmDelete?: boolean;
}

export const TabulatorGridComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTabulatorGridProps;
    //const value = formApi.model.getFieldValue(fieldName) as boolean;

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <TabulatorGrid
            id={fieldProps.id}
            columns={fieldProps.columns}
            dataSet={fieldProps.dataSet}
            bodyHeight={fieldProps.bodyHeight}
            className={fieldProps.className}
            size={fieldProps.size}
            buttons={fieldProps.buttons}
            readonly={fieldProps.readonly}
            editFormProps={fieldProps.editFormProps}
            multiSelect={fieldProps.multiSelect}
            noHover={fieldProps.noHover}
            callbacks={fieldProps.callbacks}
            rowDeleteMessage={fieldProps.rowDeleteMessage}
            treeMode={fieldProps.treeMode}
            confirmDelete={fieldProps.confirmDelete}
        />
    );
};
