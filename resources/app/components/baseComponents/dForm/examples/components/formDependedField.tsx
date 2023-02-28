import {DForm} from 'baseComponents/dForm/dForm';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import React from 'react';

const formProps = new DFormConfig()
    .name('Test form')
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig('field1').label('Поле 1').placeholder('Введите что-нибудь'),
        new InputComponentConfig('field2')
            .label('Поле 2 (зависит от Поля 1)')
            .placeholder('Меня не видно, если поле 1 пусто. Введите что-нибудь')
            .dependsOn(['field1']),
        new InputComponentConfig('field3')
            .label('Поле 3 (зависит от Поля 1 и 2)')
            .placeholder('Меня не видно, если поля 1 и 2 пусты')
            .dependsOn(['field1', 'field2'])
    )
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormDependedField = (): JSX.Element => {
    return (
        <div style={{maxWidth: 500}}>
            <DForm {...formProps} />
        </div>
    );
};
