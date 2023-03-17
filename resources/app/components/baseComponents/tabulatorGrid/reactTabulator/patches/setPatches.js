import {scrollToRowPatch} from 'baseComponents/tabulatorGrid/reactTabulator/patches/scrollToRowPositionPatсh';
import {setFindRowPatch} from 'baseComponents/tabulatorGrid/reactTabulator/patches/findRowPatch';

export const setPatches=(tableApi)=>{
    tableApi.rowManager['scrollToRow'] = scrollToRowPatch.bind(tableApi.rowManager);
    setFindRowPatch(tableApi);
}