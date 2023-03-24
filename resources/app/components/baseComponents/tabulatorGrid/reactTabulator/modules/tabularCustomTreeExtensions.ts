import {TabulatorFull as Tabulator} from 'tabulator-tables';

//https://harbulot.github.io/tabulator-examples/tree-tests-tabulator-5.3/tree-test-1.html
//https://github.com/harbulot/tabulator-examples/blob/main/tree-tests-tabulator-5.3/tabulator-custom-tree-extensions.js

/*jslint node: true, eqnull: true, esversion: 6, browser: true */
/*global Tabulator: false, $: false */
/*
The MIT License (MIT)

Copyright (c) 2020-2022 Bruno Harbulot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.





Some of this code may be derived from Tabulator's original code (see comments for details):

The MIT License (MIT)

Copyright (c) 2015-2020 Oli Folkerd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

('use strict');

Tabulator.customExtensions = Tabulator.customExtensions || {};
Tabulator.customExtensions.tableTreeExpand = function (table, rows, refresh, reformat) {
    // We expect Rows, not RowComponents
    if (rows == null) {
        rows = [];
        for (const r of table.getRows()) {
            rows.push(r._getSelf());
        }
    }

    for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        const rowDataTree = row.modules.dataTree;
        if (rowDataTree && rowDataTree.children) {
            rowDataTree.open = true;
            if (!Array.isArray(rowDataTree.children)) {
                rowDataTree.children = table.modules.dataTree.generateChildren(row);
            }

            Tabulator.customExtensions.tableTreeExpand(table, rowDataTree.children, false, reformat);

            if (reformat) {
                row.getComponent().reformat();
            }
        }
    }

    if (refresh == null || refresh === true) {
        table.rowManager.refreshActiveData(null, false, true);
    }
};

Tabulator.customExtensions.tableTreeCollapse = function (table, rows, unlessSelected, refresh, reformat) {
    // We expect Rows, not RowComponents
    if (rows == null) {
        rows = [];
        for (const r of table.getRows()) {
            rows.push(r._getSelf());
        }
    }

    let anySelectedNodesInArrayOrSubtree = false;
    for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        const rowDataTree = row.modules.dataTree;

        if (row.modules.select.selected) {
            anySelectedNodesInArrayOrSubtree = true;
        }
        if (rowDataTree && rowDataTree.children) {
            const subtreeHasSelectedNodes = Tabulator.customExtensions.tableTreeCollapse(table, rowDataTree.children, unlessSelected, false, reformat);

            if (unlessSelected && subtreeHasSelectedNodes) {
                rowDataTree.open = true;
            } else {
                rowDataTree.open = false;
            }

            if (subtreeHasSelectedNodes) {
                anySelectedNodesInArrayOrSubtree = true;
            }

            if (reformat) {
                row.getComponent().reformat();
            }
        }
    }

    if (refresh == null || refresh === true) {
        table.rowManager.refreshActiveData(null, false, false);
    }

    return anySelectedNodesInArrayOrSubtree;
};

Tabulator.customExtensions.tableTreeFindRow = function (table, id, rows) {
    // We expect Rows, not RowComponents
    if (rows == null) {
        rows = [];
        if (table == null) {
            throw 'A table needs to be provided if no rows are provided.';
        }
        for (const r of table.getRows()) {
            rows.push(r._getSelf());
        }
    }

    for (const row of rows) {
        if (row.component.getIndex() == id) {
            return row;
        }

        const rowDataTree = row.modules.dataTree;
        if (rowDataTree.children) {
            if (!Array.isArray(rowDataTree.children)) {
                rowDataTree.children = row.table.modules.dataTree.generateChildren(row);
            }

            const subtreeRow = Tabulator.customExtensions.tableTreeFindRow(null, id, rowDataTree.children);
            if (subtreeRow) {
                return subtreeRow;
            }
        }
    }

    return null;
};

Tabulator.customExtensions.tableTreeIndexRows = function (table, indexToRowMap, rows, indexFunction) {
    if (indexToRowMap == null) {
        indexToRowMap = {};
    }
    if (indexFunction == null) {
        indexFunction = function (row) {
            return row.component.getIndex();
        };
    }

    // We expect Rows, not RowComponents
    if (rows == null) {
        rows = [];
        if (table == null) {
            throw 'A table needs to be provided if no rows are provided.';
        }
        for (const r of table.getRows()) {
            rows.push(r._getSelf());
        }
    }

    for (const row of rows) {
        indexToRowMap[indexFunction(row)] = row;

        const rowDataTree = row.modules.dataTree;
        if (rowDataTree.children) {
            if (!Array.isArray(rowDataTree.children)) {
                rowDataTree.children = row.table.modules.dataTree.generateChildren(row);
            }

            Tabulator.customExtensions.tableTreeIndexRows(null, indexToRowMap, rowDataTree.children, indexFunction);
        }
    }

    return indexToRowMap;
};

Tabulator.customExtensions.tableTreeEnsureRowExpanded = function (table, row) {
    // We expect Rows, not RowComponents
    const parent = row.modules.dataTree.parent;
    if (parent) {
        parent.modules.dataTree.open = true;
        Tabulator.customExtensions.tableTreeEnsureRowExpanded(table, parent);
    }
};

Tabulator.customExtensions.tableTreeSelectIds = function (table, ids, ignoreNotFound, ensureExpanded) {
    if (ignoreNotFound == null) {
        ignoreNotFound = false;
    }
    const selectedRows = [];

    const indexToRowMap = Tabulator.customExtensions.tableTreeIndexRows(table);

    for (const id of ids) {
        const row = indexToRowMap[id];
        if (row == null) {
            if (!ignoreNotFound) {
                throw 'Requested ID not found in table tree: ' + id;
            }
        } else {
            selectedRows.push(row.getComponent());
        }
    }
    table.modules.selectRow.selectRows(selectedRows);

    if (ensureExpanded) {
        for (const row of table.getSelectedRows()) {
            Tabulator.customExtensions.tableTreeEnsureRowExpanded(table, row._getSelf());
        }
        table.rowManager.refreshActiveData(null, false, true);
    }
};

Tabulator.customExtensions.tableTreeScrollToRow = function (table, id, position, ifVisible) {
    // This is derived from the Tabulator.prototype.scrollToRow in Tabulator's src/js/core.js (version 4.9)
    if (ifVisible == null) {
        ifVisible = table.options.scrollToRowIfVisible;
    }

    return new Promise((resolve, reject) => {
        const row = Tabulator.customExtensions.tableTreeFindRow(table, id);

        if (row) {
            if (!ifVisible) {
                Tabulator.customExtensions.tableTreeEnsureRowExpanded(table, row);
                table.rowManager.refreshActiveData(null, false, true);
            }

            table.rowManager
                .scrollToRow(row, position, ifVisible)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject('Scroll Error - No matching row found');
        }
    });
};

/*
 This is to handle filtering in child nodes of the tree, otherwise Tabulator only
 filters the top-level rows.
 See: https://github.com/olifolkerd/tabulator/issues/3020


 We keep an internal double map (indexed with field name and row id) that points to a filtering result:
 - 2: when it's an actual match for the row,
 - 1: when the row is an ancestor leading to an actual match.


 Typical usage:
        let deepMatchHeaderFilterStatusMap = {};
        const deepMatchHeaderFilter = Tabulator.customExtensions.tableTreeCreateDeepMatchHeaderFilter(
            function getter(k) {
                return (deepMatchHeaderFilterStatusMap[fieldName] || {})[k];
            },
            function setter(k, v) {
                let fieldMap = deepMatchHeaderFilterStatusMap[fieldName];
                if (fieldMap == null) {
                    fieldMap = {};
                    deepMatchHeaderFilterStatusMap[fieldName] = fieldMap;
                }
                fieldMap[k] = v;
            },
            null,
            null,
            null
        );


This should then be cleared whenever we change the filters.

 */
