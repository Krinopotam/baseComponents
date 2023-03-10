
    import React from 'react';
    import {SimpleFormSubmitting} from '../components/simpleFormSubmitting';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const SimpleFormSubmittingPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from 'baseComponents/dForm/configBuilder/passwordComponentConfig';
import React from 'react';

interface IFields {
    login: string;
    password: string;
}

const formProps = new DFormConfig<IFields>()
    .name('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig('login').label('Логин'),
        new PasswordComponentConfig('password').label('Пароль')
    )
    .callbacks({
        onSubmit: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({ message: 'Ошибка сохранения', code: 400 });
                    else resolve({data:{result:'OK'}});
                }, 3000); 
            });
        },
    })
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const SimpleFormSubmitting = (): JSX.Element => {
    return (
        <div style={{maxWidth: 500}}>
            <DForm {...formProps} />
        </div>
    );
};`
    return (
        <>
            <div>
                <SimpleFormSubmitting />
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
