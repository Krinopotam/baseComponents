
    import React from 'react';
    import {TabulatorGridWithFormAsync} from '../components/tabulatorGridWithFormAsync';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TabulatorGridWithFormAsyncPage = (): JSX.Element => {
    const source = `import React from 'react';
import TabulatorGrid, {IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {NumberComponentConfig} from 'baseComponents/dForm/configBuilder/numberComponentConfig';

type Person = {
    id: string;
    name: string;
    age: number;
    col: string;
    dob: string;
};

const columns: IReactTabulatorProps['columns'] = [
    {title: 'Name', field: 'name'},
    {title: 'Age', field: 'age', hozAlign: 'left', formatter: 'progress'},
    {title: 'Favourite Color', field: 'col'},
    {title: 'Date Of Birth', field: 'dob', hozAlign: 'center'},
    {title: 'Rating', field: 'rating', hozAlign: 'center', formatter: 'star'},
    {title: 'Passed?', field: 'passed', hozAlign: 'center', formatter: 'tickCross'},
];

const dataSet: IGridRowData[] = [
    {id: '1', name: 'Oli Bob1', age: '12', col: 'red', dob: ''},
    {id: '2', name: 'Mary May1', age: '1', col: 'blue', dob: '14/05/1982'},
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

const editFormConfig = new DFormModalConfig<Person>()
    .layout('horizontal')
    .addFields(
        new InputComponentConfig('name').label('Name'),
        new NumberComponentConfig('age').label('Age'),
        new InputComponentConfig('col').label('Favourite Color'),
        new InputComponentConfig('dob').label('Day of Birth')
    )
    .confirmChanges(true)
    .callbacks({
        onSubmit: (values) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({message: 'Ошибка сохранения', code: 400});
                    else resolve({data: values});
                }, 2000);
            });
        },
    })
    .getConfig();

export const TabulatorGridWithFormAsync = (): JSX.Element => {
    return (
        <>
            <TabulatorGrid
                columns={columns}
                editFormProps={editFormConfig}
                confirmDelete
                callbacks={{
                    onDataFetch: () => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (Math.random() < 0.3) reject({message: 'Ошибка загрузки данных', code: 400});
                                else resolve({data: dataSet});
                            }, 2000);
                        });
                    },
                    onDelete: () => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (Math.random() < 0.3) reject({message: 'Ошибка удаления строк', code: 400});
                                else resolve({data: {result: 'OK'}});
                            }, 2000);
                        });
                    },
                }}
            />
        </>
    );
};
`
    return (
        <>
            <div>
                <TabulatorGridWithFormAsync />
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
