import React, {useCallback} from 'react';

import {Button} from 'baseComponents/button';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {MrGridComponentConfig} from 'baseComponents/dForm/configBuilder/mrGridComponentConfig';
import {MRT_ColumnDef} from "material-react-table";

interface IFields {
    permissions: Record<string, unknown>[];
}

type Person = {
    id: string;
    firstName: string;
    lastName: string;
    permission: string;
};

//should be memoized or stable
const columns: MRT_ColumnDef[] = [
    {
        accessorKey: 'firstName',
        header: 'Имя',
    },
    {
        accessorKey: 'lastName',
        header: 'Фамилия',
    },
    {
        accessorKey: 'permission',
        header: 'Доступ',
    },
];

const gridDataSet: Person[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        permission: 'write',
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        permission: 'read',
    },
    {
        id: '3',
        firstName: 'Joe',
        lastName: 'Doe',
        permission: 'write',
    },
    {
        id: '4',
        firstName: 'Kevin',
        lastName: 'Vend',
        permission: 'write',
    },
    {
        id: '5',
        firstName: 'Joshua',
        lastName: 'Rudolf',
        permission: 'Read',
    },
];


const formApi = {} as IDFormModalApi;

const formProps = new DFormModalConfig<IFields>()
    .apiRef(formApi)
    .name('Test form')
    .confirmChanges(true)
    .addFields(new MrGridComponentConfig('permissions').label('Полномочия').columns(columns).dataSet(gridDataSet))
    .getConfig();

export const ModalWithGrid = (): JSX.Element => {
    const onClick = useCallback(() => {
        formApi.open('create');
    }, []);

    return (
        <>
            {/*Description Start*/}
            <h1>Пример модальной формы с простым гридом</h1>
            {/*Description End*/}

            <div style={{maxWidth: 500}}>
                <Button onClick={onClick}>Открыть форму</Button>
                <DFormModal {...formProps} />
            </div>
        </>
    );
};
