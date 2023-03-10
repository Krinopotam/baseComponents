import {MutableRefObject, useLayoutEffect} from 'react';
import {MRT_TableInstance} from 'material-react-table';
import {IGridApi} from './api';

export const useKeyboardSelection = (tableRef: MutableRefObject<MRT_TableInstance | null>, gridApi: IGridApi) => {
    useLayoutEffect(() => {
        if (!tableRef) return;
        const tableContainerRef = tableRef.current?.refs.tableContainerRef;
        if (!tableContainerRef) return;
        tableContainerRef.current.tabIndex = 0;
        tableContainerRef.current.style.outline = 'none';

        tableContainerRef.current.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 40: // down arrow
                    onKeyDownDown(e, gridApi);
                    break;
                case 38: // up arrow
                    onKeyDownUp(e, gridApi);
                    break;
            }
        });
    }, [tableRef, gridApi]);
};

const onKeyDownUp = (e: KeyboardEvent, gridApi: IGridApi) => {
    e.preventDefault();
    const prevId = gridApi.getPrevRowKey(gridApi.getActiveRowKey());
    gridApi.setActiveRowKey(prevId || null, true, true, 'top');
};

const onKeyDownDown = (e: KeyboardEvent, gridApi: IGridApi) => {
    e.preventDefault();
    const nextId = gridApi.getNextRowKey(gridApi.getActiveRowKey());
    gridApi.setActiveRowKey(nextId || null, true, true, 'bottom');
};
