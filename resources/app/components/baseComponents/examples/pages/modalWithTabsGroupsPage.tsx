
    import React from 'react';
    import {ModalWithTabsGroups} from '../components/modalWithTabsGroups';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const ModalWithTabsGroupsPage = (): JSX.Element => {
    const source = `import React, {useCallback} from 'react';

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

const formProps = new DFormModalConfig<IFields>()
    .apiRef(formApi)
    .name('Test form')
    .confirmChanges(true)
    .addTab(
        'Посетитель',
        new InputComponentConfig('object').label('Объект'),

        new InputComponentConfig('nameIn').label('Имя входящего').inlineGroup('row1'),
        new DateTimeComponentConfig('dateIn').label('Дата входа').width(150).inlineGroup('row1'),

        new InputComponentConfig('nameOut').label('Имя выходящего').inlineGroup('row2'),
        new DateTimeComponentConfig('dateOut').label('Дата выхода').width(150).inlineGroup('row2')
    )
    .addTab('Транспорт',
        new InputComponentConfig('vehicle').label('Автомобиль'),
        new InputComponentConfig('number').label('Номер')
    ).getConfig();

export const ModalWithTabsGroups = (): JSX.Element => {
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
`
    return (
        <>
            <div>
                <ModalWithTabsGroups />
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