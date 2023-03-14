
    import React from 'react';
    import {FormBetweenFields} from '../components/formBetweenFields';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const FormBetweenFieldsPage = (): JSX.Element => {
    const source = `import {DForm} from 'baseComponents/dForm/dForm';
import React from 'react';
import {TreeSelectComponentConfig} from 'baseComponents/dForm/configBuilder/treeSelectComponentConfig';
import {DFormConfig} from 'baseComponents/dForm/configBuilder/dFormConfig';
import {IDFormFieldTreeSelectProps} from 'baseComponents/dForm/components/treeSelectComponent';

interface IFields {
    tip: string;
    process: string;
}

const dataSet1 = [
    {
        id: '1',
        title: 'Первый',
    },
    {
        id: '2',
        title: 'Второй',
    },
    {
        id: '3',
        title: 'Третий',
    },
];

const dataSet2_1 = [
    {
        id: '1',
        title: 'Первый процесс',
    },
    {
        id: '2',
        title: 'Второй процесс',
    },
];

const dataSet2_2 = [
    {
        id: '3',
        title: 'Третий процесс',
    },
    {
        id: '4',
        title: 'Четвертый процесс',
    },
];

const formProps = new DFormConfig<IFields>('Test form')
    .confirmChanges(true)
    .addFields(
        new TreeSelectComponentConfig('tip').label('Тип процесса').fetchMode('onUse').dataSet(dataSet1),
        new TreeSelectComponentConfig('process').label('Процессы').fetchMode('onUse').dataSet([{}])
    )
    .callbacks({
        onFieldValueChanged: (fieldName, _value, _prevValue, formApi) => {
            if (fieldName !== 'tip') return;
            const tipValue = formApi.model.getFieldValue('tip') as Record<'id', unknown>;
            let newDataSet: Partial<IDFormFieldTreeSelectProps>;

            if (tipValue.id === '1') newDataSet = {dataSet: dataSet2_1};
            else if (tipValue.id === '2') newDataSet = {dataSet: dataSet2_2};
            else newDataSet = {dataSet: []};

            formApi.model.updateFieldProps('process', newDataSet);
        },
    })
    .buttons({ok: {position: 'right'}})
    .getConfig();

export const FormBetweenFields = (): JSX.Element => {
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
                <FormBetweenFields />
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
