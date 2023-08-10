// noinspection DuplicatedCode

import React from 'react';
import {DForm} from '@krinopotam/ui-dynamic-form';
import {DFormConfig} from '@krinopotam/ui-dynamic-form/configBuilder/dFormConfig';
import {TreeSelectComponentConfig} from '@krinopotam/ui-dynamic-form/configBuilder/treeSelectComponentConfig';
import {ITreeSelectSourcePromise} from '@krinopotam/ui-dynamic-form/components/treeSelectComponent'
import {HelpersObjects}  from "@krinopotam/js-helpers";


/*Description Start*/
interface IFields {
    departments: {id: string; title: string};
}

interface IDataRow {
    id: string;
    title: string;
    children?: IDataRow[];
}

type IDataSet = IDataRow[];

const dataSet = [
    {
        id: '01',
        title: 'Департамент аналитики данных',
        children: [
            {
                id: '01-01',
                title: 'Управление аналитики продаж',
                children: [
                    {id: '01-01-01', title: 'Отдел продаж север'},
                    {id: '01-01-02', title: 'Отдел продаж юг'},
                    {id: '01-01-03', title: 'Отдел продаж запад'},
                ],
            },
            {
                id: '01-02',
                title: 'Управление аналитики закупок',
                children: [
                    {id: '01-02-01', title: 'Отдел закупок север'},
                    {id: '01-02-02', title: 'Отдел закупок юг'},
                    {id: '01-02-03', title: 'Отдел закупок запад'},
                ],
            },
            {
                id: '01-03',
                title: 'Управление аналитики производства',
                children: [
                    {id: '01-03-01', title: 'Отдел производства север'},
                    {id: '01-03-02', title: 'Отдел производства юг'},
                    {id: '01-03-03', title: 'Отдел производства запад'},
                ],
            },
        ],
    },
    {
        id: '02',
        title: 'Департамент инженерных работ',
        children: [
            {
                id: '02-01',
                title: 'Управление строительства',
                children: [
                    {id: '02-01-01', title: 'Отдел строительства север'},
                    {id: '02-01-02', title: 'Отдел строительства юг'},
                    {id: '02-01-03', title: 'Отдел строительства запад'},
                ],
            },
            {
                id: '02-02',
                title: 'Управление демонтажа',
                children: [
                    {id: '02-02-01', title: 'Отдел демонтажа север'},
                    {id: '02-02-02', title: 'Отдел демонтажа юг'},
                    {id: '02-02-03', title: 'Отдел демонтажа запад'},
                ],
            },
            {
                id: '02-03',
                title: 'Управление реконструкции',
                children: [
                    {id: '02-03-01', title: 'Отдел реконструкции север'},
                    {id: '02-03-02', title: 'Отдел реконструкции юг'},
                    {id: '02-03-03', title: 'Отдел реконструкции запад'},
                ],
            },
        ],
    },
    {
        id: '03',
        title: 'Департамент проектных работ',
        children: [
            {
                id: '03-01',
                title: 'Управление проектирования',
                children: [
                    {id: '03-01-01', title: 'Отдел проектирования север'},
                    {id: '03-01-02', title: 'Отдел проектирования юг'},
                    {id: '03-01-03', title: 'Отдел проектирования запад'},
                ],
            },
            {
                id: '03-02',
                title: 'Управление согласования',
                children: [
                    {id: '03-02-01', title: 'Отдел согласования север'},
                    {id: '03-02-02', title: 'Отдел согласования юг'},
                    {id: '03-02-03', title: 'Отдел согласования запад'},
                ],
            },
            {
                id: '03-03',
                title: 'Управление анализа проектов',
                children: [
                    {id: '03-03-01', title: 'Отдел анализа север'},
                    {id: '03-03-02', title: 'Отдел анализа юг'},
                    {id: '03-03-03', title: 'Отдел анализа запад'},
                ],
            },
        ],
    },
];

const filterDataSet = (nodes: IDataSet, search: string) => {
    const result: IDataSet = [];
    let resultChildren: IDataSet = [];
    for (const node of nodes) {
        const nodeClone = HelpersObjects.cloneObject(node);
        if (node.children && node.children.length > 0) resultChildren = filterDataSet(node.children, search);

        if (resultChildren.length > 0) {
            nodeClone.children = resultChildren;
            result.push(nodeClone);
            continue;
        }

        const findIndex = node.title.toLowerCase().indexOf(search.toLowerCase());
        if (findIndex >= 0) result.push(nodeClone);
    }

    return result;
};

const asyncFetch = (search: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = filterDataSet(dataSet, search);
            resolve({data: result});
        }, 1000);
    });
};

/*Description End*/

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new TreeSelectComponentConfig<IFields>('departments')
            .label('Подразделения')
            .fetchMode('onUse')
            .noCacheFetchedData(true)
            .minSearchLength(1)
            .callbacks({
                onDataFetch: (search: string) => {
                    return asyncFetch(search) as ITreeSelectSourcePromise;
                },
            })
    )
    .buttons(null)
    .getConfig();

export const TreeSelectAsyncSearch = (): JSX.Element => {
    return (
        <>
            {/*Description Start*/}
            <h1>Пример асинхронного поиска в TreeSelect</h1>
            {/*Description End*/}
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};
