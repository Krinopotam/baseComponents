// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const examplesRoot = '.\\examples\\components';
const importExamplesRoot = '../components/';
const importPagesRoot = './pages/';
const pagesPath = '.\\examples\\pages';


/**
 * @param {string} string
 * @returns {string}
 */
function upperFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {string} string
 * @returns {string}
 */
function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 *
 * @param {string} componentFileName
 * @param {string} source
* @returns {string}
 */
function generatePageComponent(componentFileName, componentPath, source, pagesPath) {
    const moduleName = componentFileName.split('.')[0];
    const componentName = upperFirstLetter(moduleName);

    const pageComponentName = componentName + 'Page';

    source = source.replaceAll(/\s*\{\/\*Description Start\*\/\}[\S\s]*?\{\/\*Description End\*\/\}/gi, ''); //remove {/*Description Start/*} blocks
    source = source.replaceAll(/\s*\/\*Description Start\*\/[\S\s]*?\/\*Description End\*\//gi, ''); //remove /*Description Start*/ blocks

    const importStr = `
    import React from 'react';
    import {${componentName}} from '${importExamplesRoot + moduleName}';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';\n`;

    const bodyStr = `
    export const ${pageComponentName} = (): JSX.Element => {
    const source = \`${source}\`
    return (
        <>
            <div>
                <${componentName} />
            </div>
            <Divider />
            <div>
                <SyntaxHighlighter language="javascript" style={docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
`;
    const pageFileName = lowerFirstLetter(pageComponentName) + '.tsx';

    const content = importStr + bodyStr;
    fs.writeFileSync(pagesPath + '\\' + pageFileName, content, {encoding: 'utf8', flag: 'w'});

    const routeStr = `                <Route path="${componentName}" element={<${pageComponentName} />} />;`;
    const routeImportStr = `    import {${pageComponentName}} from '${importPagesRoot + moduleName + 'Page'}';`;
    return [routeStr, routeImportStr];
}

/**
 * 
 * @param {string*} routers 
 * @param {string*} imports 
 */
function generateExamplesRoutes(imports, routers) {
    const result = `
    import React from 'react';
    import {Route, Routes} from 'react-router-dom';
    import {ExamplesLayout} from './examplesLayout';
${imports}

export const ExamplesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ExamplesLayout />}>
                <Route index element={<HomePage />} />
${routers}
                <Route path="*" element={<HomePage />} />
            </Route>
        </Routes>
    );
};
`;
    fs.writeFileSync('./examples/examplesRoutes.tsx', result, {encoding: 'utf8', flag: 'w'});
}

function run() {
    const fileList = fs.readdirSync(examplesRoot);

    let routers = '';
    let imports = '';
    for (const fileName of fileList) {
        const fileSource = fs.readFileSync(examplesRoot + '\\' + fileName, {encoding: 'utf8', flag: 'r'});
        const [routeStr, importStr] = generatePageComponent(fileName, examplesRoot, fileSource, pagesPath);

        routers = routers + routeStr + '\n';
        imports = imports + importStr + '\n';
    }

    generateExamplesRoutes(imports, routers);
}

run();
