
    import React from 'react';
    import {ModalWithTabs} from '../components/modalWithTabs';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const ModalWithTabsPage = (): JSX.Element => {
    const source = `import React, { useCallback } from 'react';

import {Button} from 'baseComponents/button';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import { DateTimeComponentConfig } from '../../configBuilder/dateTimeComponentConfig';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';

const formApi = {} as IDFormModalApi;

const formProps = new DFormModalConfig()
    .apiRef(formApi)
    .name('Test form')
    .confirmChanges(true)
    .addTab(
        'Входы',
        new InputComponentConfig('nameIn').label('Имя входящего'),
        new DateTimeComponentConfig('dateIn').label('Дата входа')
    )
    .addTab(
        'Выходы',
        new InputComponentConfig('nameOut').label('Имя выходящего'),
        new DateTimeComponentConfig('dateOut').label('Дата выхода')
    )
    .getConfig();

    console.log(formProps);
    

export const ModalWithTabs = (): JSX.Element => {
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
                <ModalWithTabs />
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
