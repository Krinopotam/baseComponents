import React from 'react';
import MaterialReactTable, {MRT_TableInstance} from 'material-react-table';
import {IGridApi} from 'baseComponents/mrGrid/hooks/api';
import {IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {useKeyboardSelection} from 'baseComponents/mrGrid/hooks/keyboardSelection';
import {MenuRow} from 'baseComponents/mrGrid/renders/menuRow';
import {usePrepareEditFormProps} from 'baseComponents/mrGrid/hooks/gridEditForm';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {MrGridLocalizationRu} from "baseComponents/mrGrid/localization/ru";
import {LoadingContainer} from "baseComponents/loadingContainer/loadingContainer";

export const GridRender = ({tableRef, gridApi}: {tableRef: React.MutableRefObject<MRT_TableInstance | null>; gridApi: IGridApi}): JSX.Element => {
    const gridProps = gridApi.gridProps;
    useKeyboardSelection(tableRef, gridApi);
    const editFormProps = usePrepareEditFormProps(gridApi);

    return (
        <>
            <LoadingContainer
                isLoading={gridApi.getIsLoading()}
                notHideContent={true}
            >
            <MaterialReactTable
                tableInstanceRef={tableRef}
                columns={gridApi.gridProps.columns}
                data={gridApi.getDataSet()}
                enablePagination={false}
                enableColumnResizing={true}
                enableStickyHeader={true}
                enableRowSelection={false}
                enableBottomToolbar={false}
                enableColumnDragging={false}
                enableColumnOrdering={true}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                enableExpanding={gridProps.treeMode}
                enableColumnActions={false}
                enableGrouping={false}
                enableColumnFilterModes={true}
                filterFromLeafRows={true}
                //maxLeafRowFilterDepth={0}
                positionToolbarAlertBanner={'none'}
                positionToolbarDropZone={'none'}
                getSubRows={(originalRow) => (originalRow as IGridRowData).children}
                getRowId={(originalRow) => (originalRow as IGridRowData).id}
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
                renderTopToolbarCustomActions={() => <MenuRow gridApi={gridApi} />}
                localization={MrGridLocalizationRu}
            />
            </LoadingContainer>
            {editFormProps ? <DFormModal {...editFormProps} apiRef={gridApi.editFormApi} /> : null}
        </>
    );
};
