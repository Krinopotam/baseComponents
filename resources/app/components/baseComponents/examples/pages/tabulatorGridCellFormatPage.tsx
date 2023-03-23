
    import React from 'react';
    import {TabulatorGridCellFormat} from '../components/tabulatorGridCellFormat';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TabulatorGridCellFormatPage = (): JSX.Element => {
    const source = `import React from 'react';
import TabulatorGrid, {IGridRowData} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';

const data: IGridRowData[] = [
    {id: '01', surname: 'Иванов', name: 'Иван', patronic: 'Иванович', email: 'ivanov@mail.ru', birthday: '11.01.1980'},
    {id: '02', surname: 'Петров', name: 'Петр', patronic: 'Петрович', email: 'petrov@mail.ru', birthday: '15.02.1975'},
    {id: '03', surname: 'Сидоров', name: 'Сидр', patronic: 'Сидорович', email: 'sidorov@mail.ru', birthday: '17.03.1981'},
    {id: '04', surname: 'Смирнов', name: 'Смирен', patronic: 'Смирнович', email: 'smirnov@mail.ru', birthday: '11.01.1958'},
    {id: '05', surname: 'Самойлов', name: 'Самойл', patronic: 'Самойлович', email: 'samoylov@mail.ru', birthday: '15.02.1937'},
    {id: '06', surname: 'Арсенов', name: 'Арсен', patronic: 'Арсенович', email: 'arsenov@mail.ru', birthday: '13.04.1989'},
    {id: '07', surname: 'Дмитриев', name: 'Дмитрий', patronic: 'Дмитриевич', email: 'dmitriev@mail.ru', birthday: '31.08.1971'},
    {id: '08', surname: 'Александров', name: 'Александр', patronic: 'Александрович', email: 'aleksandrov@mail.ru', birthday: '01.12.1956'},
    {id: '09', surname: 'Васильев', name: 'Василий', patronic: 'Васильевич', email: 'vasilyev@mail.ru', birthday: '09.11.1969'},
    {id: '10', surname: 'Денисов', name: 'Денис', patronic: 'Денисович', email: 'denisov@mail.ru', birthday: '21.04.1978'},
    {id: '11', surname: 'Максимов', name: 'Максим', patronic: 'Максимович', email: 'maksimov@mail.ru', birthday: '10.08.1977'},
    {id: '12', surname: 'Протасов', name: 'Протас', patronic: 'Протасович', email: 'protasov@mail.ru', birthday: '25.08.1973'},
    {id: '13', surname: 'Алексеев', name: 'Алексей', patronic: 'Алексеевич', email: 'alekseev@mail.ru', birthday: '19.12.1985'},
    {id: '14', surname: 'Сергеев', name: 'Сергей', patronic: 'Сергеевич', email: 'sergeev@mail.ru', birthday: '22.07.1990'},
    {id: '15', surname: 'Артемьев', name: 'Артем', patronic: 'Артемович', email: 'artemyev@mail.ru', birthday: '06.11.1995'},
    {id: '16', surname: 'Демидов', name: 'Демид', patronic: 'Демидович', email: 'demidov@mail.ru', birthday: '11.02.1997'},
    {id: '17', surname: 'Кимов', name: 'Ким', patronic: 'Кимович', email: 'kimov@mail.ru', birthday: '18.01.1988'},
    {id: '18', surname: 'Абгазов', name: 'Абгаз', patronic: 'Абгазович', email: 'abgazov@mail.ru', birthday: '03.09.1985'},
    {id: '19', surname: 'Мансуров', name: 'Мансур', patronic: 'Мансурович', email: 'mansurov@mail.ru', birthday: '02.05.1995'},
    {id: '20', surname: 'Андросов', name: 'Андрей', patronic: 'Андреевич', email: 'androsov@mail.ru', birthday: '10.04.1966'},
];

function fioFilter(headerValue, rowValue, rowData, filterParams) {
    if (!headerValue) return true;
    //if (!filter) return true;
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    //must return a boolean, true if it passes the filter.
    return \`\${rowData['surname']} \${rowData['name']} \${rowData['patronic']} (\${rowData['email']})\`.toLowerCase().indexOf(headerValue.toLowerCase()) >= 0;
}

const columns: IReactTabulatorProps['columns'] = [
    {
        title: 'ФИО',
        field: 'fio',
        formatter: (cell, formatterParams, onRendered) => {
            //cell - the cell component
            //formatterParams - parameters set for the column
            //onRendered - function to call when the formatter has been rendered
            const row = cell.getRow();
            const rowData = row.getData();
            return \`<span>\${rowData['surname']} \${rowData['name']} \${rowData['patronic']}</span><br/><small style="color:#808080;">\${rowData['email']}</small>\`; //return the contents of the cell;
        },
        headerFilterFunc: fioFilter,
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
