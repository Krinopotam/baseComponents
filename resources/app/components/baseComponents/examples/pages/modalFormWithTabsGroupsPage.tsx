
    import React from 'react';
    import {ModalFormWithTabsGroups} from '../components/modalFormWithTabsGroups';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const ModalFormWithTabsGroupsPage = (props: {darkMode: boolean}): JSX.Element => {
    // language=text
    const source = `// noinspection DuplicatedCode

import React, {useCallback} from 'react';
import {Button} from '@krinopotam/ui-button';
import {IDFormModalApi} from '@krinopotam/ui-dynamic-form-modal/hooks/api';
import {DFormModal} from '@krinopotam/ui-dynamic-form-modal';
import {DFormModalConfig} from '@krinopotam/ui-dynamic-form-modal/configBuilder/dFormModalConfig';
import {InputComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/inputComponentConfig';
import {DateTimeComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/dateTimeComponentConfig';

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
`
    return (
        <>
            <div>
                <ModalFormWithTabsGroups />
            </div>
            <Divider />
            <div>
                <SyntaxHighlighter language="javascript" style={props.darkMode ? darcula : docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
