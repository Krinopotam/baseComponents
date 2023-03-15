
    import React from 'react';
    import {FormSimpleHorizontal} from '../components/formSimpleHorizontal';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormSimpleHorizontalPage = (): JSX.Element => {
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
        new InputComponentConfig('login').label('Логин'),
        new PasswordComponentConfig('password').label('Пароль')
    )
    .layout('horizontal')
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormSimpleHorizontal = (): JSX.Element => {
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
                <FormSimpleHorizontal />
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
