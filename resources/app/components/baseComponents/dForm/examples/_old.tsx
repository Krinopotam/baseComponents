/**
 * @DynamicFormExample
 * @version 0.0.32.36
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import 'dayjs/locale/ru';

import {App, ConfigProvider, theme} from 'antd';
import React, {useCallback, useState} from 'react';

import Button from '../../button/button';
import {createRoot} from 'react-dom/client';
import dayjs from 'dayjs';
import ruRU from 'antd/locale/ru_RU';
import {IDFormFieldsProps} from '../components/baseComponent';
import {IDFormFieldInputProps, InputComponent} from 'baseComponents/dForm/components/inputComponent';
import {DateTimeComponent, IDFormFieldDateTimeProps} from '../components/dateTimeComponent';
import {IDFormFieldPasswordProps, PasswordComponent} from '../components/passwordComponent';
import {IDFormFieldSwitchProps, SwitchComponent} from '../components/switchComponent';
import {IDFormApi} from '../hooks/api';
import {DFormConfig} from '../configBuilder/dFormConfig';
import {TreeSelectComponentConfig} from '../configBuilder/treeSelectComponentConfig';
import {PasswordComponentConfig} from '../configBuilder/passwordComponentConfig';
import {SwitchComponentConfig} from '../configBuilder/switchComponentConfig';
import {GridComponentConfig} from '../configBuilder/gridComponentConfig';
import {DFormModalConfig} from 'baseComponents/dForm/configBuilder/dFormModalConfig';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {InputComponentConfig} from 'baseComponents/dForm/configBuilder/inputComponentConfig';
import {DateTimeComponentConfig} from 'baseComponents/dForm/configBuilder/dateTimeComponentConfig';
import {DFormModal} from 'baseComponents/dFormModal/dFormModal';
import {RuleType} from "baseComponents/editableFields/validator";

dayjs.locale('ru');

//import './../components/antd/antd.less';
//import 'antd/dist/reset.css';

const fieldsProps: IDFormFieldsProps = {
    profess: {
        component: InputComponent,
        tab: 'Таб 1',
        inlineGroup: 'row1',
        label: 'Профессия',
        showCount: true,
        maxLength: 50,
        //width: '10%',
        //default: 'дефолтное значение 1'
    } as IDFormFieldInputProps,

    profess2: {
        component: InputComponent,
        label: 'ПРофессия 2',
        tab: 'Таб 1',
        inlineGroup: 'row1',
        default: 'дефолтное значение profess2',
        dependsOn: ['profess'],
        //width: '200px',
    } as IDFormFieldInputProps,

    assignDate: {
        component: DateTimeComponent,
        label: 'Дата назначения',
        tab: 'Таб 1',
        //showTime: true,
        //readOnly: true,
        //dependsOn: ['profess2'],
    } as IDFormFieldDateTimeProps,

    login: {
        component: InputComponent,
        label: 'Логин',
        inlineGroup: 'row2',
        tab: 'Таб 1',
        default: 'дефолтное значение логин',
        dependsOn: ['profess'],
        //width: '100px',
    } as IDFormFieldInputProps,

    name: {
        component: InputComponent,
        label: 'Name',
        inlineGroup: 'row2',
        tab: 'Таб 1',
        default: 'дефолтное значение 2',
        dependsOn: ['login', 'profess3'],
    } as IDFormFieldInputProps,
    /*
    departments: {
        component: TreeSelectComponent,
        label: 'Подразделение',
        tab: 'Таб 1',
        labelField: 'departmentName',
        //default: {label: "default value", id: 'id-01'},

        fetchMode: 'onUse',
        //fetchMode: 'onLoad',
        noCacheFetchedData: false,
        debounce: 300,
        //minSearchLength:1,
        //multiple: true,
        //treeCheckable:true,
        //dataSource: GetApiAppUsersSelect('', {search: '', limit: 0}),
        //dataSource: {
        //    url: 'http://127.0.0.1:8081/api/do',
        //    parameters: {action: 'app/users', method: 'List' , data:{limit:100}}
        //},

        dataSet: [
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
        ],
        //titleRender: (treeNode: IApiJUser) => {
        //    return (
        //        <>
        //            {treeNode.fio}
        //            <br /> {treeNode.email}
        //        </>
        //    );
        //},

        //labelRender: (treeNode: IApiJUser) => {
        //    return (
        //        <>
        //            {treeNode.fio}
        //            <br /> {treeNode.email}
        //        </>
        //    );
        //},

        //filterTreeNode: (inputValue, treeNode: IApiJUser) => {
        //    return (treeNode.fio + ' ' + treeNode.email).toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
        //},
    } as IDFormFieldTreeSelectProps,*/

    password: {
        component: PasswordComponent,
        label: 'Пароль',
        tab: 'Таб 2',
    } as IDFormFieldPasswordProps,

    isLocked: {
        component: SwitchComponent,
        label: 'Заблокировано',
        tab: 'Таб 2',
        default: true,
        checkedChildren: 'Вкл',
        unCheckedChildren: 'Выкл',
    } as IDFormFieldSwitchProps,

    /*
    permissions: {
        component: GridComponent,
        label: 'Полномочия',
        tab: 'Таб 3',
        //height:200,
        confirmDelete: true,
        columns: [
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
        ],
        dataSet: [
            {
                id: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street',
            },
            {
                id: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street',
            },
            {
                id: '3',
                name: 'Mark',
                age: 52,
                address: '25 Downing Street',
            },
            {
                id: '4',
                name: 'Alpha',
                age: 11,
                address: '10 Street',
            },
            {
                id: '5',
                name: 'Svelte',
                age: 33,
                address: '15 Downing',
            },
        ],
        editFormProps: {
            name: 'grid_edit_form',
            width: 400,
            fieldsProps: {
                name: {
                    label: 'имя',
                    component: InputComponent,
                },
            },
        },
    } as IDFormFieldGridProps,
    */
};

