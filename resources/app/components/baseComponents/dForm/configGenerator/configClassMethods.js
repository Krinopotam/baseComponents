/**
 * @typedef {Object} IClassProps
 * @property {string} className
 * @property {Object.<string, string>} [imports] - import props
 * @property {Object.<string, {[access]: string, [value]:string, type:string}>} [fields] - fields props
 * @property {{parameters: Object.<string, string>, rows:string[]}} [constructor] - constructor props
 * @property {Object.<string, {name: string, type: string, sourceType: string, comment}>} [propMethods] - propMethods
 * @property {Object.<string, string>} [additionalMethods] - additional methods props
 * @property {string} [types] - types props
 * @property {string} [implements] - types props
 * @property {string} [extends] - types props
 **/

/**
 * Generate class text
 * @param {IClassProps} props
 * @returns {string}
 */
module.exports.generateClass = function generateClass2(props) {
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
 * @param {Object.<string, string>} imports
 * @returns {string}
 */
function generateImports(imports) {
    if (!imports) return '';
    let result = '';

    const groupedImport = {};
    for (const resourceName in imports) {
        const resourcePath = imports[resourceName];
        if (!resourcePath) continue;
        if (groupedImport[resourcePath]) groupedImport[resourcePath] = groupedImport[resourcePath] + ', ' + resourceName;
        else groupedImport[resourcePath] = resourceName;
    }

    for (const path in groupedImport) {
        const name = groupedImport[path];
        result = result + getImportTemplate(name, path) + '\n';
    }

    return result;
}

/**
 * Generate class fields section props
 * @param {Object.<string, {[access]: string, [value]:string, type:string}>} props
 * @returns {string}
 */
function generateClassFields(props) {
    if (!props) return '';

    let result = '';
    for (const varName in props) {
        const varProps = props[varName];
        let line = `    ${varProps.access || ''} ${varName}: ${varProps.type}`;
        if (typeof varProps.value !== 'undefined') line = line + ' = ' + varProps.value;
        result = result + line + ';\n';
    }

    return result;
}

/**
 * Generate class constructor
 * @param {{parameters: Object.<string, string>, rows:string[]}} props
 * @returns {string}
 */
function generateClassConstructor(props) {
    if (!props) return '';

    let rows = '';
    let parameters = '';
    if (props.parameters) {
        for (const paramName in props.parameters) {
            const paramType = props.parameters[paramName];
            if (parameters) parameters = parameters + ', ';
            parameters = parameters + (paramName + ': ' + paramType);
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
 * Generate additional class methods
 * @param {Object.<string, string>} props
 * @returns {string}
 */
function generateAdditionalMethods(props) {
    if (!props) return '';

    let rows = '';
    for (const methodName in props) {
        const methodContent = props[methodName];
        if (!methodContent) continue;
        rows = rows + '\n\n    ' + methodContent;
    }

    return rows;
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