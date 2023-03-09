import React from 'react';
import MaterialReactTable, {MRT_TableInstance, MRT_ToggleFiltersButton, MRT_ShowHideColumnsButton} from 'material-react-table';
import {IGridApi} from 'baseComponents/mrGrid/hooks/api';
import {IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {useKeyboardSelection} from 'baseComponents/mrGrid/hooks/keyboardSelection';
import {MenuRow} from 'baseComponents/mrGrid/renders/menuRow';
import {IFormButtons} from 'baseComponents/buttonsRow';
import {usePrepareEditFormProps} from 'baseComponents/mrGrid/hooks/gridEditForm';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';

export const GridRender = ({
    tableRef,
    gridApi,
}: {
    tableRef: React.MutableRefObject<MRT_TableInstance | null>;
    gridApi: IGridApi;
}): JSX.Element => {
    useKeyboardSelection(tableRef, gridApi);
    const editFormProps = usePrepareEditFormProps(gridApi);

    return (
        <>
            <MaterialReactTable
                tableInstanceRef={tableRef}
                columns={gridApi.gridProps.columns}
                data={gridApi.gridProps.dataSet || []}
                enablePagination={false}
                enableColumnResizing={true}
                enableStickyHeader={true}
                enableRowSelection={false}
                enableBottomToolbar={false}
                enableColumnFilterModes={false}
                enableColumnDragging={false}
                enableColumnOrdering={true}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                enableExpanding={true}
                enableColumnActions={false}
                enableGrouping={false}
                positionToolbarAlertBanner={'none'}
                positionToolbarDropZone={'none'}


                getSubRows={(originalRow) => (originalRow as IGridRowData).children} //TODO: fix type issue
                getRowId={(originalRow) => (originalRow as IGridRowData).id} //TODO: fix type issue
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
                    hover: false, //no hover highlighting
                })}
                renderTopToolbarCustomActions={() => (
                    <MenuRow gridApi={gridApi} />
                )}
            />
            {editFormProps ? <DFormModal {...editFormProps} apiRef={gridApi.editFormApi} /> : null}
        </>
    );
};
