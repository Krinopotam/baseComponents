import 'tabulator-tables/dist/css/tabulator_simple.css';
import React from 'react';
import ReactTabulator, {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {Stylization} from 'baseComponents/tabulatorGrid/stylization';

const columns: IReactTabulatorProps['columns'] = [
    {title: 'Name', field: 'name'},
    {title: 'Age', field: 'age', hozAlign: 'left', formatter: 'progress'},
    {title: 'Favourite Color', field: 'col'},
    {title: 'Date Of Birth', field: 'dob', hozAlign: 'center'},
    {title: 'Rating', field: 'rating', hozAlign: 'center', formatter: 'star'},
    {title: 'Passed?', field: 'passed', hozAlign: 'center', formatter: 'tickCross'},
];

const data: IReactTabulatorProps['data'] = [
    {id: 1, name: 'Oli Bob', age: '12', col: 'red', dob: ''},
    {id: 2, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: 3, name: 'Christine Lobowski', age: '42', col: 'green', dob: '22/05/1982'},
    {id: 4, name: 'Brendon Philips', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: 5, name: 'Margret Marmajuke', age: '16', col: 'yellow', dob: '31/01/1999'},
    {id: 6, name: 'Oli Bob', age: '12', col: 'red', dob: ''},
    {id: 7, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: 8, name: 'Christine Lobowski', age: '42', col: 'green', dob: '22/05/1982'},
    {id: 9, name: 'Brendon Philips', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: 10, name: 'Margret Marmajuke', age: '16', col: 'yellow', dob: '31/01/1999'},
    {id: 11, name: 'Oli Bob', age: '12', col: 'red', dob: ''},
    {id: 12, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: 13, name: 'Christine Lobowski', age: '42', col: 'green', dob: '22/05/1982'},
    {id: 14, name: 'Brendon Philips', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: 15, name: 'Margret Marmajuke', age: '16', col: 'yellow', dob: '31/01/1999'},
    {id: 16, name: 'Oli Bob', age: '12', col: 'red', dob: ''},
    {id: 17, name: 'Mary May', age: '1', col: 'blue', dob: '14/05/1982'},
    {id: 18, name: 'Christine Lobowski', age: '42', col: 'green', dob: '22/05/1982'},
    {id: 19, name: 'Brendon Philips', age: '125', col: 'orange', dob: '01/08/1980'},
    {id: 20, name: 'Margret Marmajuke', age: '16', col: 'yellow', dob: '31/01/1999'},
];

export const TabulatorGrid = (): JSX.Element => {
    return (
        <>
            <Stylization />
            <ReactTabulator
                data={data}
                columns={columns}
                //options={options}
                layout={'fitColumns'}
                height={300}
                width={'100%'}
                selectable={true}

                events={{
                    headerClick: () => {
                        alert('!!!!!');
                    },
                }}
            />
        </>
    );
};
