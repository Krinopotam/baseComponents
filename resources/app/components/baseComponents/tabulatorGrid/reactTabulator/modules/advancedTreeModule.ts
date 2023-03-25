import {TabulatorFull as Tabulator, Module, Options} from 'tabulator-tables';
import {IModule} from './innerTypes';

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

type AnyType = any;
const defaultFilters: Record<string, (filterVal: AnyType, rowValue: AnyType, rowData: AnyType, filterParams: AnyType) => boolean> = {
    //equal to
    '=': function (filterVal, rowVal) {
        return rowVal == filterVal;
    },

    //less than
    '<': function (filterVal, rowVal) {
        return rowVal < filterVal;
    },

    //less than or equal to
    '<=': function (filterVal, rowVal) {
        return rowVal <= filterVal;
    },

    //greater than
    '>': function (filterVal, rowVal) {
        return rowVal > filterVal;
    },

    //greater than or equal to
    '>=': function (filterVal, rowVal) {
        return rowVal >= filterVal;
    },

    //not equal to
    '!=': function (filterVal, rowVal) {
        return rowVal != filterVal;
    },

    regex: function (filterVal, rowVal) {
        if (typeof filterVal == 'string') filterVal = new RegExp(filterVal);

        return filterVal.test(rowVal);
    },

    //contains the string
    like: function (filterVal, rowVal) {
        if (filterVal === null || typeof filterVal === 'undefined') {
            return rowVal === filterVal;
        } else {
            if (typeof rowVal !== 'undefined' && rowVal !== null) {
                return String(rowVal).toLowerCase().indexOf(filterVal.toLowerCase()) > -1;
            } else {
                return false;
            }
        }
    },

    //contains the keywords
    keywords: function (filterVal, rowVal, _rowData, filterParams) {
        const keywords = filterVal.toLowerCase().split(typeof filterParams.separator === 'undefined' ? ' ' : filterParams.separator),
            value = String(rowVal === null || typeof rowVal === 'undefined' ? '' : rowVal).toLowerCase(),
            matches = [];

        keywords.forEach((keyword: string) => {
            if (value.includes(keyword)) {
                matches.push(true);
            }
        });

        return filterParams.matchAll ? matches.length === keywords.length : !!matches.length;
    },

    //starts with the string
    starts: function (filterVal, rowVal) {
        if (filterVal === null || typeof filterVal === 'undefined') {
            return rowVal === filterVal;
        } else {
            if (typeof rowVal !== 'undefined' && rowVal !== null) {
                return String(rowVal).toLowerCase().startsWith(filterVal.toLowerCase());
            } else {
                return false;
            }
        }
    },

    //ends with the string
    ends: function (filterVal, rowVal) {
        if (filterVal === null || typeof filterVal === 'undefined') {
            return rowVal === filterVal;
        } else {
            if (typeof rowVal !== 'undefined' && rowVal !== null) {
                return String(rowVal).toLowerCase().endsWith(filterVal.toLowerCase());
            } else {
                return false;
            }
        }
    },

    //in array
    in: function (filterVal, rowVal) {
        if (Array.isArray(filterVal)) {
            return filterVal.length ? filterVal.indexOf(rowVal) > -1 : true;
        } else {
            console.warn('Filter Error - filter value is not an array:', filterVal);
            return false;
        }
    },
};

export class AdvancedTreeModule extends Module {
    private table: IAdvancedTreeTabulator;

    private curHeaderFilterValues: Record<string, unknown> = {};
    private filteredCacheMap: Record<string, Record<string | number, boolean>> = {};

    /** The field that was last filtered by the user */
    private lastFilteredField: string | undefined;

    constructor(table: Tabulator) {
        super(table);

        this.table = table as IAdvancedTreeTabulator;
        const _this = this as unknown as IModule;

        const filterFunctions = this.prepareDefaultFilters();
        Tabulator.extendModule('filter', 'filters', filterFunctions);

        _this.registerTableOption('dataTreeParentField', undefined);
    }

