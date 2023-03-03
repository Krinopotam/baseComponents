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
    getItem('Базовые примеры', 'baseExamples', <FolderOutlined />, [
        getItem(<Link to="SimpleForm">Простая форма</Link>, 'g1'),
        getItem(<Link to="FormWithTemplatedFields">Простая форма с шаблонами полей</Link>, 'g1a'),
        getItem(<Link to="SimpleFormModal">Простая модальная форма</Link>, 'g2'),
        getItem(<Link to="ModalWithTabs">Модальная форма с вкладками</Link>, 'g3'),
        getItem(<Link to="ModalWithGroups">Модальная форма с группами</Link>, 'g4'),
        getItem(<Link to="ModalWithTabsGroups">Модальная форма с вкладками и группами</Link>, 'g5'),
        getItem(<Link to="FormDependedField">Форма с зависимыми друг от друга полями</Link>, 'g6'),
    ]),
    getItem('Валидация', 'validation', <FolderOutlined />, [getItem(<Link to="SimpleValidation">Простая валидация</Link>, 'g7')]),
    getItem('Обмен данными с сервером', 'fetch', <FolderOutlined />, [
        getItem(<Link to="SimpleFormSubmitting">Отправка формы</Link>, 'g8'),
        getItem(<Link to="SimpleFormModalSubmitting">Отправка модальной формы</Link>, 'g9'),
        getItem(<Link to="SimpleFormFetching">Загрузка формы</Link>, 'g10'),
        getItem(<Link to="SimpleFormModalFetching">Загрузка модальной формы</Link>, 'g11'),
    ]),
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
