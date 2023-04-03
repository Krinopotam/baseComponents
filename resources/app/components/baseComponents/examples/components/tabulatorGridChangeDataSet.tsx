import React, {useCallback, useState} from 'react';
import TabulatorGrid, {IGridProps} from 'baseComponents/tabulatorGrid/tabulatorGrid';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';
import {Button} from 'baseComponents/button';
import {IGridApi} from "baseComponents/tabulatorGrid/hooks/api";

const columns: IReactTabulatorProps['columns'] = [
    {title: 'Column 1', field: 'col1'},
    {title: 'Column 2', field: 'col2'},
    {title: 'Column 3', field: 'col3'},
];

const generateDataSet = (rows: number, prefix:string) => {
    if (!rows) rows = 10;
    const result = [] as IGridProps['dataSet'];
    const colRow = prefix + 'Col';
    for (let i = 0; i < rows; i++) {
        result.push({col1: colRow + '1_' + Math.random(), col2: colRow + '2_' + Math.random(), col3: colRow + '3_' + Math.random()});
    }
    return result;
};

export const TabulatorGridChangeDataSet = (): JSX.Element => {
    const [dataSet, setDataSet] = useState<IGridProps['dataSet']>(undefined);
    const [gridApi] = useState({} as IGridApi)

    const updateDataViaState = useCallback(() => {
        setDataSet(generateDataSet(100, 'state'));
    }, []);

    const updateDataViaApi = useCallback(() => {
        gridApi.setDataSet(generateDataSet(100, 'api'));
    }, [gridApi]);

    const updateDataViaApiAsync = useCallback(() => {
        gridApi.fetchData(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({data: generateDataSet(100, 'async')});
            }, 1000);
        }));
    }, [gridApi]);

    return (
        <>
            {/*Description Start*/}
            <h1>Пример обновбения dataSet грида Tabulator</h1>
            {/*Description End*/}
            <Button onClick={updateDataViaState}>Обновить DataSet через state</Button> - грид целиком перерендеривается
            <br />
            <br />
            <Button onClick={updateDataViaApi}>Обновить dataSet через Api</Button> - dataSet обновляется, но это не вызывает ререндер грида
            <br />
            <br />
            <Button onClick={updateDataViaApiAsync}>Обновить dataSet асинхронно через Api</Button> - грид перерендеривается, так как закрывается лоадером на время загрузки
            <TabulatorGrid
                id={'TabulatorGridSimple'}
                apiRef={gridApi}
                columns={columns}
                dataSet={dataSet}
                height={500}
                layout={'fitColumns'}
            />
        </>
    );
};
