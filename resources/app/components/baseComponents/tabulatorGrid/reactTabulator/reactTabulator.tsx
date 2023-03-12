import {TabulatorFull as Tabulator, Options, EventCallBackMethods, RowComponent} from 'tabulator-tables';
import React from 'react';
import {useInit} from 'baseComponents/tabulatorGrid/reactTabulator/hooks/init';
import {
    IActiveSelectionModuleRow,
    IActiveSelectionModuleTable,
    IActiveSelectionModuleTableEvents,
    IActiveSelectionModuleTableOptions,
} from 'baseComponents/tabulatorGrid/reactTabulator/modules/activeSelectionModule';
import {getUuid} from 'helpers/helpersString';

export type ITabulator = Tabulator & IActiveSelectionModuleTable;

export type ITabulatorRow = RowComponent & IActiveSelectionModuleRow;

export interface IReactTabulatorProps extends IActiveSelectionModuleTableOptions, Omit<Options, 'footerElement'> {
    /** Grid ID*/
    gridId?: string;

    /** Grid footer element*/
    footerElement?: JSX.Element;

    /** Grid events*/
    events?: Partial<EventCallBackMethods> & IActiveSelectionModuleTableEvents;

    /** Grid container class name*/
    containerClassName?: string;

    /** Grid container width*/
    width?: string | number;

    /** Grid container max width*/
    minWidth?: string | number;

    /** Grid container max width*/
    maxWidth?: string | number;

    /** If set to true, then when you resize a column its neighbouring column has the opposite resize applied to keep to total width of columns the same */
    resizableColumnFit?: boolean;

    /** On the tableRef ready callback */
    onTableRef?: (ref: React.MutableRefObject<ITabulator | null>) => void;
}

const ReactTabulator = ({gridId, events, onTableRef, containerClassName, width, minWidth, maxWidth, ...props}: IReactTabulatorProps): JSX.Element => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<ITabulator>(null);

    const [newId] = React.useState(getUuid());

    useInit({props, events, containerRef, tableRef, onTableRef});

    const containerStyle: React.CSSProperties = {};
    containerStyle.width = width;
    containerStyle.maxWidth = maxWidth;
    containerStyle.minWidth = minWidth;

    return <div ref={containerRef} id={gridId || newId} data-instance={gridId || newId} className={containerClassName} style={containerStyle} />;
};

export default ReactTabulator;
