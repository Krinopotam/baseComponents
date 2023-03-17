
/** In Tabulator 5.4 findRow looks for root rows only. 
 * This patch corrects this behavior so that the function can also find the child row */
 
let oldFindRow;
export const setFindRowPatch = (tableApi) => {
    oldFindRow = tableApi.rowManager['findRow'];
    tableApi.rowManager['findRow'] = findRowPatch.bind(tableApi.rowManager);
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

export const findRowPatch1 = function (subject) {
    console.log('patched', this.rows);
    
    if(typeof subject == "object"){
        if(subject instanceof Row){
            //subject is row element
            return subject;
        }else if(subject instanceof RowComponent){
            //subject is public row component
            return subject._getSelf() || false;
        }else if(typeof HTMLElement !== "undefined" && subject instanceof HTMLElement){
            //subject is a HTML element of the row
            let match = this.rows.find((row) => {
                return row.getElement() === subject;
            });
            
            return match || false;
        }else if(subject === null){
            return false;
        }
    }else if(typeof subject == "undefined"){
        return false;
    }else {
        //subject should be treated as the index of the row
        let match = this.rows.find((row) => {
            return row.data[this.table.options.index] == subject;
        });
        
        return match || false;
    }
    
    //catch all for any other type of input
    return false;
};