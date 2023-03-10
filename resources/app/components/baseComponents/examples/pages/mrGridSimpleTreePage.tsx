
    import React from 'react';
    import {MrGridSimpleTree} from '../components/mrGridSimpleTree';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const MrGridSimpleTreePage = (): JSX.Element => {
    const source = `import React from 'react';
import MRGrid from 'baseComponents/mrGrid/mrGrid';
import {MRT_ColumnDef} from 'material-react-table';

type Person = {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    children?: Person[];
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
        children: [
            {
                id: '1_1',
                firstName: 'John Child 1',
                lastName: 'Doe Child 1',
                address: '769 Dominic Grove child 1',
                city: 'Columbus child 1',
                state: 'Ohio child 1',
                children: [
                    {
                        id: '1_1_1',
                        firstName: 'John Child 1_1',
                        lastName: 'Doe Child 1_1',
                        address: '769 Dominic Grove child 1_1',
                        city: 'Columbus child 1_1',
                        state: 'Ohio child 1_1',
                    },
                    {
                        id: '1_1_2',
                        firstName: 'John Child 1_2',
                        lastName: 'Doe Child 1_2',
                        address: '769 Dominic Grove child 1_2',
                        city: 'Columbus child 1_2',
                        state: 'Ohio child 1_2',
                    },
                ],
            },
            {
                id: '1_2',
                firstName: 'John Child 2',
                lastName: 'Doe Child 2',
                address: '769 Dominic Grove child 2',
                city: 'Columbus child 2',
                state: 'Ohio child 2',
            },
        ],
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
export const MrGridSimpleTree = (): JSX.Element => {
    return (
        <>
            <MRGrid dataSet={gridDataSet} columns={columns} treeMode={true} />
        </>
    );
};
`
    return (
        <>
            <div>
                <MrGridSimpleTree />
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
