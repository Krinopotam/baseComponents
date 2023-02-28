/**
 * @HeaderRender
 * @version 0.0.1.58
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {CloseCircleOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

import {IFormType} from '../modal';
import React from 'react';
import {mergeObjects} from 'helpers/helpersObjects';
import {theme} from 'antd';

const {useToken} = theme;

interface IHeaderRenderProps {
    title: string | React.ReactNode;
    type?: IFormType;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
}

export const HeaderRender = ({title, type, style, icon}: IHeaderRenderProps): JSX.Element => {
    const {token} = useToken();

    let backgroundColor = token.colorPrimary;
    let color = token.colorPrimaryBg;

    let finalIcon: React.ReactNode = icon || <ExclamationCircleOutlined />;
    if (type === 'info') {
        backgroundColor = token.colorInfo;
        color = token.colorInfoBg;
    } else if (type === 'success') {
        backgroundColor = token.colorSuccess;
        color = token.colorSuccessBg;
    } else if (type === 'warning') {
        backgroundColor = token.colorWarning;
        color = token.colorWarningBg;
    } else if (type === 'error') {
        backgroundColor = token.colorError;
        color = token.colorErrorBg;
        finalIcon = icon || <CloseCircleOutlined />;
    } else {
        finalIcon = icon || undefined;
    }

    if (icon === null) finalIcon = undefined;

    const defaultStyle: React.CSSProperties = {
        display: 'block',
        backgroundColor: backgroundColor,
        color: color,
        borderTopLeftRadius: token.borderRadius,
        borderTopRightRadius: token.borderRadius,
        minHeight: 24,
    };

    const finalStyle = mergeObjects(defaultStyle, style);

    return (
        <span className="custom-antd-modal-header" style={finalStyle}>
            <Icon>{finalIcon}</Icon> {title}
        </span>
    );
};

const Icon = ({children}: {children?: React.ReactNode}): JSX.Element | null => {
    return children ? <span style={{marginRight: 5}}>{children}</span> : null;
};
