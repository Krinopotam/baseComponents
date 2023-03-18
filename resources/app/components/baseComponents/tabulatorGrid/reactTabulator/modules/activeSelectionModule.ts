import {TabulatorFull as Tabulator, Module, ScrollToRowPosition, Options, RowComponent} from 'tabulator-tables';

//region Interfaces
export interface IActiveSelectionTabulator extends Tabulator, IActiveSelectionModuleTable {
    options: Options & IActiveSelectionModuleTableOptions;
}

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

export interface IRowComponent extends RowComponent, IActiveSelectionModuleRow {
    _row: IRow;
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
    getComponent: () => RowComponent;
    getHeight: () => number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

type ISelectMode = 'select' | 'deselect' | 'invert';
//endregion

export class ActiveSelectionModule extends Module {
    private table: IActiveSelectionTabulator;
    private activeRow: RowComponent | undefined = undefined;

    constructor(table: Tabulator) {
        super(table);
        this.table = table as IActiveSelectionTabulator;
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

    // noinspection JSUnusedGlobalSymbols
    initialize() {
        const _this = this as unknown as IModule;
        _this.subscribe('row-click', this.rowClickHandler.bind(this));

        this.bindEvents();
        _this.subscribe('table-destroy', this.unbindEvents.bind(this));
    }
    rowClickHandler(e: PointerEvent, row: IRow) {
        const options = this.table.options;
        const rowNode = row.getComponent();

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
            if (curActiveRow) this.selectRowsFromTo(curActiveRow, rowNode, 'select');
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

    public getNextPageRow(row: IRowComponent | false | undefined) {
        if (!row) return this.getFirstRow();
        let clientHeight = this.table.rowManager.element.clientHeight - row._row.getHeight();
        let curRow: IRowComponent | false = row;
        let rowCandidate: RowComponent = row;
        while (clientHeight > 0 && curRow) {
            curRow = curRow.getNextRow() as IRowComponent;
            if (!curRow) break;
            clientHeight = clientHeight - curRow._row.getHeight();
            rowCandidate = curRow;
        }
        return rowCandidate;
    }

    public getPrevPageRow(row: IRowComponent | false | undefined) {
        if (!row) return this.getFirstRow();
        let clientHeight = this.table.rowManager.element.clientHeight - row._row.getHeight();
        let curRow: IRowComponent | false = row;
        let rowCandidate: RowComponent = row;
        while (clientHeight > 0 && curRow) {
            curRow = curRow.getPrevRow() as IRowComponent;
            if (!curRow) break;
            clientHeight = clientHeight - curRow._row.getHeight();
            rowCandidate = curRow;
        }
        return rowCandidate;
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
    private selectRowsFromTo(rowStart?: RowComponent | false, rowEnd?: RowComponent | false, mode?: ISelectMode) {
        mode = mode || 'select';
        if (!rowStart || !rowEnd) return;
        if (rowStart === rowEnd) {
            rowStart.select();
            return;
        }

        const rowNodes = this.table.getRows('active');
        this.recursiveSelectNode(rowStart, rowEnd, rowNodes, undefined, mode, this.table.options.dataTree);
    }

    private recursiveSelectNode(
        rowStart: RowComponent | false,
        rowEnd: RowComponent | false,
        nodes: RowComponent[],
        inProcess: boolean | undefined,
        mode: ISelectMode,
        recursive?: boolean
    ) {
        for (const node of nodes) {
            if (node === rowStart || node === rowEnd) {
                if (typeof inProcess === 'undefined') {
                    inProcess = true;
                } else {
                    this.selectNode(node, mode);
                    inProcess = false;
                }
            }

            if (inProcess) this.selectNode(node, mode);
            if (inProcess === false) return false;

            if (recursive) inProcess = this.recursiveSelectNode(rowStart, rowEnd, node.getTreeChildren(), inProcess, mode, recursive);
        }

        return inProcess;
    }

    private selectNode(node: RowComponent, mode: ISelectMode) {
        if (mode === 'select' || (mode === 'invert' && !node.isSelected())) node.select();
        else if (mode === 'deselect' || (mode === 'invert' && node.isSelected())) node.deselect();
    }

    //region Keyboard events
    private bindEvents() {
        this.table.element.addEventListener('keydown', this.onKeyDownHandler.bind(this));
        this.table.element.addEventListener('keyup', this.onKeyUpHandler.bind(this));
    }

    private unbindEvents() {
        this.table.element.removeEventListener('keydown', this.onKeyDownHandler.bind(this));
        this.table.element.removeEventListener('keyup', this.onKeyUpHandler.bind(this));
    }

    private onKeyDownHandler(e: KeyboardEvent) {
        switch (e.key) {
            case 'Shift':
                this.onShiftKeyDown();
                break;
            case 'ArrowUp':
                this.onKeyPressArrowUp(e);
                break;
            case 'ArrowDown':
                this.onKeyPressArrowDown(e);
                break;
            case 'PageDown':
                this.onKeyPressPageDown(e);
                break;
            case 'PageUp':
                this.onKeyPressPageUp(e);
                break;
            case 'Home':
                this.onKeyPressHome(e);
                break;
            case 'End':
                this.onKeyPressEnd(e);
                break;
            case 'a':
            case 'A':
            case 'ф':
            case 'Ф':
                this.onKeyPressA(e);
                break;
        }
    }

    private onKeyUpHandler(e: KeyboardEvent) {
        if (e.key === 'Shift') this.onShiftKeyUp();
    }

    private onKeyPressArrowUp(e: KeyboardEvent) {
        if (e.ctrlKey) {
            this.onKeyPressHome(e);
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let nextRow: RowComponent | false | undefined;
        const prevRow = this.getActiveRow();
        if (prevRow) nextRow = prevRow.getPrevRow() || this.getFirstRow();
        else nextRow = this.getFirstRow();

        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.shiftKey) this.setActiveRow(nextRow, true, 'top');
        else {
            if (prevRow !== nextRow && nextRow?.isSelected()) prevRow?.deselect();
            this.setActiveRow(nextRow, false, 'top');
        }
    }

    private onKeyPressArrowDown(e: KeyboardEvent) {
        if (e.ctrlKey) {
            this.onKeyPressEnd(e);
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let nextRow: RowComponent | false | undefined;
        const prevRow = this.getActiveRow();
        if (prevRow) nextRow = prevRow.getNextRow() || this.getLastRow();
        else nextRow = this.getFirstRow();

        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.shiftKey) this.setActiveRow(nextRow, true, 'bottom');
        else {
            if (prevRow !== nextRow && nextRow?.isSelected()) prevRow?.deselect();
            this.setActiveRow(nextRow, false, 'bottom');
        }
    }

    private onKeyPressPageDown(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        const prevRow = this.getActiveRow() || this.getLastRow();
        const nextRow = this.getNextPageRow(prevRow as IRowComponent);

        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.shiftKey) this.setActiveRow(nextRow, true, 'bottom');
        else {
            this.selectRowsFromTo(prevRow, nextRow, 'select');
            this.setActiveRow(nextRow, false, 'bottom');
        }
    }

    private onKeyPressPageUp(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        const prevRow = this.getActiveRow() || this.getFirstRow();
        const nextRow = this.getPrevPageRow(prevRow as IRowComponent);

        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.shiftKey) this.setActiveRow(nextRow, true, 'top');
        else {
            this.selectRowsFromTo(prevRow, nextRow, 'select');
            this.setActiveRow(nextRow, false, 'top');
        }
    }

    private onKeyPressHome(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        const prevRow = this.getActiveRow() || this.getFirstRow();
        const nextRow = this.getFirstRow();

        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.shiftKey) this.setActiveRow(nextRow, true, 'top');
        else {
            this.selectRowsFromTo(prevRow, nextRow, 'select');
            this.setActiveRow(nextRow, false, 'top');
        }
    }

    private onKeyPressEnd(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        const prevRow = this.getActiveRow() || this.getLastRow();
        const nextRow = this.getLastRow();

        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.shiftKey) this.setActiveRow(nextRow, true, 'bottom');
        else {
            this.selectRowsFromTo(prevRow, nextRow, 'select');
            this.setActiveRow(nextRow, false, 'bottom');
        }
    }

    private onKeyPressA(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        const multiSelect = this.table.options.multiSelect;

        if (!multiSelect || !e.ctrlKey) return;

        this.selectRowsFromTo(this.getFirstRow(), this.getLastRow(), 'select');
    }

    private onShiftKeyDown() {
        this.table.element.style.userSelect = 'none';
    }

    private onShiftKeyUp() {
        this.table.element.style.userSelect = 'initial';
    }
    //endregion
}

ActiveSelectionModule.moduleName = 'activeSelection';
