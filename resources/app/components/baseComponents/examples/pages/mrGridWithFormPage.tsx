
    import React from 'react';
    import {MrGridWithForm} from '../components/mrGridWithForm';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const MrGridWithFormPage = (): JSX.Element => {
    const source = `import React from 'react';
import MRGrid from 'baseComponents/mrGrid/mrGrid';
import {MRT_ColumnDef} from 'material-react-table';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';

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
        accessorKey: 'firstName',
        header: 'First Name',
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'address',
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

const mgGridFormConfig = new DFormModalConfig<Person>().layout('horizontal')
    .addFields(
        new InputComponentConfig('firstName').label('Имя'),
        new InputComponentConfig('lastName').label('Фамилия'),
        new InputComponentConfig('address').label('Адрес'),
        new InputComponentConfig('city').label('Город'),
        new InputComponentConfig('state').label('Штат')
    ).confirmChanges(true)
    .getConfig();

export const MrGridWithForm = (): JSX.Element => {
    return (
        <>
            <MRGrid dataSet={gridDataSet} columns={columns} editFormProps={mgGridFormConfig} confirmDelete />
        </>
    );
};
`
    return (
        <>
            <div>
                <MrGridWithForm />
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