import 'dayjs/locale/ru';

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
};


const formModalApi: IDFormModalApi = {} as IDFormModalApi;
const formProps = new DFormModalConfig()
    .apiRef(formModalApi)
    .formType('info')
    .name('TestFormModalConfig')
    .title('Форма редактирования')
    .formMode('update')
    .validationRules(validationRules)
    .layout('vertical')
    .contentIndent(12)
    .confirmChanges(false)
    .bodyHeight(300)
    .bodyMaxHeight(500)
    .bodyMinHeight(200)
    .width(500)
    .minWidth(200)
    .maxWidth(1000)
    .callbacks({
      /*  onDataFetch: () => {
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
        'Таб 1',
        {
            row1: [
                new InputComponentConfig('profess').label('Профессия').showCount(true).maxLength(50),
                new InputComponentConfig('specialty').label('Специализация').default('дефолтная специализация').dependsOn(['profess']),
            ],
        },
        new DateTimeComponentConfig('assignDate').label('Дата назначения'),
        {
            row2: [
                new InputComponentConfig('name').label('Имя пользователя').default('дефолтное имя пользователя').dependsOn(['profess']),
                new InputComponentConfig('login').label('Логин').default('дефолтный логин').dependsOn(['name', 'specialty']),
            ],
        },
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
    .getConfig();

export const Home = (): JSX.Element => {
    const showModal = useCallback(() => {
        formModalApi.open('update', formData);
    }, []);


    return (
        <>
            <DFormModal {...formProps} />
            <Button type="primary" onClick={showModal}>
                Open form
            </Button>
        </>
    );
};
