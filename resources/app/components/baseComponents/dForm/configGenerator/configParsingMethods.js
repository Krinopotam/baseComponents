// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

//region File data load/save
/**
 * Load file
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {string}
 */
function loadFile(options) {
    const path = __dirname + '/' + options.modulePath;
    try {
        return fs.readFileSync(path, 'utf8');
    } catch (err) {
        throw new Error('file loading ' + err);
    }
}

/**
 * Save content to file
 * @param {string} filePath
 * @param {string} content
 * @returns {string|undefined}
 */
module.exports.saveFile = function saveFile(filePath, content) {
    const path = __dirname + '/' + filePath;
    try {
        fs.writeFileSync(path, content, 'utf8');
    } catch (err) {
        return err;
    }
};

//endregion

//region Parse interface properties
/**
 * Get interface text from file content
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {string}
 */
function parseInterfaceText(options) {
    const fileContent = loadFile(options);
    const matcher = new RegExp(
        'export interface ' + options.typeName + '\\s*(?:extends\\s[A-Za-z_<>,\'"\\s]*\\s*)?{[\\r\\n]([a-zA-Z\\d\\s/*&?:;,.\'`"@_=<>|()\\[\\]+-]*)[\\n\\r]}',
        'gm'
    );

    let matched = matcher.exec(fileContent);
    if (!matched || typeof matched[1] === 'undefined') {
        throw new Error(
            'file parsing Error: Can not find interface "' +
                options.typeName +
                '" in the file "' +
                options.modulePath +
                '" content\nMatcher: ' +
                matcher.toString()
        );
    }

    return matched[1];
}

/**
 * Get properties collection
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {Object<string, {name: string, type: string, sourceType: string, comment}>}
 */
module.exports.parseProperties = function parseProperties(options) {
    const interfaceText = parseInterfaceText(options);
    const rows = interfaceText.split('\n');
    rows.push('//');

    let result = {};
    let prevComment = '';
    for (const elem of rows) {
        const curRow = elem.trim();
        if (!curRow) {
            prevComment = '';
            continue;
        }

        const isComment = curRow.substring(0, 2) === '//' || curRow.substring(0, 2) === '/*';
        if (isComment) {
            prevComment = curRow; //allow the single row comment only
            continue;
        }

        const property = getProperty(prevComment, curRow, options);
        if (property) result[property.name] = property;
        prevComment = '';
    }

    return result;
};

/**
 * Parse property
 * @param {string} commentRow
 * @param {string} propertyRow
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {{name: string, sourceType: string, comment, type: string}|undefined}
 */
function getProperty(commentRow, propertyRow, options) {
    const [part1, ...rest] = propertyRow.split(':');
    const part2 = rest.join(':');

    if (!part1) return undefined;
    let property = part1.trim();
    let sourceStr = part2 ? part2.trim() : '';

    if (property.substring(property.length - 1) === '?') property = property.substring(0, property.length - 1);
    if (sourceStr.substring(sourceStr.length - 1) === ';') sourceStr = sourceStr.substring(0, sourceStr.length - 1);
    const typeStr = `${options.typeName}['${property}']`;

    return {name: property, type: typeStr, sourceType: sourceStr, comment: commentRow};
}
//endregion
