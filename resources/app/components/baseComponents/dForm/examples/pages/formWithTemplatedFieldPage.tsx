
    import React from 'react';
    import {FormWithTemplatedField} from '../components/formWithTemplatedField';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormWithTemplatedFieldPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig, IConfigGetter} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from 'baseComponents/dForm/configBuilder/passwordComponentConfig';
import React from 'react';

interface I1 {
    name: string;
    login: string;
    cnt: number;
}

const codes = <T,>() => {
    return new InputComponentConfig('login1' as keyof T).label('Логин');
};

const formProps = new DFormConfig<I1>()
    .name('Test form')

    .confirmChanges(true)
    .addFields(codes().inlineGroup('dfdfds'), new InputComponentConfig("login").label('Пароль'))
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const SimpleForm = (): JSX.Element => {
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
                <FormWithTemplatedField />
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
