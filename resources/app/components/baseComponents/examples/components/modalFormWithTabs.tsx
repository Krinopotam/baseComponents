// noinspection DuplicatedCode

import React, {useCallback} from 'react';
import {Button} from '@krinopotam/ui-button';
import {IDFormModalApi, DFormModal} from '@krinopotam/ui-dynamic-form-modal';
import {DFormModalConfig, DateTimeComponentConfig, InputComponentConfig} from '@krinopotam/ui-dynamic-form-modal/configBuilder';

interface IFields {
    nameIn: string;
    dateIn: string;
    nameOut: string;
    dateOut: string;
}

const formApi = {} as IDFormModalApi;

const formProps = new DFormModalConfig<IFields>('Test form')
    .apiRef(formApi)
    .confirmChanges(true)
    .addTab(
        'Входы',
        new InputComponentConfig<IFields>('nameIn').label('Имя входящего'),
        new DateTimeComponentConfig<IFields>('dateIn').label('Дата входа')
    )
    .addTab(
        'Выходы',
        new InputComponentConfig<IFields>('nameOut').label('Имя выходящего').inlineGroup('row1'),
        new DateTimeComponentConfig<IFields>('dateOut').label('Дата выхода').inlineGroup('row1')
    )
    .bodyHeight(250)
    .getConfig();

export const ModalFormWithTabs = (): JSX.Element => {
    const onClick = useCallback(() => {
        formApi.open('create');
    }, []);

    return (
        <div style={{maxWidth: 500}}>
            <Button onClick={onClick}>Открыть форму</Button>
            <DFormModal {...formProps} />
        </div>
    );
};