Tabulator.customExtensions.tableTreeCreateDeepMatchHeaderFilter = function (
    getDeepMatchHeaderFilterStatusMap,
    setDeepMatchHeaderFilterStatusMap,
    matchFunction,
    indexField,
    childrenField
) {
    /*
     Tabulator (at least version 4.9) seems to be missing a way to access the Row Component
     from the header callback itself, so we can't use row.getIndex() from there.
     We're passing indexField and childrenField explicitly because of that.
     */
    if (indexField == null) {
        indexField = 'id';
    }
    if (childrenField == null) {
        childrenField = '_children';
    }

    if (matchFunction == null) {
        matchFunction = function (headerValue, rowValue, rowData, filterParams) {
            return rowValue != null && rowValue.toString().toLowerCase().includes(headerValue.toLowerCase());
        };
    }

    function deepMatchHeaderFilter(headerValue, rowValue, rowData, filterParams, fieldName) {
        // We check if we've already walked through that node (and therefore subtree).
        const cachedStatus = getDeepMatchHeaderFilterStatusMap(fieldName, rowData[indexField]);
        if (cachedStatus != null) {
            // If so, we return the cached result.
            return cachedStatus > 0;
        }

        /* jshint -W040 */
        const columnDef = this;
        /* jshint +W040 */

        if (fieldName == null) {
            if (filterParams && filterParams.fieldName) {
                fieldName = filterParams.fieldName;
            } else {
                fieldName = columnDef.field;
            }
        }

        let anyChildMatch = false;
        for (const childRow of rowData[childrenField] || []) {
            // We walk down the tree recursively
            const match = deepMatchHeaderFilter.apply(columnDef, [headerValue, childRow[fieldName], childRow, filterParams, fieldName]);
            if (match) {
                anyChildMatch = true;
            }
        }

        // We run the actual maching test where applicable. This could be a customised function
        //(passed in the filterParams, for example).
        if (matchFunction(headerValue, rowValue, rowData, filterParams)) {
            setDeepMatchHeaderFilterStatusMap(fieldName, rowData[indexField], 2);
            return true;
        }

        // If any child (and therefore any descendant) matched, we return true.
        if (anyChildMatch) {
            setDeepMatchHeaderFilterStatusMap(fieldName, rowData[indexField], 1);
            return true;
        }

        return false;
    }

    return deepMatchHeaderFilter;
};

/*
 This is a checkbox for the header (to be placed in the "titleFormatter" field of the column
 config). Unlike the default rowFormatter header tickbox, this will only tick: what's
 filtered/displayed in the tree and what's selectable.
 */
/*
NOTE: This code is partly derived from Tabulator 4.9's format.js (rowSelection formatter).
*/
Tabulator.customExtensions.treeHeaderFilteredRowSelectionFormatter = function (cell, formatterParams) {
    const document = window.document;

    /* jshint -W040 */
    const table = this.table;
    /* jshint +W040 */

    // TODO selectableCount
    let checkbox = null;
    if (table.options.selectable) {
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.addEventListener('change', function (e) {
            if (table.modules.selectRow.selectedRows.length) {
                table.deselectRow();
            } else {
                // Default rowSelection handler uses this:
                // this.table.selectRow(formatterParams.rowRange);

                const selectedRows = [];
                for (const row of table.rowManager.getDisplayRows() || []) {
                    if (table.options.selectableCheck.call(table, row.getComponent())) {
                        selectedRows.push(row.getComponent());
                    }
                }
                table.modules.selectRow.selectRows(selectedRows);
            }
        });

        table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);

        return checkbox;
    }
};
