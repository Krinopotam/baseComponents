import {TabulatorFull as Tabulator, Module, ScrollToRowPosition, Options, RowComponent} from 'tabulator-tables';

export interface IActiveSelectionModuleTableEvents {
    activeRowChanged?: (row: RowComponent) => void;
}

export interface IActiveSelectionModuleTableOptions {
    multiSelect?: boolean;
}

export interface IActiveSelectionModuleTable {
    setActiveRow: (row: RowComponent | undefined | null, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) => void;
    setActiveRowByKey: (key: string | number | undefined | null, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) => void;
    getActiveRowKey: () => string | number | undefined;
    getActiveRow: () => RowComponent | undefined;
    getActiveRowData: () => Record<string | 'id', unknown> | undefined;
    getFirstRow: () => RowComponent | undefined;
    getLastRow: () => RowComponent | undefined;
}

export interface IActiveSelectionModuleRow {
    isActive: () => boolean;
    setActive: (clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) => void;
}

interface IRow {
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
    getComponent: ()=>RowComponent;
}
type IAnyParam = any;

interface IModule {
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

export class ActiveSelectionModule extends Module {
    private table: Tabulator;
    private activeRow: RowComponent | undefined = undefined;

    constructor(table: Tabulator) {
        super(table);
        this.table = table;
        const _this = this as unknown as IModule;
        _this.registerTableOption('multiSelect', true);
        _this.registerTableFunction('getFirstRow', this.getFirstRow.bind(this));
        _this.registerTableFunction('getLastRow', this.getLastRow.bind(this));
        _this.registerTableFunction('setActiveRow', this.setActiveRow.bind(this));
        _this.registerTableFunction('setActiveRowByKey', this.setActiveRowByKey.bind(this));
        _this.registerTableFunction('getActiveRowKey', this.getActiveRowKey.bind(this));
        _this.registerTableFunction('getActiveRow', this.getActiveRow.bind(this));
        _this.registerTableFunction('getActiveRowData', this.getActiveRowData.bind(this));
        _this.registerComponentFunction('row', 'isActive', this.isRowActive.bind(this));
        _this.registerComponentFunction('row', 'setActive', this.setRowActive.bind(this));
    }

    initialize() {
        const _this = this as unknown as IModule;
        _this.subscribe('row-click', this.rowClickHandler.bind(this));
    }

    //initialize selectable column
    rowClickHandler(e: PointerEvent, row: IRow) {
        const options = this.table.options as Options & {multiSelect: boolean};
        const rowNode =row.getComponent();
        console.log(row, rowNode)
        if (!rowNode) return;

        if (!options.multiSelect || (!e.ctrlKey && !e.shiftKey)) {
            e.preventDefault();
            this.setActiveRow(rowNode, true, 'nearest');
            return;
        }
        if (e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            if (rowNode === this.getActiveRow()) {
                const newNode = this.findNewActiveRowInSelection(rowNode);
                rowNode.deselect();
                this.setActiveRow(newNode, false);
            } else if (rowNode.isSelected()) {
                rowNode.deselect();
            } else {
                this.setActiveRow(rowNode, false);
            }
        } else if (!e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            const curActiveRow = this.getActiveRow();
            if (curActiveRow) this.selectRowsFromTo(curActiveRow, rowNode);
            this.setActiveRow(rowNode, false);
        }
    }

    public setActiveRow(row: RowComponent | undefined | null, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) {
        const _this = this as unknown as IModule;
        const prevActiveRow = this.activeRow;
        this.activeRow = row || undefined;
        _this.dispatchExternal('activeRowChanged', row);

        if (clearSelection || !row) this.table.deselectRow();
        if (prevActiveRow !== this.activeRow) prevActiveRow?.reformat();

        if (!row) return;

        row.select();
        if (scrollPosition && !row.isFrozen()) this.table.scrollToRow(row, scrollPosition, false).then();
        row.reformat();
    }

    public setActiveRowByKey(key: string | number | undefined | null, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) {
        const row = key ? this.table.getRow(key) : undefined;
        this.setActiveRow(row, clearSelection, scrollPosition);
    }

    public getActiveRowKey() {
        return this.activeRow?.getIndex();
    }

    public getActiveRow() {
        return this.activeRow;
    }

    public getActiveRowData() {
        return this.getActiveRow()?.getData();
    }

    public isRowActive(row: RowComponent) {
        return row === this.activeRow;
    }

    public setRowActive(row: RowComponent, clearSelection?: boolean, scrollPosition?: ScrollToRowPosition) {
        this.setActiveRow(row, clearSelection, scrollPosition);
    }

    public getFirstRow() {
        const rows = this.table.getRows('active');
        if (!rows || rows.length === 0) return undefined;
        for (const row of rows) {
            if (!row.isFrozen()) return row;
        }
        return undefined;
    }

    public getLastRow() {
        const rows = this.table.getRows('active');
        if (!rows || rows.length === 0) return undefined;
        return rows[rows.length - 1];
    }

    /** We find among the selected rows the one that will become active when the current rows is deactivated */
    private findNewActiveRowInSelection(row: RowComponent) {
        const selectedRows = this.table.getSelectedRows();
        if (selectedRows.length === 1) return undefined;

        let newRow: RowComponent | undefined = undefined;
        let activeReached = false;
        for (const curRow of selectedRows) {
            if (curRow === row) {
                activeReached = true;
                continue;
            }

            newRow = curRow;
            if (activeReached && newRow) break;
        }

        return newRow;
    }

    /** Select rows from startRow to endRow */
    private selectRowsFromTo(rowStart: RowComponent, rowEnd: RowComponent) {
        if (!rowStart || !rowEnd) return;
        if (rowStart === rowEnd) {
            rowStart.select();
            return;
        }
        const rowNodes = this.table.getRows('active');
        let select = false;
        for (const node of rowNodes) {
            if (!select) {
                if (node === rowStart || node === rowEnd) select = true;
            } else {
                if (select) node.select();
                if (node === rowStart || node === rowEnd) break;
            }

            if (select) node.select();
        }
    }
}

ActiveSelectionModule.moduleName = 'activeSelection';
