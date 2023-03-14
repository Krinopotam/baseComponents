/**
 * @RenderTabs
 * @version 0.0.30.6
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {ComponentType} from 'react';
import {Tabs, TabsProps, theme} from 'antd';

import {IDFormApi} from 'baseComponents/dForm/hooks/api';
import {IDFormProps} from '../dForm';
import StickyBox from 'react-sticky-box';
import {TabContentRender} from './tabContentRender';
import {TabNavListProps} from 'rc-tabs/lib/TabNavList';

const {useToken} = theme;

interface ITabsRenderProps {
    /** form api instance */
    formApi: IDFormApi;
}

/** All tab bars renderer */
export const TabsRender = ({formApi}: ITabsRenderProps): JSX.Element => {
    const formProps = formApi.getFormProps();
    //there is no sense to use memo (rendering is not very often)
    const tabs = formApi.model.getTabsProps();
    const items: TabsProps['items'] = [];
    for (const tabName in tabs) {
        items.push({
            key: tabName,
            label: tabName,
            forceRender: true,
            children: <TabContentRender tabName={tabName} formApi={formApi} />,
        });
    }

    const tabBarRender = (props: TabNavListProps, DefaultTabBar: ComponentType<TabNavListProps>) => TabBarRender(props, DefaultTabBar, formProps);

    return <Tabs type="card" size="small" renderTabBar={tabBarRender} items={items} />;
};

const TabBarRender = (props: TabNavListProps, DefaultTabBar: ComponentType<TabNavListProps>, formProps: IDFormProps): React.ReactElement => {
    const {token} = useToken();

    const style = {...props.style};
    //style.backgroundColor = token.colorBgContainer;
    style.backgroundColor = token.colorBgElevated;
    style.height = formProps?.tabsProps?.height || 35;

    const indent = formProps.contentIndent || 12;
    const indentStyle = {height: indent, backgroundColor: style.backgroundColor};

    return (
        <StickyBox style={{zIndex: 15}}>
            <div style={indentStyle} />
            <DefaultTabBar {...props} style={style} />
        </StickyBox>
    );
};
