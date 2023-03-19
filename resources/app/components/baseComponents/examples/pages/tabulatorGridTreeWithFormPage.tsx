
    import React from 'react';
    import {TabulatorGridTreeWithForm} from '../components/tabulatorGridTreeWithForm';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TabulatorGridTreeWithFormPage = (): JSX.Element => {
    const source = `import React from 'react';
import TabulatorGrid, {IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {NumberComponentConfig} from 'baseComponents/dForm/configBuilder/numberComponentConfig';
import {TreeSelectComponentConfig} from 'baseComponents/dForm/configBuilder/treeSelectComponentConfig';

const columns: IReactTabulatorProps['columns'] = [
    {title: 'Name', field: 'name'},
    {title: 'Age', field: 'age', hozAlign: 'left', formatter: 'progress'},
    {title: 'Favourite Color', field: 'col'},
    {title: 'Date Of Birth', field: 'dob', hozAlign: 'center'},
    {title: 'Rating', field: 'rating', hozAlign: 'center', formatter: 'star'},
    {title: 'Passed?', field: 'passed', hozAlign: 'center', formatter: 'tickCross'},
];

const data: IGridRowData[] = [
    {
        id: '1',
        name: 'Oli Bob1',
        age: '12',
        col: 'red',
        dob: '',
        children: [
            {id: '1_1', name: 'Oli Bob1 Child 1', age: '4', col: 'green', dob: '22/05/20119'},
            {id: '1_2', name: 'Oli Bob1 Child 2', age: '2', col: 'orange', dob: '01/08/2021'},
            {
                id: '1_3',
                name: 'Oli Bob1 Child 3',
                age: '23',
                col: 'yellow',
                dob: '31/01/2000',
                children: [
                    {id: '1_3_1', name: 'Oli Bob1 Grandson 1', age: '1', col: 'blue', dob: '14/05/2022'},
                    {id: '1_3_2', name: 'Oli Bob1 Grandson 2', age: '2', col: 'green', dob: '22/05/2021'},
                    {id: '1_3_3', name: 'Oli Bob1 Grandson 3', age: '3', col: 'orange', dob: '01/08/2020'},
                ],
            },
            {id: '1_4', name: 'Oli Bob1 Child 4', age: '11', col: 'red', dob: '30/12/2012'},
        ],
    },
    {
        id: '2',
        name: 'Mary May1',
        age: '1',
        col: 'blue',
        dob: '14/05/1982',
        children: [
            {id: '2_1', name: 'Mary May1 Child 1', age: '4', col: 'green', dob: '22/05/20119'},
            {id: '2_2', name: 'Mary May1 Child 2', age: '2', col: 'orange', dob: '01/08/2021'},
            {
                id: '2_3',
                name: 'Mary May1 Child 3',
                age: '23',
                col: 'yellow',
                dob: '31/01/2000',
                children: [
                    {id: '2_3_1', name: 'Mary May1 Grandson 1', age: '1', col: 'blue', dob: '14/05/2022'},
                    {id: '2_3_2', name: 'Mary May1 Grandson 2', age: '2', col: 'green', dob: '22/05/2021'},
                    {id: '2_3_3', name: 'Mary May1 Grandson 3', age: '3', col: 'orange', dob: '01/08/2020'},
                ],
            },
            {id: '2_4', name: 'Mary May1 Child 4', age: '11', col: 'red', dob: '30/12/2012'},
        ],
    },
    {id: '3', name: 'Christine Lobowski1', age: '42', col: 'green', dob: '22/05/1982'},
    {id: '4', name: 'Brendon Philips1', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: '5', name: 'Margret Marmajuke1', age: '16', col: 'yellow', dob: '31/01/1999'},
    {id: '6', name: 'Oli Bob2', age: '12', col: 'red', dob: ''},
    {id: '7', name: 'Mary May2', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: '8', name: 'Christine Lobowski2', age: '42', col: 'green', dob: '22/05/1982'},
    {id: '9', name: 'Brendon Philips2', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: '10', name: 'Margret Marmajuke2', age: '16', col: 'yellow', dob: '31/01/1999'},
    {id: '11', name: 'Oli Bob3', age: '12', col: 'red', dob: ''},
    {id: '12', name: 'Mary May3', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: '13', name: 'Christine Lobowski3', age: '42', col: 'green', dob: '22/05/1982'},
    {id: '14', name: 'Brendon Philips3', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: '15', name: 'Margret Marmajuke3', age: '16', col: 'yellow', dob: '31/01/1999'},
    {id: '16', name: 'Oli Bob4', age: '12', col: 'red', dob: ''},
    {id: '17', name: 'Mary May4', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: '18', name: 'Christine Lobowski4', age: '42', col: 'green', dob: '22/05/1982'},
    {id: '19', name: 'Brendon Philips4', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: '20', name: 'Margret Marmajuke4', age: '16', col: 'yellow', dob: '31/01/1999'},
];

const treeSelectDataSet = [...data];

type IPerson = {
    id: string;
    parent: {id: string | number; name: string};
    name: string;
    age: number;
    col: string;
    dob: string;
};

const editFormConfig = new DFormModalConfig<IPerson>('gridEditForm')
    .addFields(
        new TreeSelectComponentConfig('parent').label('Родитель').dataSet(treeSelectDataSet).fieldNames({title:'name'}),
        new InputComponentConfig('name').label('Name'),
        new NumberComponentConfig('age').label('Age'),
        new InputComponentConfig('col').label('Favourite Color'),
        new InputComponentConfig('dob').label('Day of Birth')
    )
    .confirmChanges(true)
    .getConfig();

export const TabulatorGridTreeWithForm = (): JSX.Element => {
    return (
        <>
            <TabulatorGrid
                id={'TabulatorGridTreeWithForm'}
                columns={columns}
                dataSet={data}
                dataTree={true}
                height={500}
                layout={'fitColumns'}
                editFormProps={editFormConfig}
                confirmDelete
                multiSelect
            />
        </>
    );
};
`
    return (
        <>
            <div>
                <TabulatorGridTreeWithForm />
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
