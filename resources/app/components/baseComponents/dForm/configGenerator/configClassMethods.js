/**
 * @typedef {Object} IClassProps
 * @property {string} className
 * @property {[{typePath: string, typeName: string}]} [imports] - import props
 * @property {[{access: string, name: string, [value]:string, type:string}]} [fields] - fields props
 * @property {{parameters: [{var: 'id', type: 'string'}], rows:string[]}} [constructor] - constructor props
 * @property {Object.<string, {name: string, type: string, sourceType: string, comment}>} [propMethods] - propMethods
 * @property {string[]} [additionalMethods] - additional methods props
 * @property {string} [types] - types props
 * @property {string} [implements] - types props
 * @property {string} [extends] - types props
 **/

/**
 * Generate class text
 * @param {string} className
 * @param {IClassProps} props
 * @returns {string}
 */
module.exports.generateClass = function generateClass(props) {
    return `${generateImports(props.imports)}
${props.types || ''}
export class ${props.className} ${props.implements ? ' implements ' + props.implements : ''}${props.extends ? ' extends ' + props.extends : ''} {
${generateClassFields(props.fields)}
${generateClassConstructor(props.constructor)}
${generatePropsMethods(props.propMethods)}
${generateAdditionalMethods(props.additionalMethods)}
}`;
};

/**
 * generate import section
 * @param {[{typePath: string, typeName: string}]} imports
 * @returns {string}
 */
function generateImports(imports) {
    if (!imports) return '';
    let result = '';

    const groupedImport = {};
    for (const importProps of imports) {
        if (!importProps) continue;
        if (groupedImport[importProps.typePath]) groupedImport[importProps.typePath] = groupedImport[importProps.typePath] + ', ' + importProps.typeName;
        else groupedImport[importProps.typePath] = importProps.typeName;
    }

    for (const path in groupedImport) {
        const name = groupedImport[path];
        result = result + getImportTemplate(name, path) + '\n';
    }
    return result;
}

/**
 * @param {string} importName
 * @param {string} importPath
 * @returns {string}
 */
function getImportTemplate(importName, importPath) {
    return `import {${importName}} from '${importPath}';`;
}

/**
 * Generate class fields section props
 * @param {[{access: string, name: string, [value]:string, type:string}]} props
 * @returns {string}
 */
function generateClassFields(props) {
    if (!props) return '';

    let result = '';
    for (const privateVar of props) {
        let line = `    ${privateVar.access || ''} ${privateVar.name}: ${privateVar.type}`;
        if (typeof privateVar.value !== 'undefined') line = line + ' = ' + privateVar.value;
        result = result + line + ';\n';
    }

    return result;
}

/**
 * Generate class constructor
 * @param {{parameters: [{var: 'id', type: 'string'}], rows:string[]}} props
 * @returns {string}
 */
function generateClassConstructor(props) {
    if (!props) return '';

    let rows = '';
    let parameters = '';
    if (props.parameters) {
        for (const param of props.parameters) {
            let curParam = param.var + ': ' + param.type;
            if (parameters) parameters = parameters + ', ';
            parameters = parameters + curParam;
        }
    }

    if (props.rows) {
        for (const row of props.rows) {
            if (rows) rows = rows + '\n';
            rows = rows + '        ' + row + ';';
        }
    }

    if (!parameters && !rows) return '';

    return `    constructor(${parameters}) {
${rows} 
    }`;
}

/**
 * Generate property set methods
 * @param {Object.<string, {name: string, type: string, sourceType: string, comment}>} props
 * @returns {string}
 */
function generatePropsMethods(props) {
    if (!props) return '';
    let result = '';
    for (const name in props) {
        result = result + '\n\n' + generateProperty(props[name]);
    }

    return result;
}

/**
 * Generate the property set function
 * @param {{name: string, type: string, sourceType: string, comment}}  prop
 * @returns {string}
 */
function generateProperty(prop) {
    return `    ${prop.comment}
    ${prop.name}(value: ${prop.type}) {
        this._config.${prop.name} = value;
        return this;
    }`;
}

/**
 * Generate additional class methods
 * @param {string[]} props
 * @returns {string}
 */
function generateAdditionalMethods(props) {
    if (!props) return '';

    let rows = '';
    for (const row of props) {
        if (!row) continue;
        rows = rows + '\n\n    ' + row;
    }

    return rows;
}
