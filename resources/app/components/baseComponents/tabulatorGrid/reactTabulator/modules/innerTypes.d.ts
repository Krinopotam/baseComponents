import {RowComponent} from 'tabulator-tables';

export interface IRow {
    cells: unknown[];
    component: unknown;
    created: boolean;
    data: Record<string | 'id', unknown>;
    element: HTMLElement;
    height: number;
    heightInitialized: boolean;
    heightStyled: string;
    initialized: boolean;
    manualHeight: boolean;
    modules: Record<string, unknown>;
    outerHeight: number;
    parent: unknown;
    position: number;
    positionWatchers: never[];
    table: Tabulator;
    type: 'row';
    getComponent: () => RowComponent;
    getHeight: () => number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IAnyParam = any;

export interface IModule {
    initialize: () => void;
    registerTableOption: (key: string, value: unknown) => void;
    registerColumnOption: (key: string, value: string) => void;
    registerTableFunction: (name: string, func: (...args: IAnyParam[]) => unknown) => void;
    registerComponentFunction: (component: 'row' | 'column' | 'cell' | 'group' | 'calc', func: string, handler: (...args: IAnyParam[]) => unknown) => void;
    registerDataHandler: (handler: (...args: IAnyParam[]) => unknown, priority: number) => void;
    registerDisplayHandler: (handler: (...args: IAnyParam[]) => unknown, priority: number) => void;
    refreshData: (renderInPosition: boolean, handler: (...args: IAnyParam[]) => void) => void;
    footerAppend: (element: HTMLElement) => HTMLElement;
    footerPrepend: (element: HTMLElement) => HTMLElement;
    footerRemove: (element: HTMLElement) => HTMLElement;
    clearAlert: () => void;
    subscribe: (eventName: string, handler: (...args: IAnyParam[]) => void) => void;
    unsubscribe: (eventName: string) => void;
    subscribed: (eventName: string) => boolean;
    dispatch: (eventName: string, ...args: IAnyParam[]) => void;
    chain: (eventName: string, ...args: IAnyParam[]) => void;
    dispatchExternal: (eventName: string, ...args: IAnyParam[]) => void;
    subscribedExternal: (eventName: string) => boolean;
}
