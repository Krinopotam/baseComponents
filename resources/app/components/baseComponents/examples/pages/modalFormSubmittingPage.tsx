
    import React from 'react';
    import {ModalFormSubmitting} from '../components/modalFormSubmitting';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const ModalFormSubmittingPage = (): JSX.Element => {
    const source = `import React, {useCallback} from 'react';

import {Button} from 'antd';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from 'baseComponents/dForm/configBuilder/passwordComponentConfig';
import {DFormModalConfig} from "baseComponents/dForm/configBuilder/dFormModalConfig";

interface IFields {
    login: string;
    password: string;
}

const formApi = {} as IDFormModalApi;

const formProps = new DFormModalConfig<IFields>()
    .apiRef(formApi)
    .name('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig('login').label('Логин'),
        new PasswordComponentConfig('password').label('Пароль'))
    .callbacks({
        onSubmit: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({message: 'Ошибка сохранения', code: 400});
                    else resolve({data: {login: 'new login', password: 'new password'}});
                }, 3000);
            });
        },
    })
    .getConfig();

export const ModalFormSubmitting = (): JSX.Element => {
    const onClick = useCallback(() => {
        formApi.open('create');
    }, []);

    return (
        <>
        <div style={{maxWidth: 500}}>
            <Button onClick={onClick}>Открыть форму</Button>
            <DFormModal {...formProps} />
        </div>
            </>
    );
};
`
    return (
        <>
            <div>
                <ModalFormSubmitting />
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
