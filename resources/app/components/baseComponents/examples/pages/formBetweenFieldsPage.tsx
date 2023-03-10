
    import React from 'react';
    import {FormBetweenFields} from '../components/formBetweenFields';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormBetweenFieldsPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {TreeSelectComponentConfig} from 'baseComponents/dForm/configBuilder/treeSelectComponentConfig';
import {InputComponentConfig} from "baseComponents/dForm/configBuilder/inputComponentConfig";
import {DFormConfig} from "baseComponents/dForm/configBuilder/dFormConfig";

// interface IFields {
//     login: string;
//     password: string;
// }

const formProps = new DFormConfig<IFields>()
    .name('Test form')
    .confirmChanges(true)
    .addFields(
        new TreeSelectComponentConfig('tip')
            .label('Тип процесса')
            .fetchMode('onUse')
            .dataSet([
                {
                    id: '1',
                    title: 'Первый',
                },
                {
                    id: '2',
                    title: 'Второй',
                },
                {
                    id: '3',
                    title: 'Третий',
                }
            ])
            .inlineGroup('row1')
            .onCustomChange((val)=>{
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({result: 'success', data: [
                            {
                                id: '1',
                                title: 'Первый процесс',
                            },
                            {
                                id: '2',
                                title: 'Второй процесс',
                            }], code: 200, message: ''});
                    }, 3000);
                });
            }),
        new TreeSelectComponentConfig('process')
            .label('Процессы')
            .fetchMode('onUse')
            .dataSet([{}])
            .inlineGroup('row2')   
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormBetweenFields = (): JSX.Element => {
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
                <FormBetweenFields />
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
