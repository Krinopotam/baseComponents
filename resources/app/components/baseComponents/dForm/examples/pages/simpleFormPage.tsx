
    import React from 'react';
    import {SimpleForm} from '../components/simpleForm';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const SimpleFormPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from 'baseComponents/dForm/configBuilder/passwordComponentConfig';
import React from 'react';

const formProps = new DFormConfig()
    .name('Test form')
    .confirmChanges(true)
    .addFields(new InputComponentConfig('login').label('Логин'), new PasswordComponentConfig('password').label('Пароль'))
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
};`
    return (
        <>
            <div>
                <SimpleForm />
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
