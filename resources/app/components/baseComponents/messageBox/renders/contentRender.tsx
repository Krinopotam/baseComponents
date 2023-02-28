/**
 * @MessageBox_ContentRender
 * @version 0.0.0.14
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React from 'react';

export const ContentRender = ({
    paddingLeft,
    paddingRight,
    children,
}: {
    paddingLeft?: number;
    paddingRight?: number;
    children?: React.ReactNode;
}): JSX.Element => {
    const style: React.CSSProperties = {
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        //paddingTop: '3px',
        //paddingBottom: '3px',
    };

    return (
        <div className="antd-modal-confirm-body" style={style}>
            {children}
        </div>
    );
};
