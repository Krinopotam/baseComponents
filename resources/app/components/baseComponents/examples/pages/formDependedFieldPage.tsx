
    import React from 'react';
    import {FormDependedField} from '../components/formDependedField';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormDependedFieldPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import React from 'react';

interface IFields {
    field1: string;
    field2: string;
    field3: string;
}

const formProps = new DFormConfig<IFields>()
    .name('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig('field1').label('Поле 1').placeholder('Введите что-нибудь'),
        new InputComponentConfig('field2')
            .label('Поле 2 (зависит от Поля 1)')
            .placeholder('Меня не видно, если поле 1 пусто. Введите что-нибудь')
            .dependsOn(['field1']),
        new InputComponentConfig('field3')
            .label('Поле 3 (зависит от Поля 1 и 2)')
            .placeholder('Меня не видно, если поля 1 и 2 пусты')
            .dependsOn(['field1', 'field2'])
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormDependedField = (): JSX.Element => {
    return (
        <>
        <div style={{maxWidth: 500}}>
            <DForm {...formProps} />
        </div></>
    );
};
`
    return (
        <>
            <div>
                <FormDependedField />
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
