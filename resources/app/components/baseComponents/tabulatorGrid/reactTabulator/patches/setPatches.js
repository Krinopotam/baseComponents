import {setScrollToRowPatch} from 'baseComponents/tabulatorGrid/reactTabulator/patches/scrollToRowPositionPatсh';
import {setFindRowPatch} from 'baseComponents/tabulatorGrid/reactTabulator/patches/findRowPatch';

export const setPatches = (tableApi) => {
    setScrollToRowPatch(tableApi);
    setFindRowPatch(tableApi);
};
