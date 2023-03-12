
    import React from 'react';
    import {FormFetching} from '../components/formFetching';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormFetchingPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';

interface IFields {
    position: string;
    department: string;
}

const formProps = new DFormConfig<IFields>()
    .name('Test form')
    .formMode('update')
    .confirmChanges(true)
    .addFields(new InputComponentConfig('position').label('Должность'), new InputComponentConfig('department').label('Подразделение'))
    .callbacks({
        onDataFetch: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({message: 'Ошибка загрузки данных', code: 400});
                    else resolve({data: {position: 'Директор', department: 'Главная дирекция'}});
                }, 3000);
            });
        },
    })
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormFetching = (): JSX.Element => {
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
                <FormFetching />
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