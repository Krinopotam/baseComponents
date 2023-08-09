
    import React from 'react';
    import {ModalFormWithGrid} from '../components/modalFormWithGrid';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {darcula, docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const ModalFormWithGridPage = (props: {darkMode: boolean}): JSX.Element => {
    // language=text
    const source = `// noinspection DuplicatedCode

import React, {useCallback} from 'react';
import {Button} from '@krinopotam/ui-button';
import {IDFormModalApi} from '@krinopotam/ui-dynamic-form-modal/hooks/api';
import {DFormModal} from '@krinopotam/ui-dynamic-form-modal';
import {DFormModalConfig} from '@krinopotam/ui-dynamic-form-modal/configBuilder/dFormModalConfig';
import {InputComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/inputComponentConfig';
import {NumberComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/numberComponentConfig';
import {IReactTabulatorProps, IGridRowData} from "@krinopotam/ui-tabulator-grid";
import {TabulatorGridComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/tabulatorGridComponentConfig';

/** Tabulator grid edit form type */
type IPerson = {
    id: string;
    name: string;
    age: number;
    col: string;
    dob: string;
};

/** Main modal form type */
interface IUsers {
    users: Record<string, unknown>[];
}

const columns: IReactTabulatorProps['columns'] = [
    {title: 'Name', field: 'name'},
    {title: 'Age', field: 'age', hozAlign: 'left', formatter: 'progress'},
    {title: 'Favourite Color', field: 'col'},
    {title: 'Date Of Birth', field: 'dob', hozAlign: 'center'},
    {title: 'Rating', field: 'rating', hozAlign: 'center', formatter: 'star'},
    {title: 'Passed?', field: 'passed', hozAlign: 'center', formatter: 'tickCross'},
];

const gridDefaultData: IGridRowData[] = [
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

const formApi = {} as IDFormModalApi;

/** Tabulator edit form props */
const editFormProps = new DFormModalConfig<IPerson>('gridEditForm')
    .layout('horizontal')
    .addFields(
        new InputComponentConfig<IPerson>('name').label('Name'),
        new NumberComponentConfig<IPerson>('age').label('Age'),
        new InputComponentConfig<IPerson>('col').label('Favourite Color'),
        new InputComponentConfig<IPerson>('dob').label('Day of Birth')
    )
    .confirmChanges(true)
    .getConfig();

/** main modal form props */
const formProps = new DFormModalConfig<IUsers>('Test form')
    .apiRef(formApi)
    .confirmChanges(true)
    .addFields(
        new TabulatorGridComponentConfig<IUsers>('users')
            .label('Пользователи')
            .columns(columns)
            .layout('fitColumns')
            //.default(gridDefaultData)
            .height(300)
            .editFormProps(editFormProps)
            .confirmDelete(true)
    )
    .width(900)
    .getConfig();

export const ModalFormWithGrid = (): JSX.Element => {
    const onClick = useCallback(() => {
        formApi.open('update', {users: gridDefaultData});
    }, []);

    return (
        <>

            <div style={{maxWidth: 500}}>
                <Button onClick={onClick}>Открыть форму</Button>
                <DFormModal {...formProps} />
            </div>
        </>
    );
};
`
    return (
        <>
            <div>
                <ModalFormWithGrid />
            </div>
            <Divider />
            <div>
                <SyntaxHighlighter language="javascript" style={props.darkMode ? darcula : docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
