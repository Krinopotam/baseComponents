
    import React from 'react';
    import {FormWithTemplatedFields} from '../components/formWithTemplatedFields';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormWithTemplatedFieldsPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from 'baseComponents/dForm/configBuilder/passwordComponentConfig';
import React from 'react';

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
                <SyntaxHighlighter language="javascript" style={docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
