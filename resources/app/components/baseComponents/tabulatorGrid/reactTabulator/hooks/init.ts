import React from 'react';
import {EventCallBackMethods, TabulatorFull as Tabulator} from 'tabulator-tables';
import {IReactTabulatorProps, ITabulator} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {render} from 'react-dom';
import {ActiveSelectionModule} from '../modules/activeSelectionModule';
import {AdvancedTreeModule} from '../modules/advancedTreeModule';
import {collapseButton, expandButton} from 'baseComponents/tabulatorGrid/reactTabulator/parts/icons';
import {setPatches} from 'baseComponents/tabulatorGrid/reactTabulator/patches/setPatches';

export const useInit = ({
    props,
    events,
    containerRef,
    tableRef,
    onTableRef,
}: {
    props: IReactTabulatorProps;
    events?: Partial<EventCallBackMethods>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    tableRef: React.MutableRefObject<ITabulator | null>;
    onTableRef?: (ref: React.MutableRefObject<ITabulator | null>) => void;
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
    containerRef: React.RefObject<HTMLDivElement | null>;
    tableRef: React.MutableRefObject<ITabulator | null>;
    onTableRef?: (ref: React.MutableRefObject<ITabulator | null>) => void;
}) => {
    const $container = containerRef.current as HTMLDivElement; // mounted DOM element
    const propOptions = await propsToOptions(props);

    tableRef.current = initTabulatorClass($container, propOptions);
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
    const output = {...props} as ITabulator['options'];
    if (typeof props['footerElement'] === 'object') {
        // convert from JSX to HTML string (tabulator's footerElement accepts string)
        const el = await syncRender(props['footerElement'], document.createElement('div'));
        output.footerElement = el.innerHTML;
        //output.layout = props.layout || 'fitColumns';
    }

    output.dataTreeCollapseElement = props.dataTreeCollapseElement || collapseButton;
    output.dataTreeExpandElement = props.dataTreeExpandElement || expandButton;
    output.keybindings = {
        navUp: false,
        navDown: false,
        scrollPageUp: false,
        scrollPageDown: false,
        scrollToStart: false,
        scrollToEnd: false,
    };
    return output;
};

const initTabulatorClass = ($container: HTMLDivElement, options: ITabulator['options']): ITabulator => {
    Tabulator.registerModule(ActiveSelectionModule);
    Tabulator.registerModule(AdvancedTreeModule);

    const tableApi = new Tabulator($container, options) as ITabulator;
    setPatches(tableApi); //!TODO: Monkey patches. Check if the developer fixed it

    return tableApi;
};
