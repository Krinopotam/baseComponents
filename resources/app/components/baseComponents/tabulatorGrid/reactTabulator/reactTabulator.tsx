import {TabulatorFull as Tabulator, Options, EventCallBackMethods, RowComponent} from 'tabulator-tables';
import React from 'react';
import {getUuid} from 'helpers/helpersString';
import {useInit} from 'baseComponents/tabulatorGrid/reactTabulator/hooks/init';
import {
    IActiveSelectionModuleRow,
    IActiveSelectionModuleTable, IActiveSelectionModuleTableEvents,
    IActiveSelectionModuleTableOptions
} from 'baseComponents/tabulatorGrid/reactTabulator/modules/activeSelectionModule';

export type ITabulator = Tabulator & IActiveSelectionModuleTable

export type ITabulatorRow = RowComponent & IActiveSelectionModuleRow

export interface IReactTabulatorProps extends IActiveSelectionModuleTableOptions, Omit<Options, 'footerElement'> {
    /** Grid footer element*/
    footerElement?: JSX.Element;

    /** Grid events*/
    events?: Partial<EventCallBackMethods> & IActiveSelectionModuleTableEvents;

    /** Grid container class name*/
    containerClassName?: string;

    /** Grid container width*/
    width?: string | number;

    /** On the tableRef ready callback */
    onTableRef?: (ref: React.MutableRefObject<ITabulator | null>) => void;
}

const ReactTabulator = ({events, onTableRef, containerClassName, width, ...props}: IReactTabulatorProps): JSX.Element => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<Tabulator>(null);
    const [mainId] = React.useState(getUuid());

    useInit({props, events, containerRef, tableRef, onTableRef});

    return <div ref={containerRef} data-instance={mainId} className={containerClassName} style={{width: width}} />;
};

export default ReactTabulator;
