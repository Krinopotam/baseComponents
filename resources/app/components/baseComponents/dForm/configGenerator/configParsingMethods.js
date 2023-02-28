// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

//region File data load/save
/**
 * Load file
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {Promise<{data:string}|{error:{message:string, operation:string}}>}
 */
async function loadFile(options) {
    const fileReader = new Promise((resolve, reject) => {
        const path =__dirname + '\\' + options.modulePath;
        fs.readFile(path, 'utf8', function read(err, data) {
            if (err) {
                reject({error: {message: err.message, operation: 'file loading'}});
                return;
            }

            let fileContent = data.toString();
            resolve({data: fileContent});
        });
    });

    let result = {};
    await fileReader
        .then((data) => {
            result = data;
        })
        .catch((err) => {
            result = err;
        });
    return result;
}

/**
 * Save content to file
 * @param {string} filePath
 * @param {string} content
 * @returns {Promise<string>}
 */
module.exports.saveFile = async function saveFile(filePath, content) {
    const fileSaver = new Promise((resolve, reject) => {
        const path =__dirname + '\\' + filePath;
        fs.writeFile(path, content, 'utf8', function (err) {
            if (err) {
                reject({message: err.message});
                return;
            }

            resolve();
        });
    });

    let result = '';
    await fileSaver
        .then(() => {
            result = '';
        })
        .catch((err) => {
            result = err.message;
        });

    return result;
};

//endregion

//region Parse interface properties

/**
 * Get interface text from file content
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {Promise<{data:string}|{error:{message:string, operation:string}}>}
 */
async function parseInterfaceText(options) {
    const loadResult = await loadFile(options);
    if (loadResult.error) return loadResult;

    const fileContent = loadResult.data;

    const matcher = new RegExp(
        'export interface ' + options.typeName + '\\s*(?:extends\\s[A-Za-z_<>,\'"\\s]*\\s*)?{[\\r\\n]([a-zA-Z\\d\\s/*?:;,.\'`"_=<>|()\\[\\]+-]*)[\\n\\r]}',
        'gm'
    );

    let matched = matcher.exec(fileContent);
    if (!matched || typeof matched[1] === 'undefined') {
        return {
            error: {
                message: 'Can not find interface "' + options.typeName + '" in the file "' + options.modulePath + '" content\nMatcher: ' + matcher.toString(),
                operation: 'file parsing',
            },
        };
    }

    return {data: matched[1]};
}

/**
 * Get properties collection
 * @param {{modulePath: string, savePath: string, typeName: string,typePath: string}} options
 * @returns {Promise<{properties:Object.<string, {name: string, type: string, sourceType: string, comment}>}|{error:{message:string, operation:string}}>}
 */
module.exports.parseProperties = async function parseProperties(options) {
    const parseInterfaceResult = await parseInterfaceText(options);

    if (parseInterfaceResult.error) return parseInterfaceResult;

    const interfaceText = parseInterfaceResult.data;
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

    return {properties: result};
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
