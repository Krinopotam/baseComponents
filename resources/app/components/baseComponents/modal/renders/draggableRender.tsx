/**
 * @DraggableRender
 * @version 0.0.28.3
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {useState} from 'react';
import Draggable, {DraggableData} from 'react-draggable';

export const DraggableRender = ({node, targetClass, onStartCallback}: {node: React.ReactNode; targetClass?: string; onStartCallback?: () => void}) => {
    const draggableFieldRef = React.createRef<HTMLDivElement>();

    const [dragDisabled, setDragDisabled] = useState(false);
    const [draggableStyle, setDraggableStyle] = useState({cursor: 'default'});
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});

    const onStart = (uiData: DraggableData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggableFieldRef.current?.getBoundingClientRect();
        if (!targetRect) return;
        onStartCallback?.();

        /* Границы, чтобы элемент всегда полностью оставался в пределах экрана
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        })*/

        // границы, чтобы элемент всегда был в пределах экрана как минимум на 50 пикселей
        setBounds({
            left: -targetRect.left + uiData.x - (targetRect.width - 50),
            right: clientWidth - (targetRect.right - uiData.x) + (targetRect.width - 50),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y) + (targetRect.height - 50),
        });
    };

    return (
        <Draggable disabled={dragDisabled} bounds={bounds} onStart={(_event, uiData) => onStart(uiData)}>
            <div
                ref={draggableFieldRef}
                style={draggableStyle}
                onMouseOver={(e) => {
                    e.stopPropagation();
                    if (!(e.target instanceof HTMLElement) || (targetClass && e.target['className'] !== targetClass)) {
                        setDragDisabled(true);
                        setDraggableStyle({cursor: 'default'});
                        return;
                    }

                    if (dragDisabled) setDragDisabled(false);

                    setDraggableStyle({cursor: 'move'});
                }}
                onMouseOut={(e) => {
                    e.stopPropagation();
                    setDragDisabled(true);
                    setDraggableStyle({cursor: 'default'});
                }}
            >
                {node}
            </div>
        </Draggable>
    );
};
