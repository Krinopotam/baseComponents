import React from 'react';
import MRGrid from 'baseComponents/mrGrid/mrGrid';
import {MRT_ColumnDef} from 'material-react-table';

type Person = {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
};

//should be memoized or stable
const columns: MRT_ColumnDef[] = [
    {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
    },
    {
        accessorKey: 'name.lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        accessorKey: 'state',
        header: 'State',
    },
];

const gridDataSet: Person[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address: '261 Erman Ford',
        city: 'East Daphne',
        state: 'Kentucky',
    },
    {
        id: '2',

        firstName: 'Jane',
        lastName: 'Doe',
        address: '769 Dominic Grove',
        city: 'Columbus',
        state: 'Ohio',
    },
    {
        id: '3',

        firstName: 'Joe',
        lastName: 'Doe',

        address: '566 Brace Inlet',
        city: 'South Linda',
        state: 'West Virginia',
    },
    {
        id: '4',
        firstName: 'Kevin',
        lastName: 'Vend',
        address: '722 Emily Stream',
        city: 'Lincoln',
        state: 'Nebraska',
    },
    {
        id: '5',
        firstName: 'Joshua',
        lastName: 'Rudolf',
        address: '32188 Lark Turnpike',
        city: 'Omaha',
        state: 'Nebraska',
    },
];
export const MrGridSimple = (): JSX.Element => {
    return (
        <>
            {/*Description Start*/}
            <h1>Пример простого грида</h1>
            {/*Description End*/}
            <MRGrid dataSet={gridDataSet} columns={columns} />
        </>
    );
};
