/**
 * @CheckboxComponent
 * @version 0.0.29.17
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useEffect, useMemo, useRef, useState} from 'react';

import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import TabulatorGrid, {IGridCallbacks, IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldTabulatorGridProps extends IDFormFieldProps {
    /** Grid Id */
    id?: string;

    /** Grid mode: local or remote*/
    gridMode?: 'local' | 'remote';

    /** Tree view mode */
    dataTree?: boolean;

    /** The tree children field name */
    dataTreeChildField?: string;

    /** The parent key field name */
    dataTreeParentField?: string;

    /** The tree children indentation */
    dataTreeChildIndent?: number;

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
    callbacks?: IDFormFieldProps['callbacks'] & IGridCallbacks;

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

export const TabulatorGridComponent = ({formApi, fieldName}: IDFormComponentProps): JSX.Element => {
    const formProps = formApi.getFormProps();
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldTabulatorGridProps;
    const value = formApi.model.getFieldValue(fieldName) as IGridRowData[];
    const prevDataSetRef = useRef<IGridRowData[]>();
    const prevValueRef = useRef<IGridRowData[]>();

    // Workaround: it is necessary to ensure that,
    // on the one hand, when changing the rows by the grid itself, the memorized dataSet stay the same and the grid is not re-rendered.
    // On the other hand, if the dataSet is modified by the user, the grid must re-render
    // So the grid's memorized dataSet stays the same until it's set outside onDataSetChange
    if (prevValueRef.current !== value) {
        prevDataSetRef.current = value;
        prevValueRef.current = value;
    }
    const curDataSet = prevDataSetRef.current;

    const [gridApi] = useState({} as IGridApi);

    const callbacks = useMemo(() => {
        const _onDataSetChange = fieldProps.callbacks?.onDataSetChange;
        const updatedCallbacks = fieldProps.callbacks || {};
        updatedCallbacks.onDataSetChange = (dataSet: IGridRowData[], gridApi) => {
            prevValueRef.current = dataSet;
            formApi.model.setFieldValue(fieldName, dataSet || undefined);
            formApi.model.setFieldDirty(fieldName, true);
            formApi.model.setFieldTouched(fieldName, true);
            _onDataSetChange?.(dataSet, gridApi);
        };
        return updatedCallbacks;
    }, [fieldName, fieldProps.callbacks, formApi.model]);

    //TODO implement grid ready
    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true);
    }, [fieldName, formApi.model]);

    //TODO update datSet via model.setFieldValue not working now

    const render = useMemo(() => {
        return (
            <TabulatorGrid
                id={fieldProps.id}
                apiRef={gridApi}
                gridMode={fieldProps.gridMode}
                dataTree={fieldProps.dataTree}
                dataTreeChildField={fieldProps.dataTreeChildField}
                dataTreeParentField={fieldProps.dataTreeParentField}
                dataTreeChildIndent={fieldProps.dataTreeChildIndent}
                columns={fieldProps.columns}
                dataSet={curDataSet}
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
    }, [
        callbacks,
        fieldProps.buttons,
        fieldProps.className,
        fieldProps.columnDefaults,
        fieldProps.columns,
        fieldProps.confirmDelete,
        fieldProps.dataTree,
        fieldProps.dataTreeChildField,
        fieldProps.dataTreeChildIndent,
        fieldProps.dataTreeParentField,
        fieldProps.editFormProps,
        fieldProps.frozenRows,
        fieldProps.frozenRowsField,
        fieldProps.gridMode,
        fieldProps.groupBy,
        fieldProps.headerVisible,
        fieldProps.height,
        fieldProps.id,
        fieldProps.initialFilter,
        fieldProps.initialHeaderFilter,
        fieldProps.initialSort,
        fieldProps.layout,
        fieldProps.layoutColumnsOnNewData,
        fieldProps.maxHeight,
        fieldProps.maxWidth,
        fieldProps.minHeight,
        fieldProps.minWidth,
        fieldProps.movableColumns,
        fieldProps.movableRows,
        fieldProps.multiSelect,
        fieldProps.noHover,
        fieldProps.persistence,
        fieldProps.persistenceID,
        fieldProps.persistentFilter,
        fieldProps.persistentLayout,
        fieldProps.persistentSort,
        fieldProps.placeholder,
        fieldProps.readOnly,
        fieldProps.resizableColumnFit,
        fieldProps.resizableRows,
        fieldProps.rowDeleteMessage,
        fieldProps.rowHeight,
        fieldProps.width,
        gridApi,
        curDataSet, // changing the value causes the component to rerender and reset its state
    ]);

    return render;
};
