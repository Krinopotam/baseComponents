import React, {useCallback} from 'react';

import {Button} from 'baseComponents/button';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {DateTimeComponentConfig} from 'baseComponents/dForm/configBuilder/dateTimeComponentConfig';

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
        'Входы', new InputComponentConfig('nameIn').label('Имя входящего'), 
        new DateTimeComponentConfig('dateIn').label('Дата входа')
    )
    .addTab(
        'Выходы',
        new InputComponentConfig('nameOut').label('Имя выходящего').inlineGroup('row1'),
        new DateTimeComponentConfig('dateOut').label('Дата выхода').inlineGroup('row1')
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
