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
        getItem(<Link to="FormSimple">Простая форма</Link>, '1_1'),
        getItem(<Link to="FormWithTemplatedFields">Простая форма с шаблонами полей</Link>, '1_2'),
        getItem(<Link to="FormDependedField">Форма с зависимыми друг от друга полями</Link>, '1_3'),
        getItem(<Link to="FormValidation">Простая валидация</Link>, '1_4'),
        getItem(<Link to="FormFetching">Загрузка данных формы с сервера</Link>, '1_5'),
        getItem(<Link to="FormSubmitting">Отправка данных формы на сервер</Link>, '1_6'),
        getItem(<Link to="FormBetweenFields">Форма с полями, данные которых зависят друг от друга </Link>, '1_7'),
    ]),
    getItem('DFormModal - Модальная форма', 'dFormModal', <FolderOutlined />, [
        getItem(<Link to="ModalFormSimple">Простая модальная форма</Link>, '2_1'),
        getItem(<Link to="ModalFormWithTabs">Модальная форма с вкладками</Link>, '2_2'),
        getItem(<Link to="ModalFormWithGroups">Модальная форма с группами</Link>, '2_3'),
        getItem(<Link to="ModalModalWithTabsGroups">Модальная форма с вкладками и группами</Link>, '2_4'),
        getItem(<Link to="ModalFormWithGrid">Модальная форма с гридом</Link>, '2_5'),
        getItem(<Link to="ModalFormFetching">Загрузка данных модальной формы с сервера</Link>, '2_6'),
        getItem(<Link to="ModalFormSubmitting">Отправка данных модальной формы на сервер</Link>, '2_7'),
    ]),
    getItem('MRGrid - грид', 'mrGrid', <FolderOutlined />, [
        getItem(<Link to="MrGridSimple">Простой грид</Link>, '3_1'),
        getItem(<Link to="MrGridSimpleTree">Древовидный грид</Link>, '3_2'),
        getItem(<Link to="MrGridWithComplexDataSet">Грид с комлексным набором данных</Link>, '3_3'),
        getItem(<Link to="MrGridWithForm">Грид с формой редактирования</Link>, '3_4'),
        getItem(<Link to="MrGridWithFormAsync">Грид с асинхронной загрузкой и сохранением</Link>, '3_5'),
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
