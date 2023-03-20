
    import React from 'react';
    import {TreeSelectAsyncSearch} from '../components/treeSelectAsyncSearch';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TreeSelectAsyncSearchPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {TreeSelectComponentConfig} from 'baseComponents/dForm/configBuilder/treeSelectComponentConfig';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {cloneObject} from 'baseComponents/libs/helpers/helpersObjects';

interface IFields {
    department: {id: string; title: string};
}

interface IDataRow {
    id: string;
    title: string;
    children?: IDataRow[];
}

type IDataSet = IDataRow[];

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new TreeSelectComponentConfig('departments')
            .label('Подразделения')
            .fetchMode('onUse')
            .noCacheFetchedData(true)
            .callbacks({
                onDataFetch: (search: string) => {
                    return asyncFetch(search);
                },
            })
    )
    .buttons(null)
    .getConfig();

export const TreeSelectAsyncSearch = (): JSX.Element => {
    return (
        <>
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};
`
    return (
        <>
            <div>
                <TreeSelectAsyncSearch />
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
