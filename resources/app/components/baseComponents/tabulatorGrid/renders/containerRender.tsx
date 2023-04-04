import React from 'react';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {LoadingContainer} from 'baseComponents/loadingContainer/loadingContainer';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';
import {usePrepareEditFormProps} from 'baseComponents/tabulatorGrid/hooks/gridEditForm';
import {MenuRow} from 'baseComponents/tabulatorGrid/renders/menuRow';
import {GridRender} from "baseComponents/tabulatorGrid/renders/gridRender";
import {IGridProps} from "baseComponents/tabulatorGrid/tabulatorGrid";

export const ContainerRender = ({tableRef, gridApi, gridProps}: {tableRef: React.MutableRefObject<Tabulator | undefined>; gridApi: IGridApi; gridProps:IGridProps}): JSX.Element => {
    const editFormProps = usePrepareEditFormProps(gridApi);

    // Even though gridProps can be obtained from gridApi, we still separately pass gridProps to GridRender
    // Since GridRender is memoized, this is done so that the GridRender component is updated when gridProps changes
    return (
        <>
            <LoadingContainer isLoading={gridApi.getIsLoading()} notHideContent={true}>
                <MenuRow gridApi={gridApi} />
                <GridRender tableRef={tableRef} gridApi={gridApi} gridProps={gridProps} />
            </LoadingContainer>
            {editFormProps ? <DFormModal {...editFormProps} apiRef={gridApi.editFormApi} /> : null}
        </>
    );
};
