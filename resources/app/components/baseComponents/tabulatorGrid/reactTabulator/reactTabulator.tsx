import {propsToOptions} from './configUtils';
import {TabulatorFull as Tabulator, Options, EventCallBackMethods} from 'tabulator-tables';
import React from 'react';
import {getUuid} from 'helpers/helpersString';
import {KeybindingsModule} from 'tabulator-tables';

export interface IGridRowData extends Record<string, unknown> {
    /** Row id */
    id: string | number;
    children?: IGridRowData[];
}

export interface IReactTabulatorProps extends Omit<Options, 'footerElement'> {
    footerElement?: JSX.Element;
    data: IGridRowData[];

    events?: EventCallBackMethods;
    onRef?: (ref: React.MutableRefObject<Tabulator | undefined>) => void;
    className?: string;
}

const initTabulator = async (
    props: IReactTabulatorProps,
    ref: React.RefObject<HTMLDivElement>,
    tabulatorRef: React.MutableRefObject<Tabulator | undefined>,
    events: EventCallBackMethods | undefined,
    onRef?: (ref: React.MutableRefObject<Tabulator | undefined>) => void
) => {
    const domEle = ref.current as HTMLDivElement; // mounted DOM element
    const propOptions = await propsToOptions(props);
    tabulatorRef.current = new Tabulator(domEle, propOptions);

    Tabulator.extendModule("keybindings", "actions", {
        "navUp":function(){
            alert('1111')
            /*var rows = this.table.getSelectedRows();

            rows.forEach(function(row){
                row.delete();
            });*/
        },
    });

    onRef?.(tabulatorRef);

    if (events) {
        for (const eventName in events) {
            const handler = events[eventName as keyof EventCallBackMethods];
            tabulatorRef.current?.on(eventName as keyof EventCallBackMethods, handler);
        }
    }
};

const ReactTabulator = ({events, onRef, className, ...props}: IReactTabulatorProps): JSX.Element => {
    const ref = React.useRef<HTMLDivElement>(null);
    const tabulatorRef = React.useRef<Tabulator>();
    const [mainId] = React.useState(getUuid());

    React.useEffect(() => {
        initTabulator(props, ref, tabulatorRef, events, onRef).then();

        return () => {
            for (const eventName in events) {
                const handler = events[eventName as keyof EventCallBackMethods];
                // eslint-disable-next-line react-hooks/exhaustive-deps
                tabulatorRef.current?.off(eventName as keyof EventCallBackMethods, handler);
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
            tabulatorRef.current?.destroy();
        };
    }, [events, onRef, props]);

    return <div ref={ref} data-instance={mainId} className={className} />;
};

export default ReactTabulator;
