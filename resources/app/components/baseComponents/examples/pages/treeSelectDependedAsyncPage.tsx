
    import React from 'react';
    import {TreeSelectDependedAsync} from '../components/treeSelectDependedAsync';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const TreeSelectDependedAsyncPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {TreeSelectComponentConfig} from 'baseComponents/dForm/configBuilder/treeSelectComponentConfig';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {IDFormFieldTreeSelectProps} from 'baseComponents/dForm/components/treeSelectComponent';

interface IFields {
    department: {id: string; title: string};
    division: {id: string; title: string};
}

const departments = [
    {
        id: '01',
        title: 'Департамент аналитики данных',
    },
    {
        id: '02',
        title: 'Департамент инженерных работ',
    },
    {
        id: '03',
        title: 'Департамент проектных работ',
    },
];

const divisions1 = [
    {
        id: '01-01',
        title: 'Управление аналитики продаж',
        children: [
            {id: '01-01-01', title: 'Отдел прода север'},
            {id: '01-01-02', title: 'Отдел прода юг'},
            {id: '01-01-03', title: 'Отдел прода запад'},
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
];

const divisions2 = [
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
];

const divisions3 = [
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
];

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new TreeSelectComponentConfig('department')
            .label('Департамент')
            .fetchMode('onUse')
            .callbacks({
                onDataFetch: () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (Math.random() < 0.0) reject({message: 'Ошибка загрузки данных', code: 400});
                            else resolve({data: departments});
                        }, 2000);
                    });
                },
            }),
        new TreeSelectComponentConfig('division')
            .label('Управления')
            .dependsOn(['department'])
            .fetchMode('onUse')
            .callbacks({
                onDataFetch: (formApi) => {
                    console.log(formApi);
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (Math.random() < 0.0) reject({message: 'Ошибка загрузки данных', code: 400});
                            else resolve({data: departments});
                        }, 2000);
                    });
                },
            })
    )
    /*.callbacks({
        onFieldValueChanged: (fieldName, _value, _prevValue, formApi) => {
            if (fieldName !== 'department') return;
            const departmentValue = formApi.model.getFieldValue('department') as Record<'id', unknown>;
            let newDataSet: IDFormFieldTreeSelectProps['dataSet'];
            if (!departmentValue) newDataSet = [];
            else if (departmentValue.id === '01') newDataSet = divisions1;
            else if (departmentValue.id === '02') newDataSet = divisions2;
            else if (departmentValue.id === '03') newDataSet = divisions3;
            else newDataSet = [];

            formApi.model.updateFieldProps('division', {dataSet: newDataSet});
            formApi.model.setFieldValue('division', null);
        },
    })*/
    .buttons(null)
    .getConfig();

export const TreeSelectDependedAsync = (): JSX.Element => {
    return (
        <>
            <div style={{maxWidth: 500}}>
                <DForm {...formProps} />
            </div>
        </>
    );
};
`
    return (
        <>
            <div>
                <TreeSelectDependedAsync />
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
