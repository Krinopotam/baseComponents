
    import React from 'react';
    import {ModalWithGroups} from '../components/modalWithGroups';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const ModalWithGroupsPage = (): JSX.Element => {
    const source = `import React, {useCallback} from 'react';

import {Button} from 'baseComponents/button';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {DateTimeComponentConfig} from '../../configBuilder/dateTimeComponentConfig';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from '../../../dForm/configBuilder/inputComponentConfig';

const formApi = {} as IDFormModalApi;

const formProps = new DFormModalConfig()
    .apiRef(formApi)
    .name('Test form')
    .confirmChanges(true)
    .addFields({
        Row1: [
            new InputComponentConfig('nameIn').label('Имя входящего'),
            new DateTimeComponentConfig('dateIn').label('Дата входа').width(150)
        ],
        Row2: [
            new InputComponentConfig('nameOut').label('Имя выходящего'),
            new DateTimeComponentConfig('dateOut').label('Дата выхода').width(150)
        ],
    })

    .getConfig();

export const ModalWithGroups = (): JSX.Element => {
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
                <ModalWithGroups />
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
