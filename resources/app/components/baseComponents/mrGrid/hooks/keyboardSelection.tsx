import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {MRT_TableInstance} from 'material-react-table';
import {findIndexInObjectsArray} from 'helpers/helpersObjects';
import { IGridApi } from './api';
import {IGridRowData} from "baseComponents/mrGrid/mrGrid";

export const useKeyboardSelection = <TData extends IGridRowData>(tableRef: MutableRefObject<MRT_TableInstance | null>, gridApi: IGridApi<TData>) => {
    useEffect(() => {
        if (!tableRef) return;
        const tableContainerRef = tableRef.current?.refs.tableContainerRef;
        if (!tableContainerRef) return;
        tableContainerRef.current.tabIndex = 0;
        tableContainerRef.current.style.outline = 'none';

        tableContainerRef.current.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 37: // left arrow
                    onKeyDownLeft(e, tableRef, gridApi);
                    break;
                case 39: // right arrow
                    onKeyDownRight(e, tableRef, gridApi);
                    break;
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

const onKeyDownLeft = <TData extends IGridRowData>(
    e: KeyboardEvent,
    tableRef: MutableRefObject<MRT_TableInstance | null>,
    gridApi: IGridApi<TData>
) => {
    alert('left');
};

const onKeyDownRight = <TData extends IGridRowData>(
    e: KeyboardEvent,
    tableRef: MutableRefObject<MRT_TableInstance | null>,
    gridApi: IGridApi<TData>
) => {
    alert('right');
};

const onKeyDownUp = <TData extends IGridRowData>(
    e: KeyboardEvent,
    gridApi: IGridApi<TData>
) => {
    e.preventDefault();
    const prevId = gridApi.getPrevRowKey(gridApi.getActiveRowKey());
    gridApi.setActiveRowKey(prevId || null, true, true);
};

const onKeyDownDown = <TData extends IGridRowData>(
    e: KeyboardEvent,
    gridApi: IGridApi<TData>
) => {
    e.preventDefault();
    const nextId = gridApi.getNextRowKey(gridApi.getActiveRowKey());
    gridApi.setActiveRowKey(nextId || null, true, true);
};

