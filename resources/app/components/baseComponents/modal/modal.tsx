/**
 * @Modal
 * @version 0.0.0.30
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import 'baseComponents/modal/css/modal.css';

import {Modal as AntModal, ModalProps as AntModalProps} from 'antd';
import React, {useState} from 'react';

import {FooterRender} from './renders/footerRender';
import {HeaderRender} from './renders/headerRender';
import {ModalRender} from './renders/modalRender';
import classNames from 'classnames';
import {useInitFormDispatcher} from './hooks/useInitFormDispatcher';
import {useResize} from './hooks/useResize';

export type IFormType = 'primary' | 'confirm' | 'info' | 'success' | 'error' | 'warning';

export type IModalProps = AntModalProps & {
    /** the form ID for form dispatcher (important property) */
    dispatcherFormId: string;

    /** The form body initial height */
    bodyHeight?: number;

    /** The form body min height */
    bodyMinHeight?: number;

    /** The form body max height */
    bodyMaxHeight?: number;

    /** The form initial width */
    width?: number;
    
    /** The form min width */
    minWidth?: number;

    /** The form max width */
    maxWidth?: number;

    /** Is the form body not scrollable */
    notScrollable?: boolean;

    /** Is the for can be resized (show the resize handler). Default: true */
    resizable?: boolean;
};

const Modal = ({resizable = true, ...props}: IModalProps): JSX.Element => {
    useInitFormDispatcher(props.dispatcherFormId, !!props.open);

    const [formSize, setFormSize] = useState({width: props.width || 0, bodyHeight: props.bodyHeight || 0});
    const onMouseResize = useResize(
        formSize.width,
        formSize.bodyHeight,
        setFormSize,
        props.minWidth || 200,
        props.maxWidth || 5000,
        props.bodyMinHeight || 50,
        props.bodyMaxHeight || 5000
    );

    const bodyStyleVal = useGetBodyStyle({
        bodyStyle: props.bodyStyle,
        bodyHeight: formSize.bodyHeight,
        bodyMaxHeight: props.bodyMaxHeight,
        bodyMinHeight: props.bodyMinHeight,
        notScrollable: props.notScrollable,
    });

    const paddingLeft = 24;
    const paddingRight = 24;
    return (
        <AntModal
            {...props}
            width={formSize.width || undefined}
            // no override section
            bodyStyle={bodyStyleVal}
            className={classNames('custom-antd-modal', props.className)}
            modalRender={ModalRender}
            //transitionName="zoom"
            title={<HeaderRender title={props.title} style={{paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: 5, paddingBottom: 5}} />}
            footer={
                <FooterRender
                    onMouseResize={onMouseResize}
                    resizable={resizable}
                    containerStyle={{paddingTop: 20, paddingLeft: paddingLeft, paddingRight: paddingRight, paddingBottom: 20}}
                >
                    {props.footer}
                </FooterRender>
            }
        />
    );
};

export default Modal;

const useGetBodyStyle = ({
    bodyStyle,
    bodyHeight,
    bodyMaxHeight,
    bodyMinHeight,
    notScrollable,
}: {
    bodyStyle?: React.CSSProperties;
    bodyHeight?: number;
    bodyMaxHeight?: number;
    bodyMinHeight?: number;
    notScrollable?: boolean;
}) => {
    const newStyle: React.CSSProperties = bodyStyle || {};
    newStyle.padding = '0 24px 0 24px';
    if (bodyHeight) newStyle.height = bodyHeight;
    if (bodyMaxHeight) newStyle.maxHeight = bodyMaxHeight;
    if (bodyMinHeight) newStyle.minHeight = bodyMinHeight;
    if (!notScrollable) newStyle.overflowY = 'auto';
    else newStyle.overflowY = 'hidden';

    return newStyle;
};
