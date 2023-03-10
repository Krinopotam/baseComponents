import React, {useCallback} from 'react';

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
            {/*Description Start*/}
            <h1>Пример сохранения данных модальной формы</h1>
            <p>Для обеспечения сохранения необходимо в калбэк onSubmit передать функцию, возвращающую Promise, который при успешном ответе сервера (resolve) возвращает объект вида:</p>
            <code>{'data:{имя_поля1: "значение", имя_поля2: "значение 2"...}'}</code>
            <p>а при ошибке (reject)</p>
            <code>{'error:{message: string, code: number}'}</code>
            <p>Для примера, вероятность сбоя при сохранении 50%</p>
            <p></p>
            {/*Description End*/}
        <div style={{maxWidth: 500}}>
            <Button onClick={onClick}>Открыть форму</Button>
            <DFormModal {...formProps} />
        </div>
            </>
    );
};
