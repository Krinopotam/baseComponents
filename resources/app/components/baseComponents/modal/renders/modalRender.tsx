/**
 * @ModalRender
 * @version 0.0.0.8
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import { DraggableRender } from './draggableRender';
import React from 'react';

export const ModalRender = (node: React.ReactNode): JSX.Element => {
    return <DraggableRender node={node} targetClass="custom-antd-modal-header" />;
};
