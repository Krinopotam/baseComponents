
    import React from 'react';
    import {FormSimple} from '../components/formSimple';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormSimplePage = (props: {darkMode: boolean}): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {PasswordComponentConfig} from "baseComponents/dForm/configBuilder/passwordComponentConfig";
import {InputComponentConfig} from "baseComponents/dForm/configBuilder/inputComponentConfig";
import {DFormConfig} from "baseComponents/dForm/configBuilder/dFormConfig";

interface IFields {
    login: string;
    password: string;
}

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig<IFields>('login').label('Логин'),
        new PasswordComponentConfig<IFields>('password').label('Пароль')
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormSimple = (): JSX.Element => {
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
                <FormSimple />
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
