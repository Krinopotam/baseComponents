import React from 'react';
import {Resizable, ResizableProps} from 'react-resizable';

export const ResizableHeader = ({onResize, width, ...restProps}: ResizableProps): JSX.Element => {
    if (!width) return <th {...restProps} />;

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{enableUserSelectHack: false}}
        >
            <th {...restProps} />
        </Resizable>
    );
};
