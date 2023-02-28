
    import React from 'react';
    import {SimpleValidation} from '../components/simpleValidation';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const SimpleValidationPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import React from 'react';

const formProps = new DFormConfig()
    .name('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig('field1')
            .label('Поле 1')
            .placeholder('Я не должно быть пустым')
            .validationRules({type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}),
        new InputComponentConfig('field2')
            .label('Поле 2')
            .placeholder('Я должно быть числом')
            .validationRules({type: 'number', rule: 'not-empty', message: 'Поле должно быть числом'})
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const SimpleValidation = (): JSX.Element => {
    return (
        <div style={{maxWidth: 500}}>
            <DForm {...formProps} />
        </div>
    );
};
`
    return (
        <>
            <div>
                <SimpleValidation />
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
