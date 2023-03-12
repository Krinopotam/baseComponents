/**
 * @CheckboxComponent
 * @version 0.0.28.93
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useEffect, useMemo} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import TabulatorGrid, {IGridCallbacks, IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTabulatorGridProps extends IDFormFieldProps {
    /** Grid Id */
    id?: string;

    /** Grid mode: local or remote*/
    gridMode?: 'local' | 'remote';

    /** Tree view mode */
    treeMode?: boolean;

    /** Grid columns */
    columns: IReactTabulatorProps['columns'];

    /** Grid class name */
    className?: string;

    buttons?: Record<'view' | 'create' | 'clone' | 'update' | 'delete', IFormButton | null> | IFormButtons;

    /** Edit modal controls parameters */
    editFormProps?: IDFormModalProps;

    /** Disable row hover effect */
    noHover?: boolean;

    /** Grid callbacks */
    callbacks?: IGridCallbacks;

    /** Confirm message before rows delete */
    rowDeleteMessage?: React.ReactNode;

    /** Should confirm before delete */
    confirmDelete?: boolean;

    /** No rows placeholder */
    placeholder?: string;

    /** Table layout */
    layout?: IReactTabulatorProps['layout'];

    /** Adjust to the data each time you load it into the table */
    layoutColumnsOnNewData?: IReactTabulatorProps['layoutColumnsOnNewData'];

    /** Grid container width*/
    width?: IReactTabulatorProps['width'];

    /** Grid container max width*/
    maxWidth?: IReactTabulatorProps['maxWidth'];

    /** Grid container min width*/
    minWidth?: IReactTabulatorProps['minWidth'];

    /** Grid height*/
    height?: IReactTabulatorProps['height'];

    /** Min grid height*/
    minHeight?: IReactTabulatorProps['minHeight'];

    /** Max grid height*/
    maxHeight?: IReactTabulatorProps['maxHeight'];

    /** allow multi select */
    multiSelect?: IReactTabulatorProps['multiSelect'];

    /** Resize a column its neighbouring column has the opposite resize applied to keep to total width of columns the same */
    resizableColumnFit?: IReactTabulatorProps['resizableColumnFit'];

    /** Row height */
    rowHeight?: IReactTabulatorProps['rowHeight'];

    /** Is the user can resize rows */
    resizableRows?: IReactTabulatorProps['resizableRows'];

    /** is columns movable */
    movableColumns?: IReactTabulatorProps['movableColumns'];

    /** is rows movable */
    movableRows?: IReactTabulatorProps['movableRows'];

    /** Group rows by field/fields data*/
    groupBy?: IReactTabulatorProps['groupBy'];

    /** Store column state in browser local storage */
    persistence?: IReactTabulatorProps['persistence'];

    /** Local storage key  */
    persistenceID?: IReactTabulatorProps['persistenceID'];

    /** Persistent layout */
    persistentLayout?: IReactTabulatorProps['persistentLayout'];

    /** Persistent Filter */
    persistentFilter?: IReactTabulatorProps['persistentFilter'];

    /** Persistent sort */
    persistentSort?: IReactTabulatorProps['persistentSort'];

    /** Frozen rows*/
    frozenRows?: IReactTabulatorProps['frozenRows'];

    /** Frozen row field name/names (default: id) */
    frozenRowsField?: IReactTabulatorProps['frozenRowsField'];

    /** Initial filter */
    initialFilter?: IReactTabulatorProps['initialFilter'];

    /** Initial sort */
    initialSort?: IReactTabulatorProps['initialSort'];

    /** Initial header filter */
    initialHeaderFilter?: IReactTabulatorProps['initialHeaderFilter'];

    /** Is the header should be visible */
    headerVisible?: IReactTabulatorProps['headerVisible'];

    /** Default column properties */
    columnDefaults?: IReactTabulatorProps['columnDefaults'];
}

export const TabulatorGridComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTabulatorGridProps;
    const value = formApi.model.getFieldValue(fieldName) as IGridRowData[];

    const callbacks = useMemo(() => {
        const oldDataSetChange = fieldProps.callbacks?.onDataSetChange;
        const updatedCallbacks = fieldProps.callbacks || {};
        updatedCallbacks['onDataSetChange'] = (dataSet: IGridRowData[], gridApi) => {
            formApi.model.setFieldValue(fieldName, dataSet || null);
            formApi.model.setFieldDirty(fieldName, true);
            formApi.model.setFieldTouched(fieldName, true);
            oldDataSetChange?.(dataSet, gridApi);
        };
        return updatedCallbacks;
    }, [fieldName, fieldProps.callbacks, formApi.model]);

    //TODO implement grid ready
    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    return (
        <TabulatorGrid
            id={fieldProps.id}
            gridMode={fieldProps.gridMode}
            treeMode={fieldProps.treeMode}
            columns={fieldProps.columns}
            dataSet={value}
            className={fieldProps.className}
            buttons={fieldProps.buttons}
            readOnly={fieldProps.readOnly}
            editFormProps={fieldProps.editFormProps}
            noHover={fieldProps.noHover}
            rowDeleteMessage={fieldProps.rowDeleteMessage}
            confirmDelete={fieldProps.confirmDelete}
            placeholder={fieldProps.placeholder}
            layout={fieldProps.layout}
            layoutColumnsOnNewData={fieldProps.layoutColumnsOnNewData}
            width={fieldProps.width}
            maxWidth={fieldProps.maxWidth}
            minWidth={fieldProps.minWidth}
            height={fieldProps.height}
            minHeight={fieldProps.minHeight}
            maxHeight={fieldProps.maxHeight}
            multiSelect={fieldProps.multiSelect}
            resizableColumnFit={fieldProps.resizableColumnFit}
            rowHeight={fieldProps.rowHeight}
            resizableRows={fieldProps.resizableRows}
            movableColumns={fieldProps.movableColumns}
            movableRows={fieldProps.movableRows}
            groupBy={fieldProps.groupBy}
            persistence={fieldProps.persistence}
            persistenceID={fieldProps.persistenceID}
            persistentLayout={fieldProps.persistentLayout}
            persistentFilter={fieldProps.persistentFilter}
            persistentSort={fieldProps.persistentSort}
            frozenRows={fieldProps.frozenRows}
            frozenRowsField={fieldProps.frozenRowsField}
            initialFilter={fieldProps.initialFilter}
            initialSort={fieldProps.initialSort}
            initialHeaderFilter={fieldProps.initialHeaderFilter}
            headerVisible={fieldProps.headerVisible}
            columnDefaults={fieldProps.columnDefaults}
            callbacks={callbacks}
        />
    );
};
