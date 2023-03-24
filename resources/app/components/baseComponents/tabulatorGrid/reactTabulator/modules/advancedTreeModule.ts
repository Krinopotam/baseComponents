import {TabulatorFull as Tabulator, Module, ScrollToRowPosition, Options, RowComponent} from 'tabulator-tables';
import {IRow, IModule} from './innerTypes';

//region Interfaces
export interface IAdvancedTreeTabulator extends Tabulator, IAdvancedTreeModuleTable {
    options: Options & IAdvancedTreeModuleTableOptions;
}

export interface IAdvancedTreeModuleTableOptions {
    /** The parent key field name */
    dataTreeParentField?: string | number;
}

export interface IAdvancedTreeModuleTable {}

//endregion

export class AdvancedTreeModule extends Module {
    private table: IAdvancedTreeTabulator;

    private curHeaderFilterValues: Record<string, unknown> = {};
    private filteredCacheMap: Record<string, Record<string | number>, boolean> = {};

    constructor(table: Tabulator) {
        super(table);
        this.table = table as IAdvancedTreeTabulator;
        const _this = this as unknown as IModule;

        _this.registerTableOption('dataTreeParentField', undefined);

        /*
        _this.registerTableFunction('getFirstRow', this.getFirstRow.bind(this));
        _this.registerComponentFunction('row', 'setActive', this.setRowActive.bind(this));
        */
    }

    // noinspection JSUnusedGlobalSymbols
    initialize() {
        if (!this.table.options.dataTree) return;

        const _this = this as unknown as IModule;

        this.table.on('dataFiltering', this.onDataFiltering.bind(this));
        this.table.on('dataFiltered', this.onDataFiltered.bind(this));
        _this.subscribe('filter-changed', this.onFilterChanged.bind(this));

        /*
         _this.subscribe('filter-changed', this.test2.bind(this));
        this.bindEvents();
        _this.subscribe('table-destroy', this.unbindEvents.bind(this));
        */
    }

    private getFilterCache(fieldName: string, key: string | number) {
        return this.filteredCacheMap[fieldName]?.[key];
    }

    private setFilterCache(fieldName, key, val) {
        let fieldMap = this.filteredCacheMap[fieldName];

        if (!fieldMap) {
            fieldMap = {};
            this.filteredCacheMap[fieldName] = fieldMap;
        }
        fieldMap[key] = val;
    }

    private onDataFiltering() {
        console.log('onDataFiltering');
    }

    private onDataFiltered() {
        console.log('onDataFiltered');
    }

    private onFilterChanged() {
        const headerFilters = this.table.getHeaderFilters();
        const curHeaderFilterValues: Record<string, unknown> = {};
        for (const filter of headerFilters) {
            if (this.curHeaderFilterValues[filter.field] !== filter.value) {
                this.filteredCacheMap[filter.field] = {}; //clear filtered cache
                console.log('filter ' + filter.field + ' changed');
            }

            curHeaderFilterValues[filter.field] = filter.value;
        }
        this.curHeaderFilterValues = curHeaderFilterValues;
        console.log('onFilterChanged', this.curHeaderFilterValues);
    }
}

AdvancedTreeModule.moduleName = 'advancedTree';
