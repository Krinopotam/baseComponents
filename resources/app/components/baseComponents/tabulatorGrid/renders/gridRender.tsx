import React from 'react';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {LoadingContainer} from 'baseComponents/loadingContainer/loadingContainer';
import {Stylization} from 'baseComponents/tabulatorGrid/stylization';
import ReactTabulator, {ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {RowComponent, TabulatorFull as Tabulator} from 'tabulator-tables';
import {IGridApi} from 'baseComponents/tabulatorGrid/hooks/api';
import {usePrepareEditFormProps} from 'baseComponents/tabulatorGrid/hooks/gridEditForm';
import {MenuRow} from "baseComponents/tabulatorGrid/renders/menuRow";

export const GridRender = ({tableRef, gridApi}: {tableRef: React.MutableRefObject<Tabulator | null>; gridApi: IGridApi}): JSX.Element => {
    const editFormProps = usePrepareEditFormProps(gridApi);

    return (
        <>
            <LoadingContainer isLoading={gridApi.getIsLoading()} notHideContent={true}>
                <Stylization />
                <MenuRow gridApi={gridApi} />
                <ReactTabulator
                    onTableRef={(tabulatorRef) => {
                        tableRef.current = tabulatorRef.current;
                        gridApi.tableApi = tabulatorRef.current;
                    }}
                    data={gridApi.getDataSet()}
                    columns={gridApi.gridProps.columns}
                    //options={options}
                    layout={'fitColumns'}
                    height={300}
                    selectable={false} //We don't use built selectable mode. We use the custom selection algorithm
                    multiSelect={true}
                    rowFormatter={(row: RowComponent) => {
                        const table = row.getTable() as ITabulator;
                        const data = row.getData(); //get data object for row
                        if (data.id === table.getActiveRowKey()) row.getElement().style.borderColor = '#ff0000'; //apply css change to row element
                        else row.getElement().style.borderColor = '#f5f5f5';
                    }}
                    events={{
                        activeRowChanged :()=>{
                            gridApi.buttonsApi.refreshButtons()
                        }
                    }}
                />
            </LoadingContainer>
            {editFormProps ? <DFormModal {...editFormProps} apiRef={gridApi.editFormApi} /> : null}
        </>
    );
};