    // noinspection JSUnusedGlobalSymbols
    initialize() {
        if (!this.table.options.dataTree) return;

        const _this = this as unknown as IModule;

        this.table.on('dataFiltering', this.onDataFiltering.bind(this));
        this.table.on('dataFiltered', this.onDataFiltered.bind(this));
        _this.subscribe('filter-changed', this.onFilterChanged.bind(this));
    }

    private prepareDefaultFilters() {
        const newDefFilters: typeof defaultFilters = {};
        for (const key in defaultFilters) {
            if (this.table.options.dataTree) newDefFilters[key] = defaultFilters[key];
            else newDefFilters[key] = this.getBaseTreeDataFilter(defaultFilters[key]);
        }

        return newDefFilters;
    }

    private getBaseTreeDataFilter(matchFunction: (filterVal: AnyType, rowValue: AnyType, rowData: AnyType, filterParams: AnyType) => boolean) {
        const filter = (filterVal: AnyType, rowValue: AnyType, rowData: AnyType, filterParams: AnyType, force?: boolean) => {
            console.log(rowData)
            const fieldName = this.getFilterFieldName(filterVal, rowValue, rowData, filterParams);
            const indexField = this.table.options.index || 'id';
            const childrenField = this.table.options.dataTreeChildField || 'children';

            if (force === true) {
                this.setFilterCache(fieldName, rowData[indexField], true);
                return true;
            }

            // We check if we've already walked through that node (and therefore subtree).
            if (this.getFilterCache(fieldName, rowData[indexField])) return true;

            if (matchFunction(filterVal, rowValue, rowData, filterParams)) {
                this.setFilterCache(fieldName, rowData[indexField], true);
                //force set children visible
                for (const childRow of rowData[childrenField] || []) filter(filterVal, childRow[fieldName], childRow, filterParams, true);
                return true;
            }

            let anyChildMatch = false;
            for (const childRow of rowData[childrenField] || []) {
                // We walk down the tree recursively
                const match = filter(filterVal, childRow[fieldName], childRow, filterParams);
                if (match) anyChildMatch = true;
            }

            if (anyChildMatch) {
                this.setFilterCache(fieldName, rowData[indexField], true);
                return true;
            }

            return false;
        };

        return filter;
    }

    /** Get field name by filter value and row value
     * This is a workaround, because during filtering, Tabulator will not pass the name of the field that is currently being filtered, but you need to know it for correct filtering
     */
    private getFilterFieldName(filterVal: AnyType, rowValue: AnyType, rowData: AnyType, filterParams: AnyType): string {
        if (filterParams?.fieldName) return filterParams?.fieldName;

        const filters = this.table.getHeaderFilters();
        for (const filter of filters) {
            if (filterVal === filter.value && rowValue === rowData[filter.field]) return filter.field;
        }

        return this.getLastFilterField();
    }

    private getFilterCache(fieldName: string, key: string | number) {
        return this.filteredCacheMap[fieldName]?.[key];
    }

    private setFilterCache(fieldName: string, key: string, val: boolean) {
        let fieldMap = this.filteredCacheMap[fieldName];

        if (!fieldMap) {
            fieldMap = {};
            this.filteredCacheMap[fieldName] = fieldMap;
        }
        fieldMap[key] = val;
    }

    private onDataFiltering() {
        console.log('onDataFiltering', arguments);
    }

    private onDataFiltered(filters, rows) {
        console.log('onDataFiltered', arguments);
    }

    private onFilterChanged() {
        const headerFilters = this.table.getHeaderFilters();
        const curHeaderFilterValues: Record<string, unknown> = {};
        for (const filter of headerFilters) {
            if (this.curHeaderFilterValues[filter.field] !== filter.value) {
                this.filteredCacheMap[filter.field] = {}; //clear filtered cache
                this.lastFilteredField = filter.field;
                console.log('filter ' + filter.field + ' changed');
            }

            curHeaderFilterValues[filter.field] = filter.value;
        }
        this.curHeaderFilterValues = curHeaderFilterValues;
    }

    private getLastFilterField() {
        return this.lastFilteredField || '';
    }
}

AdvancedTreeModule.moduleName = 'advancedTree';
