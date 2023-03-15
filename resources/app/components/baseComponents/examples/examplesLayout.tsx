import {FolderOutlined, HomeOutlined} from '@ant-design/icons';
import {Layout, Menu, MenuProps, theme} from 'antd';
import {Link, Outlet} from 'react-router-dom';

import React from 'react';

const {Header, Sider, Content} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem(<Link to="home">Начало</Link>, 'home', <HomeOutlined />),
    {type: 'divider'},
    getItem('DForm - Форма', 'dForm', <FolderOutlined />, [
        getItem(<Link to="FormSimple">Простая форма (вертикальная)</Link>, 'FormSimple'),
        getItem(<Link to="FormSimpleHorizontal">Простая форма (горизонтальная)</Link>, 'FormSimpleHorizontal'),
        getItem(<Link to="FormWithTemplatedFields">Простая форма с шаблонами полей</Link>, 'FormWithTemplatedFields'),
        getItem(<Link to="FormDependedField">Форма с зависимыми друг от друга полями</Link>, 'FormDependedField'),
        getItem(<Link to="FormValidation">Простая валидация</Link>, 'FormValidation'),
        getItem(<Link to="FormFetching">Загрузка данных формы с сервера</Link>, 'FormFetching'),
        getItem(<Link to="FormSubmitting">Отправка данных формы на сервер</Link>, 'FormSubmitting'),
        getItem(<Link to="FormBetweenFields">Форма с полями, данные которых зависят друг от друга </Link>, 'FormBetweenFields'),
    ]),
    getItem('DFormModal - Модальная форма', 'dFormModal', <FolderOutlined />, [
        getItem(<Link to="ModalFormSimple">Простая модальная форма</Link>, 'ModalFormSimple'),
        getItem(<Link to="ModalFormWithTabs">Модальная форма с вкладками</Link>, 'ModalFormWithTabs'),
        getItem(<Link to="ModalFormWithGroups">Модальная форма с группами</Link>, 'ModalFormWithGroups'),
        getItem(<Link to="ModalFormWithTabsGroups">Модальная форма с вкладками и группами</Link>, 'ModalModalWithTabsGroups'),
        getItem(<Link to="ModalFormWithGrid">Модальная форма с гридом</Link>, 'ModalFormWithGrid'),
        getItem(<Link to="ModalFormFetching">Загрузка данных модальной формы с сервера</Link>, 'ModalFormFetching'),
        getItem(<Link to="ModalFormSubmitting">Отправка данных модальной формы на сервер</Link>, 'ModalFormSubmitting'),
    ]),
    getItem('TabulatorGrid - грид', 'TabulatorGrid', <FolderOutlined />, [
        getItem(<Link to="TabulatorGridSimple">Простой грид</Link>, 'TabulatorGridSimple'),
        getItem(<Link to="TabulatorGridWithForm">Грид с формой редактирования</Link>, 'TabulatorGridWithForm'),
        getItem(<Link to="TabulatorGridWithFormAsync">Грид с асинхронной загрузкой и сохранением</Link>, 'TabulatorGridWithFormAsync'),
    ]),

    {type: 'divider'},
    getItem(<Link to="PlayGround">Песочница</Link>, 'PlayGround'),
];

export const ExamplesLayout = (): JSX.Element => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <>
            <Layout>
                <Header className="header">
                    <div className="logo" /> Header
                </Header>
                <Layout>
                    <Sider width={400} style={{background: colorBgContainer}}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['baseExamples']}
                            style={{height: '100%', borderRight: 0}}
                            items={items}
                        />
                    </Sider>
                    <Layout style={{paddingLeft: 25, paddingRight: 24}}>
                        {/*breadcrumb */}
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: colorBgContainer,
                            }}
                        >
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </>
    );
};
