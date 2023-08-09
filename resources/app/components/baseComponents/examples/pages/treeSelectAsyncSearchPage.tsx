
    import React from 'react';
    import {TreeSelectAsyncSearch} from '../components/treeSelectAsyncSearch';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TreeSelectAsyncSearchPage = (props: {darkMode: boolean}): JSX.Element => {
    // language=text
    const source = `// noinspection DuplicatedCode

import React from 'react';
import {DForm} from '@krinopotam/ui-dynamic-form';
import {DFormConfig} from '@krinopotam/ui-dynamic-form/configBuilder/dFormConfig';
import {TreeSelectComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/treeSelectComponentConfig';
import {HelpersObjects}  from "@krinopotam/js-helpers";
import {ITreeSelectSourcePromise} from "@krinopotam/ui-treeselect/treeSelect";

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new TreeSelectComponentConfig<IFields>('departments')
            .label('Подразделения')
            .fetchMode('onUse')
            .noCacheFetchedData(true)
            .minSearchLength(1)
            .callbacks({
                onDataFetch: (search: string) => {
                    return asyncFetch(search) as ITreeSelectSourcePromise;
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
                <SyntaxHighlighter language="javascript" style={props.darkMode ? darcula : docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
