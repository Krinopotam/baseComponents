import React, {useCallback} from 'react';

import {Button} from 'baseComponents/button';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {DateTimeComponentConfig} from 'baseComponents/dForm/configBuilder/dateTimeComponentConfig';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';

interface IFields {
    object: string;
    nameIn: string;
    dateIn: string;
    nameOut: string;
    dateOut: string;
    vehicle: string;
    number: string;
}

const formApi = {} as IDFormModalApi;

const formProps = new DFormModalConfig<IFields>('Test form')
    .apiRef(formApi)
    .confirmChanges(true)
    .addTab(
        'Посетитель',
        new InputComponentConfig<IFields>('object').label('Объект'),

        new InputComponentConfig<IFields>('nameIn').label('Имя входящего').inlineGroup('row1'),
        new DateTimeComponentConfig<IFields>('dateIn').label('Дата входа').width(150).inlineGroup('row1'),

        new InputComponentConfig<IFields>('nameOut').label('Имя выходящего').inlineGroup('row2'),
        new DateTimeComponentConfig<IFields>('dateOut').label('Дата выхода').width(150).inlineGroup('row2')
    )
    .addTab(
        'Транспорт',
        new InputComponentConfig<IFields>('vehicle').label('Автомобиль'),
        new InputComponentConfig<IFields>('number').label('Номер')
    )
    .bodyHeight(330)
    .getConfig();

export const ModalFormWithTabsGroups = (): JSX.Element => {
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
