import React, {useRef, useState} from 'react';
import MaterialReactTable, {MRT_ColumnDef, MRT_TableInstance} from 'material-react-table';
import {useKeyboardSelection} from 'baseComponents/mrGrid/hooks/keyboardSelection';
import {IButtonsRowApi, IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {useInitGridApi} from 'baseComponents/mrGrid/hooks/api';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';

export interface IGridRowData extends Record<string, unknown> {
    /** Row id */
    id: string;
    children?: IGridRowData[];
}

export interface IGridProps {
    /** Grid Id */
    id?: string;

    /** Grid columns */
    columns: MRT_ColumnDef[];
    //columns: CoreOptions<TData>['columns'];

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

    /** Should confirm before delete */
    confirmDelete?: boolean;
}

export interface IGridCallbacks {
    /** Fires when menu visibility status changed */
    onMenuVisibilityChanged: (isVisible: boolean) => void;

    /** Fires, when dataSet changes */
    onDataSetChange?: (dataSet: IGridRowData[]) => void;

    /** Callback executed when selected rows change */
    onSelectionChange?: (selectedRowKeys: (string | number)[], selectedRows: IGridRowData[]) => void;

    /** Callback executed when selected rows change */
    onDelete?: (selectedRows: IGridRowData[]) => void;
}

//nested data is ok, see accessorKeys in ColumnDef below

const MRGrid = (props: IGridProps) => {
    const tableRef = useRef<MRT_TableInstance>(null);
    const [editFormApi] = useState<IDFormModalApi>({} as IDFormModalApi);
    const [buttonsApi] = useState({} as IButtonsRowApi);
    const gridApi = useInitGridApi({props, tableRef, editFormApi, buttonsApi});
    //const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    useKeyboardSelection(tableRef, gridApi);

    return (
        <MaterialReactTable
            tableInstanceRef={tableRef}
            columns={props.columns}
            data={props.dataSet || []}
            enablePagination={false}
            enableColumnResizing={true}
            enableStickyHeader={true}
            enableRowSelection={false}
            enableExpanding
            getSubRows={(originalRow: IGridRowData) => originalRow.children} //TODO: fix type issue
            getRowId={(originalRow: IGridRowData) => originalRow.id} //TODO: fix type issue
            //onRowSelectionChange={setRowSelection}
            muiTableContainerProps={{className: 'grid-container-' + gridApi.getGridId(), sx: {maxHeight: '300px'}}}
            muiTableHeadProps={{className: 'grid-head-' + gridApi.getGridId()}}
            muiTableBodyRowProps={({row, ...other}) => ({
                //implement row selection click events manually
                onClick: () => {
                    gridApi.setActiveRowKey(row.id, true, true);
                    console.log(other, row);
                },
                'data-row-key': row.id,
                sx: {
                    cursor: 'pointer',
                },
            })}
        />
    );
};

export default MRGrid;
