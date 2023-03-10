import React, {useRef, useState} from 'react';
import {MRT_ColumnDef, MRT_TableInstance} from 'material-react-table';
import {IButtonsRowApi, IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {useInitGridApi} from 'baseComponents/mrGrid/hooks/api';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {GridRender} from 'baseComponents/mrGrid/renders/gridRender';
import {useWhyDidYouUpdate} from 'ahooks';

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

    /** Tree view mode */
    treeMode?: boolean;

    /** Should confirm before delete */
    confirmDelete?: boolean;
}

export interface IGridCallbacks {
    /** Fires when menu visibility status changed */
    onMenuVisibilityChanged: (isVisible: boolean) => void;

    /** Fires, when the dataSet changed. User can modify the dataSet before dataSet will apply */
    onDataSetChange?: (dataSet: IGridRowData[]) => IGridRowData[] | void;

    /** Callback executed when selected rows change */
    onSelectionChange?: (selectedRowKeys: (string | number)[], selectedRows: IGridRowData[]) => void;

    /** Callback executed when selected rows change */
    onDelete?: (selectedRows: IGridRowData[]) => void;
}

//nested data is ok, see accessorKeys in ColumnDef below

const MRGrid = (props: IGridProps): JSX.Element => {
    useWhyDidYouUpdate('MRGrid', props);
    const tableRef = useRef<MRT_TableInstance>(null);
    const [editFormApi] = useState<IDFormModalApi>({} as IDFormModalApi);
    const [buttonsApi] = useState({} as IButtonsRowApi);
    const gridApi = useInitGridApi({props, tableRef, editFormApi, buttonsApi});

    return <GridRender tableRef={tableRef} gridApi={gridApi} />;
};

export default MRGrid;
