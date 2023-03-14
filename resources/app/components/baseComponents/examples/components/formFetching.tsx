import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';

interface IFields {
    position: string;
    department: string;
}

const formProps = new DFormConfig<IFields>('Test form')
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

export const FormFetching = (): JSX.Element => {
    return (
        <>
            {/*Description Start*/}
            <h1>Пример загрузки данных формы</h1>
            <p>
                Для обеспечения загрузки необходимо в калбэк onDataFetch передать функцию, возвращающую Promise, который при успешном ответе сервера (resolve)
                возвращает объект вида:
            </p>
            <code>{`data:{имя_поля1: "значение", имя_поля2: "значение 2"...}`}</code>
            <p>а при ошибке (reject)</p>
            <code>{`error:{message: string, code: number}`}</code>
            <p>Для примера, вероятность сбоя при загрузке 50%</p>
            <p></p>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};
