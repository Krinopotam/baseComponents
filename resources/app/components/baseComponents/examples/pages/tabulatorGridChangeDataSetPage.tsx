
    import React from 'react';
    import {TabulatorGridChangeDataSet} from '../components/tabulatorGridChangeDataSet';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TabulatorGridChangeDataSetPage = (props: {darkMode: boolean}): JSX.Element => {
    const source = `import React from 'react';
import TabulatorGrid, {IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {Button} from "baseComponents/button";

const columns: IReactTabulatorProps['columns'] = [
    {title: 'Column 1', field: 'col1'},
    {title: 'Column 2', field: 'col2'},
    {title: 'Column 3', field: 'col3'},
];

const generateDataSet = (rows:number)=>{
    if (!rows) rows = 10
    const result = [] as IGridRowData[];
    for (let i;i<rows;i++) {
        result.push({col1:'col1_' + Math.random(), col2:'col2_' + Math.random(), col3:'col3_' + Math.random()})
    }

    return result;
}

export const TabulatorGridChangeDataSet = (): JSX.Element => {
    return (
        <>
            <Button>Обновить DataSet</Button>
            <br />
            <Button>Асинхронно обновить DataSet</Button>
            <TabulatorGrid id={'TabulatorGridSimple'} columns={columns} dataSet={generateDataSet(10)} height={500} layout={'fitColumns'} />
        </>
    );
};
`
    return (
        <>
            <div>
                <TabulatorGridChangeDataSet />
            </div>
            <Divider />
            <div>
                <SyntaxHighlighter language="javascript" style={props.darkMode ? darcula : docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
