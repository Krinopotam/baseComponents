import {IGridApi} from "baseComponents/tabulatorGrid/hooks/api";
import {IReactTabulatorProps} from "baseComponents/tabulatorGrid/reactTabulator/reactTabulator";
import {useMemo} from "react";
import dispatcher from "baseComponents/modal/service/formsDispatcher";

export const useEvents = (gridApi:IGridApi):IReactTabulatorProps['events'] =>{
    return useMemo(()=>{
        return {
            /*
                tableBuilt: () => {
                    tableBuilt = true;
                },*/
            keyDown: (e: KeyboardEvent) => {
                if (!dispatcher?.isActive(gridApi.getGridId())) return;

                if (!e.ctrlKey && !e.shiftKey && e.key === 'Insert') {
                    gridApi.buttonsApi?.triggerClick('create');
                    e.stopPropagation();
                } else if (!e.ctrlKey && !e.shiftKey && e.key === 'F9') {
                    gridApi.buttonsApi?.triggerClick('clone');
                    e.stopPropagation();
                } else if (!e.ctrlKey && !e.shiftKey && (e.key === 'F2' || e.key === 'Enter')) {
                    gridApi.buttonsApi?.triggerClick('update');
                    e.stopPropagation();
                } else if (!e.ctrlKey && !e.shiftKey && e.key === 'Delete') {
                    gridApi.buttonsApi?.triggerClick('delete');
                    e.stopPropagation();
                }
            },
            rowDblClick: () => {
                gridApi.buttonsApi.triggerClick('update');
            },
            activeRowChanged: () => {
                gridApi.buttonsApi.refreshButtons();
            },
        }
    },[gridApi])
}