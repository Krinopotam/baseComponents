/**
 * @RenderFormBody
 * @version 0.0.28.80
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IDFormApi} from 'baseComponents/dForm/hooks/api';
import {IDFormProps} from '../dForm';
import React from 'react';
import {TabContentRender} from './tabContentRender';
import {TabsRender} from './tabsRender';
import {theme} from 'antd';

const {useToken} = theme;

interface IFormBodyRenderProps {
    /** form api instance */
    formApi: IDFormApi;

    /** form properties */
    formProps: IDFormProps;
}

/** Render form body */
export const FormBodyRender = ({formApi, formProps}: IFormBodyRenderProps): JSX.Element | null => {
    const {token} = useToken();
    const tabs = formApi.model.getTabsProps();
    if (Object.keys(tabs).length === 0) return null;

    const indentStyle = {height: formProps.contentIndent || 12, background: token.colorBgElevated};
    if (Object.keys(tabs).length === 1) {
        const firstTab = Object.keys(tabs)[0];
        return (
            <>
                <div style={indentStyle} />
                <TabContentRender formApi={formApi} tabName={firstTab} formProps={formProps} />
            </>
        );
    } else {
        return <TabsRender formApi={formApi} formProps={formProps} />;
    }
};
