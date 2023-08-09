
    import React from 'react';
    import {FormValidation} from '../components/formValidation';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormValidationPage = (props: {darkMode: boolean}): JSX.Element => {
    // language=text
    const source = `// noinspection DuplicatedCode

import React from 'react';
import {DForm} from '@krinopotam/ui-dynamic-form';
import {DFormConfig} from '@krinopotam/ui-dynamic-form/configBuilder/dFormConfig';
import {InputComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/inputComponentConfig';

interface IFields {
    field1: string;
    field2: string;
}

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig<IFields>('field1')
            .label('Поле 1')
            .placeholder('Я не должно быть пустым')
            .validationRules({type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}),
        new InputComponentConfig<IFields>('field2')
            .label('Поле 2')
            .placeholder('Я должно быть числом')
            .validationRules({type: 'number', rule: 'not-empty', message: 'Поле должно быть числом'})
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormValidation = (): JSX.Element => {
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
                <FormValidation />
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
