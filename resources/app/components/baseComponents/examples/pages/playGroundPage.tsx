
    import React from 'react';
    import {PlayGround} from '../components/playGround';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const PlayGroundPage = (): JSX.Element => {
    const source = `import 'dayjs/locale/ru';

import React, {useCallback} from 'react';

import Button from 'baseComponents/button/button';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {DateTimeComponentConfig} from 'baseComponents/dForm/configBuilder/dateTimeComponentConfig';
import {GridComponentConfig} from 'baseComponents/dForm/configBuilder/gridComponentConfig';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {PasswordComponentConfig} from 'baseComponents/dForm/configBuilder/passwordComponentConfig';
import {RuleType} from 'baseComponents/editableFields/validator';
import {SwitchComponentConfig} from 'baseComponents/dForm/configBuilder/switchComponentConfig';
import {TreeSelectComponentConfig} from 'baseComponents/dForm/configBuilder/treeSelectComponentConfig';
import dayjs from 'dayjs';
import MRGrid from 'baseComponents/mrGrid/mrGrid';
import {MrGridComponentConfig} from 'baseComponents/dForm/configBuilder/mrGridComponentConfig';
import {MRT_ColumnDef} from 'material-react-table';

dayjs.locale('ru');

const validationRules: Record<string, [RuleType]> = {
    //password: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    profess: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    specialty: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    login: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    name: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    //departments: [{type: 'object', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    //permissions: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
};

const formData = {
    id: '1',
    profess: 'Программист',
    specialty: 'profess2',
    //departments: {value: '0-0-1', label: 'Начальные данные'},
    //departments: '0-0-1',
    //departments: '12345',
    departmentName: 'Департамент главных',
    neverField: 'neverData',
};

interface IFields {
    profess: string;
    specialty: string;
    assignDate: string;

    name: string;
    login: string;
    departments: string;
    password: string;
    isLocked: string;
    permissions: string;
    newGrid: string;
}


//region MRGrid props
type Person = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
    };
    address: string;
    city: string;
    state: string;
    children?: Person[];
};

const gridDataSet: Person[] = [
    {
        id: '1',
        name: {
            firstName: 'John',
            lastName: 'Doe',
        },
        address: '261 Erman Ford',
        city: 'East Daphne',
        state: 'Kentucky',
        children: [
            {
                id: '1_1',
                name: {
                    firstName: 'John Child 1',
                    lastName: 'Doe Child 1',
                },
                address: '769 Dominic Grove child 1',
                city: 'Columbus child 1',
                state: 'Ohio child 1',
                children: [
                    {
                        id: '1_1_1',
                        name: {
                            firstName: 'John Child 1_1',
                            lastName: 'Doe Child 1_1',
                        },
                        address: '769 Dominic Grove child 1_1',
                        city: 'Columbus child 1_1',
                        state: 'Ohio child 1_1',
                    },
                    {
                        id: '1_1_2',
                        name: {
                            firstName: 'John Child 1_2',
                            lastName: 'Doe Child 1_2',
                        },
                        address: '769 Dominic Grove child 1_2',
                        city: 'Columbus child 1_2',
                        state: 'Ohio child 1_2',
                    },
                ],
            },
            {
                id: '1_2',
                name: {
                    firstName: 'John Child 2',
                    lastName: 'Doe Child 2',
                },
                address: '769 Dominic Grove child 2',
                city: 'Columbus child 2',
                state: 'Ohio child 2',
            },
        ],
    },
    {
        id: '2',
        name: {
            firstName: 'Jane',
            lastName: 'Doe',
        },
        address: '769 Dominic Grove',
        city: 'Columbus',
        state: 'Ohio',
    },
    {
        id: '3',
        name: {
            firstName: 'Joe',
            lastName: 'Doe',
        },
        address: '566 Brace Inlet',
        city: 'South Linda',
        state: 'West Virginia',
    },
    {
        id: '4',
        name: {
            firstName: 'Kevin',
            lastName: 'Vend',
        },
        address: '722 Emily Stream',
        city: 'Lincoln',
        state: 'Nebraska',
    },
    {
        id: '5',
        name: {
            firstName: 'Joshua',
            lastName: 'Rudolf',
        },
        address: '32188 Lark Turnpike',
        city: 'Omaha',
        state: 'Nebraska',
    },
];

//should be memoized or stable
const columns: MRT_ColumnDef[] = [
    {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
    },
    {
        accessorKey: 'name.lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        accessorKey: 'state',
        header: 'State',
    },
];
//endregion

const formModalApi: IDFormModalApi = {} as IDFormModalApi;
const formProps = new DFormModalConfig<IFields>()
    .apiRef(formModalApi)
    .formType('info')
    .name('TestFormModalConfig')
    .title('Форма редактирования')
    .formMode('update')
    .validationRules(validationRules)
    .layout('vertical')
    .contentIndent(12)
    .confirmChanges(true)
    .bodyHeight(600)
    .bodyMaxHeight(500)
    .bodyMinHeight(200)
    .width(500)
    .minWidth(200)
    .maxWidth(1000)
    .callbacks({
        /*onDataFetch: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({message: 'Ошибка загрузки данных', code: 400});
                    else resolve({data: {profess: 'Загружено Профессия', specialty: 'Загружено специализация'}});
                }, 3000);
            });
        },*/
        onSubmit: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.5) reject({message: 'Ошибка сохранения', code: 400});
                    else resolve({data: {result: 'OK'}});
                }, 3000);
            });
        },
    })
    .addTab(
        'Tab1',
        new InputComponentConfig('profess').label('Профессия').showCount(true).maxLength(50).inlineGroup('row1'),
        new InputComponentConfig('specialty').label('Специализация').default('дефолтная специализация').dependsOn(['profess']).inlineGroup('row1'),

        new DateTimeComponentConfig('assignDate').label('Дата назначения'),

        new InputComponentConfig('name').label('Имя пользователя').default('дефолтное имя пользователя').dependsOn(['profess']).inlineGroup('row2'),
        new InputComponentConfig('login').label('Логин').default('дефолтный логин').dependsOn(['name', 'specialty']).inlineGroup('row2'),

        new TreeSelectComponentConfig('departments')
            .label('Подразделение')
            .fetchMode('onUse')
            .noCacheFetchedData(false)
            .debounce(300)
            // .minSearchLength(1)
            // .default({label: 'default value', id: 'id-01'})
            // .multiple(true)
            // .treeCheckable(true)
            // .dataSource(GetApiAppUsersSelect('', {search: '', limit: 0}))
            // .dataSource({
            //     url: 'http://127.0.0.1:8081/api/do',
            //     parameters: {action: 'app/users', method: 'List', data: {limit: 100}},
            // })

            .dataSet([
                {
                    id: '0-0',
                    title: 'Node1',
                    label: 'Label из данных',
                    children: [
                        {id: '0-0-1', title: 'Child Node1', other: 'OK'},
                        {id: '0-0-2', title: 'Child Node2', disabled: true},
                        {id: '0-0-3', title: 'Child Node3'},
                    ],
                },
                {title: 'Node2', id: '0-1'},
            ])
            .editableFormProps(new DFormModalConfig<Record<string, unknown>>().addFields(new InputComponentConfig('title').label('title')).getConfig())

        // .titleRender((treeNode: IApiJUser) => {
        //     return (
        //         <>
        //             {treeNode.fio}
        //             <br /> {treeNode.email}
        //         </>
        //     );
        // })

        // .labelRender((treeNode: IApiJUser) => {
        //     return (
        //         <>
        //             {treeNode.fio}
        //             <br /> {treeNode.email}
        //         </>
        //     );
        // })

        // .filterTreeNode((inputValue, treeNode: IApiJUser) => {
        //     return (treeNode.fio + ' ' + treeNode.email).toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
        // })
    )
    .addTab(
        'Таб 2',
        new PasswordComponentConfig('password').label('Пароль'),
        new SwitchComponentConfig('isLocked').label('Заблокировано').checkedChildren('Вкл').unCheckedChildren('Выкл')
    )
    .addTab(
        'Tab 3',
        new GridComponentConfig('permissions')
            .label('Полномочия')
            .confirmDelete(true)
            .height(300)
            .editFormProps(
                new DFormModalConfig<Record<string, unknown>>()
                    .name('grid_edit_form')
                    .addFields(new InputComponentConfig('name').label('Имя'), new InputComponentConfig('role').label('Роль'))
                    .getConfig()
            )
            .columns([
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    fixed: 'left',
                    //width: 50,
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    key: 'age',
                    //width: 500,
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                    //width: 500,
                },
            ])
    )
    .addTab('Tab 4', new MrGridComponentConfig('newGrid').label('Полномочия').columns(columns).dataSet(gridDataSet))
    .getConfig();

const mgGridFormConfig = new DFormModalConfig<Person>().addFields(new InputComponentConfig('address').label('Адрес'), new InputComponentConfig('city').label('Город'), new InputComponentConfig('state').label('Штат')).getConfig()

export const PlayGround = (): JSX.Element => {
    const showModal = useCallback(() => {
        formModalApi.open('update', formData);
    }, []);

    return (
        <>
            <DFormModal {...formProps} />
            <Button type="primary" onClick={showModal}>
                Open form
            </Button>
            {/* <TabulatorGrid/> */}
            <MRGrid dataSet={gridDataSet} columns={columns} editFormProps={mgGridFormConfig} />
        </>
    );
};
`
    return (
        <>
            <div>
                <PlayGround />
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