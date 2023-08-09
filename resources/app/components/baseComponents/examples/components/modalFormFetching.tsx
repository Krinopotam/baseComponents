// noinspection DuplicatedCode

import React, {useCallback} from 'react';
import {Button} from '@krinopotam/ui-button';
import {IDFormModalApi} from '@krinopotam/ui-dynamic-form-modal/hooks/api';
import {DFormModal} from '@krinopotam/ui-dynamic-form-modal';
import {DFormConfig} from '@krinopotam/ui-dynamic-form/configBuilder/dFormConfig';
import {InputComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/inputComponentConfig';

interface IFields {
    position: string;
    department: string;
}

const formApi = {} as IDFormModalApi;

const formProps = new DFormConfig<IFields>('Test form')
    .apiRef(formApi)
    .confirmChanges(true)
    .addFields(
        new InputComponentConfig<IFields>('position').label('Должность'),
        new InputComponentConfig<IFields>('department').label('Подразделение'))
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

export const ModalFormFetching = (): JSX.Element => {
    const onClick = useCallback(() => {
        formApi.open('update');
    }, []);

    return (
        <>
            {/*Description Start*/}
            <h1>Пример загрузки данных при открытии формы</h1>
            <p>Для обеспечения загрузки необходимо в калбэк onDataFetch передать функцию, возвращающую Promise, который при успешном ответе сервера (resolve) возвращает объект вида:</p>
            <code>{`data:{имя_поля1: "значение", имя_поля2: "значение 2"...}`}</code>
            <p>а при ошибке (reject)</p>
            <code>{`error:{message: string, code: number}`}</code>
            <p>Для примера, вероятность сбоя при загрузке 50%</p>
            <p></p>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <Button onClick={onClick}>Открыть форму</Button>
                <DFormModal {...formProps} />
            </div>
        </>
    );
};
