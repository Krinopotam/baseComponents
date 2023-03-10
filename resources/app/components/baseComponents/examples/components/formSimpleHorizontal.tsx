import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {PasswordComponentConfig} from "baseComponents/dForm/configBuilder/passwordComponentConfig";
import {InputComponentConfig} from "baseComponents/dForm/configBuilder/inputComponentConfig";
import {DFormConfig} from "baseComponents/dForm/configBuilder/dFormConfig";

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
    .layout('horizontal')
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormSimpleHorizontal = (): JSX.Element => {
    return (
        <>
            {/*Description Start*/}
            <h1>Пример простой формы горизонтальным расположением подписей полей</h1>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};
