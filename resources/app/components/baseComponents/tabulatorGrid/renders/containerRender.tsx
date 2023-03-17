import React from 'react';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {LoadingContainer} from 'baseComponents/loadingContainer/loadingContainer';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';
import {usePrepareEditFormProps} from 'baseComponents/tabulatorGrid/hooks/gridEditForm';
import {MenuRow} from 'baseComponents/tabulatorGrid/renders/menuRow';
import {GridRender} from "baseComponents/tabulatorGrid/renders/gridRender";

export const ContainerRender = ({tableRef, gridApi}: {tableRef: React.MutableRefObject<Tabulator | null>; gridApi: IGridApi}): JSX.Element => {
    const editFormProps = usePrepareEditFormProps(gridApi);

    return (
        <>
            <LoadingContainer isLoading={gridApi.getIsLoading()} notHideContent={true}>
                <MenuRow gridApi={gridApi} />
                <GridRender tableRef={tableRef} gridApi={gridApi} />
            </LoadingContainer>
            {editFormProps ? <DFormModal {...editFormProps} apiRef={gridApi.editFormApi} /> : null}
        </>
    );
};
