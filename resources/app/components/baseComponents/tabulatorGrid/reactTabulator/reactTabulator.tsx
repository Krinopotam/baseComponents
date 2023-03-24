import {EventCallBackMethods, RowComponent} from 'tabulator-tables';
import React from 'react';
import {useInit} from 'baseComponents/tabulatorGrid/reactTabulator/hooks/init';
import {
    IActiveSelectionModuleRow,
    IActiveSelectionModuleTableEvents,
    IActiveSelectionTabulator,
} from 'baseComponents/tabulatorGrid/reactTabulator/modules/activeSelectionModule';
import {IAdvancedTreeTabulator} from 'baseComponents/tabulatorGrid/reactTabulator/modules/advancedTreeModule';
import {getUuid} from 'helpers/helpersString';

export type ITabulator = IActiveSelectionTabulator & IAdvancedTreeTabulator;

export type ITabulatorRow = RowComponent & IActiveSelectionModuleRow;

export interface IReactTabulatorProps extends Omit<ITabulator['options'], 'footerElement'> {
    /** On the tableRef ready callback */
    onTableRef?: (ref: React.MutableRefObject<ITabulator | null>) => void;

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

    //--- The tabulator types correction (The Tabulator has property but has no type for it) ---
    /** If set to true, then when you resize a column its neighbouring column has the opposite resize applied to keep to total width of columns the same */
    resizableColumnFit?: boolean;
}

const ReactTabulator = ({onTableRef, gridId, events, containerClassName, width, minWidth, maxWidth, ...props}: IReactTabulatorProps): JSX.Element => {
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
