
    import React from 'react';
    import {MrGridSimple} from '../components/mrGridSimple';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const MrGridSimplePage = (): JSX.Element => {
    const source = `import React from 'react';
import MRGrid from "baseComponents/mrGrid/mrGrid";
import {MRT_ColumnDef} from "material-react-table";

type Person = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
    };
    address: string;
    city: string;
    state: string;
    children?: Person[];
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
        name: {
            firstName: 'John',
            lastName: 'Doe',
        },
        address: '261 Erman Ford',
        city: 'East Daphne',
        state: 'Kentucky',
        children: [
            {
                id: '1_1',
                name: {
                    firstName: 'John Child 1',
                    lastName: 'Doe Child 1',
                },
                address: '769 Dominic Grove child 1',
                city: 'Columbus child 1',
                state: 'Ohio child 1',
                children: [
                    {
                        id: '1_1_1',
                        name: {
                            firstName: 'John Child 1_1',
                            lastName: 'Doe Child 1_1',
                        },
                        address: '769 Dominic Grove child 1_1',
                        city: 'Columbus child 1_1',
                        state: 'Ohio child 1_1',
                    },
                    {
                        id: '1_1_2',
                        name: {
                            firstName: 'John Child 1_2',
                            lastName: 'Doe Child 1_2',
                        },
                        address: '769 Dominic Grove child 1_2',
                        city: 'Columbus child 1_2',
                        state: 'Ohio child 1_2',
                    },
                ],
            },
            {
                id: '1_2',
                name: {
                    firstName: 'John Child 2',
                    lastName: 'Doe Child 2',
                },
                address: '769 Dominic Grove child 2',
                city: 'Columbus child 2',
                state: 'Ohio child 2',
            },
        ],
    },
    {
        id: '2',
        name: {
            firstName: 'Jane',
            lastName: 'Doe',
        },
        address: '769 Dominic Grove',
        city: 'Columbus',
        state: 'Ohio',
    },
    {
        id: '3',
        name: {
            firstName: 'Joe',
            lastName: 'Doe',
        },
        address: '566 Brace Inlet',
        city: 'South Linda',
        state: 'West Virginia',
    },
    {
        id: '4',
        name: {
            firstName: 'Kevin',
            lastName: 'Vend',
        },
        address: '722 Emily Stream',
        city: 'Lincoln',
        state: 'Nebraska',
    },
    {
        id: '5',
        name: {
            firstName: 'Joshua',
            lastName: 'Rudolf',
        },
        address: '32188 Lark Turnpike',
        city: 'Omaha',
        state: 'Nebraska',
    },
];
export const MrGridSimple = (): JSX.Element => {
    return (
        <>
            <MRGrid dataSet={gridDataSet} columns={columns}/>
        </>
    );
};
`
    return (
        <>
            <div>
                <MrGridSimple />
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
