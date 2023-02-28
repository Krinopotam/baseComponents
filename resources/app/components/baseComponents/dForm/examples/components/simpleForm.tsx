import {DForm} from 'baseComponents/dForm/dForm';
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
            {/*Description Start*/}
            <h1>Пример простой формы</h1>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};