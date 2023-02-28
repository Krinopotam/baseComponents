import React, {useCallback} from 'react';

import {Button} from 'antd';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';

const formApi = {} as IDFormModalApi;

const formProps = new DFormConfig()
    .apiRef(formApi)
    .name('Test form')
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
        formApi.open('update');
    }, []);

    return (
        <>
            {/*Description Start*/}
            <h1>Пример загрузки данных при открытии формы</h1>
            <p>Для обеспечения загрузки необходимо в калбэк onDataFetch передать функцию, возвращающую Promis, который при успешном ответе сервера (resolve) возвращает объект вида:</p>
            <code>{`data:{имя_поля1: "значение", имя_поля2: "значение 2"...}`}</code>
            <p></p>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <Button onClick={onClick}>Открыть форму</Button>
                <DFormModal {...formProps} />
            </div>
        </>
    );
};
