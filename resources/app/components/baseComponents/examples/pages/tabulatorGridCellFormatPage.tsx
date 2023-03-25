
    import React from 'react';
    import {TabulatorGridCellFormat} from '../components/tabulatorGridCellFormat';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TabulatorGridCellFormatPage = (): JSX.Element => {
    const source = `import React from 'react';
import TabulatorGrid, {IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {ColumnDefinition} from 'tabulator-tables';

const data: IGridRowData[] = [
    {id: '01', surname: 'Иванов', name: 'Иван', patronymic: 'Иванович', email: 'ivanov@mail.ru', birthday: '11.01.1980'},
    {id: '02', surname: 'Петров', name: 'Петр', patronymic: 'Петрович', email: 'petrov@mail.ru', birthday: '15.02.1975'},
    {id: '03', surname: 'Сидоров', name: 'Сидр', patronymic: 'Сидорович', email: 'sidorov@mail.ru', birthday: '17.03.1981'},
    {id: '04', surname: 'Смирнов', name: 'Смирен', patronymic: 'Смирнович', email: 'smirnov@mail.ru', birthday: '11.01.1958'},
    {id: '05', surname: 'Самойлов', name: 'Самойл', patronymic: 'Самойлович', email: 'samoylov@mail.ru', birthday: '15.02.1937'},
    {id: '06', surname: 'Арсенов', name: 'Арсен', patronymic: 'Арсенович', email: 'arsenov@mail.ru', birthday: '13.04.1989'},
    {id: '07', surname: 'Дмитриев', name: 'Дмитрий', patronymic: 'Дмитриевич', email: 'dmitriev@mail.ru', birthday: '31.08.1971'},
    {id: '08', surname: 'Александров', name: 'Александр', patronymic: 'Александрович', email: 'aleksandrov@mail.ru', birthday: '01.12.1956'},
    {id: '09', surname: 'Васильев', name: 'Василий', patronymic: 'Васильевич', email: 'vasilyev@mail.ru', birthday: '09.11.1969'},
    {id: '10', surname: 'Денисов', name: 'Денис', patronymic: 'Денисович', email: 'denisov@mail.ru', birthday: '21.04.1978'},
    {id: '11', surname: 'Максимов', name: 'Максим', patronymic: 'Максимович', email: 'maksimov@mail.ru', birthday: '10.08.1977'},
    {id: '12', surname: 'Протасов', name: 'Протас', patronymic: 'Протасович', email: 'protasov@mail.ru', birthday: '25.08.1973'},
    {id: '13', surname: 'Алексеев', name: 'Алексей', patronymic: 'Алексеевич', email: 'alekseev@mail.ru', birthday: '19.12.1985'},
    {id: '14', surname: 'Сергеев', name: 'Сергей', patronymic: 'Сергеевич', email: 'sergeev@mail.ru', birthday: '22.07.1990'},
    {id: '15', surname: 'Артемьев', name: 'Артем', patronymic: 'Артемович', email: 'artemyev@mail.ru', birthday: '06.11.1995'},
    {id: '16', surname: 'Демидов', name: 'Демид', patronymic: 'Демидович', email: 'demidov@mail.ru', birthday: '11.02.1997'},
    {id: '17', surname: 'Кимов', name: 'Ким', patronymic: 'Кимович', email: 'kimov@mail.ru', birthday: '18.01.1988'},
    {id: '18', surname: 'Абгазов', name: 'Абгаз', patronymic: 'Абгазович', email: 'abgazov@mail.ru', birthday: '03.09.1985'},
    {id: '19', surname: 'Мансуров', name: 'Мансур', patronymic: 'Мансурович', email: 'mansurov@mail.ru', birthday: '02.05.1995'},
    {id: '20', surname: 'Андросов', name: 'Андрей', patronymic: 'Андреевич', email: 'androsov@mail.ru', birthday: '10.04.1966'},
];

const fioFormatter: ColumnDefinition['formatter'] = (cell) => {
    //cell - the cell component
    //formatterParams - parameters set for the column
    //onRendered - function to call when the formatter has been rendered
    const row = cell.getRow();
    const rowData = row.getData();
    return \`<span>\${rowData['surname']} \${rowData['name']} \${rowData['patronymic']}</span><br/><small style="color:#808080;">\${rowData['email']}</small>\`; //return the contents of the cell;
};

const fioFilter: ColumnDefinition['headerFilterFunc'] = (headerValue, _rowValue, rowData) => {
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    //must return a boolean, true if it passes the filter.
    const rowString = \`\${rowData['surname']} \${rowData['name']} \${rowData['patronymic']} (\${rowData['email']})\`.toLowerCase();
    return rowString.indexOf(headerValue.toLowerCase()) >= 0;
};

const fioSorter: ColumnDefinition['sorter'] = (_a, _b, aRow, bRow): number => {
    //a, b - the two values being compared
    //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
    //column - the column component for the column being sorted
    //dir - the direction of the sort ("asc" or "desc")
    //sorterParams - sorterParams object from column definition array
    const rowDataA = aRow.getData();
    const rowDataB = bRow.getData();
    const valA = \`\${rowDataA['surname']} \${rowDataA['name']} \${rowDataA['patronymic']} (\${rowDataA['email']})\`;
    const valB = \`\${rowDataB['surname']} \${rowDataB['name']} \${rowDataB['patronymic']} (\${rowDataB['email']})\`;

    if (valA === valB) return 0;
    return valA > valB ? 1 : -1; //you must return the difference between the two values
};

const columns: IReactTabulatorProps['columns'] = [
    {
        title: 'ФИО',
        field: 'fio',
        formatter: fioFormatter,
        headerFilterFunc: fioFilter,
        sorter: fioSorter,
    },
    {
        title: 'День рождения',
        field: 'birthday',
    },
];

export const TabulatorGridCellFormat = (): JSX.Element => {
    return (
        <>
            <TabulatorGrid id={'TabulatorGridCellFormat'} columns={columns} dataSet={data} height={500} layout={'fitColumns'} />
        </>
    );
};
`
    return (
        <>
            <div>
                <TabulatorGridCellFormat />
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
