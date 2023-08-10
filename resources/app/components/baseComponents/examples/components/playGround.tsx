// noinspection DuplicatedCode

import 'dayjs/locale/ru';

import React, {useCallback} from 'react';

import dayjs from 'dayjs';
import {Button} from '@krinopotam/ui-button';
import {IDFormModalApi, DFormModal} from '@krinopotam/ui-dynamic-form-modal';
import {
    DFormModalConfig,
    DateTimeComponentConfig,
    TreeSelectComponentConfig,
    InputComponentConfig,
    SwitchComponentConfig,
    TabulatorGridComponentConfig,
    PasswordComponentConfig
} from '@krinopotam/ui-dynamic-form-modal/configBuilder';
import {IRuleType} from '@krinopotam/ui-dynamic-form/validators/baseValidator';

dayjs.locale('ru');

const validationRules: Record<string, [IRuleType]> = {
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
    role: string;
    title:string;
    login: string;
    departments: string;
    password: string;
    isLocked: string;
    permissions: string;
    newGrid: string;
}

const formModalApi: IDFormModalApi = {} as IDFormModalApi;
const formProps = new DFormModalConfig<IFields>('TestFormModalConfig')
    .apiRef(formModalApi)
    .formType('info')
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
        new InputComponentConfig<IFields>('profess').label('Профессия').showCount(true).maxLength(50).inlineGroup('row1'),
        new InputComponentConfig<IFields>('specialty').label('Специализация').default('дефолтная специализация').dependsOn(['profess']).inlineGroup('row1'),

        new DateTimeComponentConfig<IFields>('assignDate').label('Дата назначения'),

        new InputComponentConfig<IFields>('name').label('Имя пользователя').default('дефолтное имя пользователя').dependsOn(['profess']).inlineGroup('row2'),
        new InputComponentConfig<IFields>('login').label('Логин').default('дефолтный логин').dependsOn(['name', 'specialty']).inlineGroup('row2'),

        new TreeSelectComponentConfig<IFields>('departments')
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
            .editFormProps(new DFormModalConfig<Record<string, unknown>>('treeViewEditForm').addFields(new InputComponentConfig<IFields>('title').label('title')).getConfig())

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
        new PasswordComponentConfig<IFields>('password').label('Пароль'),
        new SwitchComponentConfig<IFields>('isLocked').label('Заблокировано').checkedChildren('Вкл').unCheckedChildren('Выкл')
    )
    .addTab(
        'Tab 3',
        new TabulatorGridComponentConfig<IFields>('permissions')
            .label('Полномочия')
            .confirmDelete(true)
            .height(300)
            .editFormProps(
                new DFormModalConfig<Record<string, unknown>>('grid_edit_form')
                    .addFields(
                        new InputComponentConfig<IFields>('name').label('Имя'),
                        new InputComponentConfig<IFields>('role').label('Роль')
                    )
                    .getConfig()
            )
            .columns([
                {
                    title: 'Name',
                    field: 'name',
                },
                {
                    title: 'Age',
                    field: 'age',
                },
                {
                    title: 'Address',
                    field: 'address',
                },
            ])
    )
    .getConfig();

export const PlayGround = (): JSX.Element => {
    const showModal = useCallback(() => {
        formModalApi.open('update', formData);
    }, []);

    return (
        <>
            {/*Description Start*/}
            <h1>Песочница</h1>
            {/*Description End*/}
            <DFormModal {...formProps} />
            <Button type="primary" onClick={showModal}>
                Open form
            </Button>
        </>
    );
};
