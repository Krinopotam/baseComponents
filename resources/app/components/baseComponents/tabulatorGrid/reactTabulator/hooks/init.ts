import React from 'react';
import {EventCallBackMethods, Options, TabulatorFull as Tabulator} from 'tabulator-tables';
import {IReactTabulatorProps, ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {render} from 'react-dom';
import {ActiveSelectionModule} from '../modules/activeSelectionModule';
import {scrollToRow} from "baseComponents/tabulatorGrid/reactTabulator/patches/scrollToRowPositionPatсh";

export const useInit = ({
    props,
    events,
    containerRef,
    tableRef,
    onTableRef,
}: {
    props: IReactTabulatorProps;
    events?: Partial<EventCallBackMethods>;
    containerRef: React.RefObject<HTMLDivElement>;
    tableRef: React.MutableRefObject<ITabulator | null>;
    onTableRef?: (ref: React.MutableRefObject<Tabulator | null>) => void;
}) => {
    React.useEffect(() => {
        initTabulator({props, events, containerRef, tableRef, onTableRef}).then();

        return () => {
            for (const eventName in events) {
                const handler = events[eventName as keyof EventCallBackMethods];
                // eslint-disable-next-line react-hooks/exhaustive-deps
                tableRef.current?.off(eventName as keyof EventCallBackMethods, handler);
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
            tableRef.current?.destroy();
        };
    }, [props, onTableRef, containerRef, tableRef, events]);
};

const initTabulator = async ({
    props,
    events,
    containerRef,
    tableRef,
    onTableRef,
}: {
    props: IReactTabulatorProps;
    events?: Partial<EventCallBackMethods>;
    containerRef: React.RefObject<HTMLDivElement>;
    tableRef: React.MutableRefObject<ITabulator | null>;
    onTableRef?: (ref: React.MutableRefObject<Tabulator | null>) => void;
}) => {
    const $container = containerRef.current as HTMLDivElement; // mounted DOM element
    const propOptions = await propsToOptions(props);

    Tabulator.registerModule(ActiveSelectionModule);
    tableRef.current = new Tabulator($container, propOptions) as ITabulator;

    //!TODO: Monkey patch. Check if the developer fixed it
    tableRef.current.rowManager['scrollToRow']=	scrollToRow.bind(tableRef.current.rowManager)

    Tabulator.extendModule('keybindings', 'actions', {
        navUp: function (e: KeyboardEvent) {
            e.preventDefault();
            const tableApi = tableRef.current;
            const curRow = tableApi?.getActiveRow();
            if (!curRow) {
                tableApi?.setActiveRow(tableApi?.getFirstRow(), true, 'top');
                return;
            }
            const nextRow = curRow.getPrevRow();
            if (nextRow) tableApi?.setActiveRow(nextRow, true, 'top');
            else tableApi?.setActiveRow(tableApi?.getFirstRow(), true, 'top');
        },
        navDown: (e: KeyboardEvent) => {
            e.preventDefault();
            const tableApi = tableRef.current;
            const curRow = tableApi?.getActiveRow();
            if (!curRow) {
                tableApi?.setActiveRow(tableApi?.getFirstRow(), true, 'bottom');
                return;
            }
            const nextRow = curRow.getNextRow();
            if (nextRow) tableApi?.setActiveRow(nextRow, true, 'bottom');
            else tableApi?.setActiveRow(tableApi?.getLastRow(), true, 'bottom');
        },
    });

    onTableRef?.(tableRef);

    if (events) {
        for (const eventName in events) {
            const handler = events[eventName as keyof EventCallBackMethods];
            tableRef.current?.on(eventName as keyof EventCallBackMethods, handler);
        }
    }
};

function syncRender(component: JSX.Element, el: HTMLElement): Promise<HTMLElement> {
    return new Promise(function (resolve) {
        render(component, el, () => {
            resolve(el);
        });
    });
}

const propsToOptions = async (props: IReactTabulatorProps) => {
    const output = {...props} as Options;
    if (typeof props['footerElement'] === 'object') {
        // convert from JSX to HTML string (tabulator's footerElement accepts string)
        const el = await syncRender(props['footerElement'], document.createElement('div'));
        output.footerElement = el.innerHTML;
        output.layout = props.layout || 'fitColumns';
    }
    return output;
};
