import {DForm} from 'baseComponents/dForm/dForm';
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
    .addFields(new InputComponentConfig('login').label('Логин'), new PasswordComponentConfig('password').label('Пароль'))
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
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormSubmitting = (): JSX.Element => {
    return (
        <>
            {/*Description Start*/}
            <h1>Пример сохранения данных формы</h1>
            <p>
                Для обеспечения сохранения необходимо в калбэк onSubmit передать функцию, возвращающую Promise, который при успешном ответе сервера (resolve)
                возвращает объект вида:
            </p>
            <code>{`data:{имя_поля1: "значение", имя_поля2: "значение 2"...}`}</code>
            <p>а при ошибке (reject)</p>
            <code>{`error:{message: string, code: number}`}</code>
            <p>Для примера, вероятность сбоя при сохранении 50%</p>
            <p></p>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};