const validationRules: Record<string, [RuleType]> = {
    password: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    profess: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    specialty: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    login: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    name: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    //departments: [{type: 'object', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
    //permissions: [{type: 'string', rule: 'not-empty', message: 'Поле не должно быть пустым'}],
};

const formData = {
    id: '111111',
    profess: 'Программист',
    specialty: 'profess2',
    //departments: {value: '0-0-1', label: 'Начальные данные'},
    //departments: '0-0-1',
    //departments: '12345',
    departmentName: 'Департамент главных',
};

const formApi: IDFormApi = {} as IDFormApi;
const formProps2 = new DFormConfig()
    .apiRef(formApi)
    .formType('info')
    .name('TestFormConfig')
    .validationRules(validationRules)
    .layout('horizontal')
    .contentIndent(12)
    .confirmChanges(true)
    .addTab(
        'Таб 1',
        new InputComponentConfig('profess').label('Профессия').showCount(true).maxLength(50).inlineGroup('row1'),
        new InputComponentConfig('specialty').label('Специализация').default('дефолтная специализация').dependsOn(['profess']).inlineGroup('row1'),
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
            .editFormProps(
                new DFormModalConfig()
                    .name('grid_edit_form')
                    .addFields(new InputComponentConfig('name').label('Имя'), new InputComponentConfig('role').label('Роль'))
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
    .getConfig();

console.log(formProps2);

const formModalApi: IDFormModalApi = {} as IDFormModalApi;
const formProps3 = new DFormModalConfig()
    .apiRef(formModalApi)
    .formType('info')
    .name('TestFormModalConfig')
    .title('Форма редактирования')
    .formMode('update')
    .validationRules(validationRules)
    .layout('vertical')
    .contentIndent(12)
    .confirmChanges(true)
    .bodyHeight(300)
    .bodyMaxHeight(500)
    .bodyMinHeight(200)
    .width(500)
    .minWidth(200)
    .maxWidth(1000)
    .dataSource(
        new Promise((_resolve, reject) => {
            setTimeout(() => {
                console.log('Fetching data set !');
                //reject({message: 'Ошибка........', code: 400});
                _resolve({data: {profess: 'datasource profess'}});
            }, 3000);
        })
    )
    .callbacks({
        onSubmit: () => {
            return new Promise((_resolve, reject) => {
                // Обещание разрешилось спустя несколько часов
                setTimeout(() => {
                    console.log('submitted !');
                    reject({message: 'Ошибка........', code: 400});
                    //_resolve({data:{aaa:1}});
                }, 2000); // разрешается спустя 100 000 мс
            });

            //return await angelMowersPromise
        },
    })
    .addTab(
        'Таб 1',
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
            .editableFormProps(new DFormModalConfig().addFields(new InputComponentConfig('title').label('title')).getConfig())

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
            .editFormProps(
                new DFormModalConfig()
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
    .isOpened(true)

    .getConfig();

export const ExampleForm1 = (): JSX.Element => {
    const showModal = useCallback(() => {
        formModalApi.open('update', formData);
    }, []);

    const [isOpen, setOpen] = useState(false);

    const openModalByProps = useCallback(() => {
        setOpen(!isOpen);
    }, [isOpen]);

    return (
        <>
            {/* <DForm {...formProps2} /> */}

            <DFormModal {...formProps3} />

            <Button type="primary" onClick={showModal}>
                Open Modal by Api
            </Button>

            <Button type="primary" onClick={openModalByProps}>
                Open Modal by props
            </Button>
        </>
    );
};

/**
 * Главный модуль
 *
 * @constructor
 */

(() => {
    const rootElement = document.getElementById('root') as Element;
    const root = createRoot(rootElement);

    root.render(
        <ConfigProvider
            locale={ruRU}
            theme={{
                token: {
                    colorPrimary: '#00b96b',
                    borderRadius: 4,
                },
                components: {Modal: {paddingContentHorizontal: 0}},
                algorithm: theme.darkAlgorithm,
            }}
        >
            {/** antd context for static Modal (form MessageBox). Should use in root component */}
            <App>
                <ExampleForm1 />
            </App>
        </ConfigProvider>
    );
})();
