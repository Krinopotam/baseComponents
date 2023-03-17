
/** In Tabulator 5.4 findRow looks for root rows only. 
 * This patch corrects this behavior so that the function can also find the child row */
 
let oldFindRow;
export const setFindRowPatch = (tableApi) => {
    oldFindRow = tableApi.rowManager.findRow;
    tableApi.rowManager.findRow = findRowPatch.bind(tableApi.rowManager);
}

export const findRowPatch = function (subject) {
    if(!this.table.options.dataTree || typeof subject == "undefined" || typeof subject == "object") return oldFindRow(subject);
    
    return recursiveFindRow(this.table, this.rows, subject)
};

const recursiveFindRow = (table, rows, key) => {
    let  result = undefined
    for (const row of rows) {
        const rowComponent = getRowType(row) === 'rowComponent' ? row : row.getComponent();
        if (rowComponent.getData()[table.options.index]===key) return rowComponent._getSelf();
        const childRows = rowComponent.getTreeChildren();
        if (childRows && childRows.length>0) {
            result = recursiveFindRow(table, childRows, key)
            if (result) return result
        }
    }
    
    return false
}

const getRowType = (row)=>{
    if (!row) return undefined
    if (row._getSelf?.()?.type==='row') return 'rowComponent'
    if (row.type==='row') return 'row'
    return undefined;
}
