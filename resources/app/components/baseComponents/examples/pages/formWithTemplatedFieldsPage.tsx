
    import React from 'react';
    import {FormWithTemplatedFields} from '../components/formWithTemplatedFields';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormWithTemplatedFieldsPage = (props: {darkMode: boolean}): JSX.Element => {
    // language=text
    const source = `// noinspection DuplicatedCode

import React from 'react';
import {DForm} from '@krinopotam/ui-dynamic-form';
import {DFormConfig} from '@krinopotam/ui-dynamic-form/configBuilder/dFormConfig';
import {InputComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/passwordComponentConfig';

interface IFields {
    name: string;
    login: string;
    cnt: number;
}

const login = <T,>() => {
    return new InputComponentConfig<T>('login1' as keyof T).label('Логин');
};

const password = <T,>() => {
    return new PasswordComponentConfig<T>('password' as keyof T).label('Пароль');
};

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        login().label('Имя пользователя'),
        password()
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormWithTemplatedFields = (): JSX.Element => {
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
                <FormWithTemplatedFields />
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
