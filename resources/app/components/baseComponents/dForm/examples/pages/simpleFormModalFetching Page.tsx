
    import React from 'react';
    import {SimpleFormModalFetching } from '../components/simpleFormModalFetching ';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const SimpleFormModalFetching Page = (): JSX.Element => {
    const source = `import React, {useCallback} from 'react';

import {Button} from 'antd';
import {DFormConfig} from 'components/dForm/configBuilder/dFormConfig';
import {DFormModal} from 'components/dFormModal/dFormModal';
import {IDFormModalApi} from 'components/dFormModal/hooks/api';
import {InputComponentConfig} from 'components/dForm/configBuilder/inputComponentConfig';

const formApi = {} as IDFormModalApi;

const formProps = new DFormConfig()
    .apiRef(formApi)
    .name('Test form')
    .formMode('update')
    .confirmChanges(true)
    .addFields(new InputComponentConfig('position').label('Должность'), new InputComponentConfig('department').label('Подразделение'))
    .callbacks({
        onDataFetch: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({message: 'Ошибка загрузки данных', code: 400});
                    else resolve({data: {position: 'Директор', department: 'Главная дирекция'}});
                }, 3000);
            });
        },
    })
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const SimpleFormModalFetching = (): JSX.Element => {
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
                <SimpleFormModalFetching  />
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
