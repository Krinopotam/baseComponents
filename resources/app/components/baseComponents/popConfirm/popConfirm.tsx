import {ButtonsRow, IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {PopconfirmProps, Popover} from 'antd';
import React, {useEffect, useRef, useState} from 'react';

import {IFormType} from 'baseComponents/modal/modal';
import {getUuid} from 'helpers/helpersString';
import {mergeObjects} from 'helpers/helpersObjects';
import {useInitFormDispatcher} from 'baseComponents/modal/hooks/useInitFormDispatcher';

export interface IPopConfirmProps extends Omit<PopconfirmProps, 'okType' | 'okButtonProps' | 'cancelButtonProps'> {
    content?: React.ReactNode;
    formType?: IFormType;
    okButtonProps?: IFormButton;
    cancelButtonProps?: IFormButton;
}

export const PopConfirm = ({content, ...props}: IPopConfirmProps): JSX.Element => {
    const [formId] = useState(getUuid);

    useInitFormDispatcher(formId, props.open || false);

    const buttons = useInitButtons(props);

    const buttonsRowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (props.open) buttonsRowRef.current?.focus();
    }, [props.open]);
    const _content = (
        <>
            {content ? content : null}
            <div ref={buttonsRowRef} tabIndex={-1}>
                <ButtonsRow formId={formId} buttons={buttons} />
            </div>
        </>
    );

    return (
        <Popover {...props} content={_content} title={props.title} overlayClassName="managed-dynamic-buttons-row">
            {props.children}
        </Popover>
    );
};

/**
 * Generate buttons
 */
const useInitButtons = ({okText, cancelText, onConfirm, onCancel, okButtonProps, cancelButtonProps}: IPopConfirmProps): IFormButtons => {
    const [formButtons, setFormButtons] = useState({});
    useEffect(() => {
        const defaultButtons: IFormButtons = {
            ok: {
                position: 'right',
                active: true,
                title: okText || 'ОК',
                hotKeys: [{key: 'enter', ctrl: true}],
                onClick: () => {
                    onConfirm?.();
                },
                size: 'small',
            },
            cancel: {
                position: 'right',
                title: cancelText || 'Отмена',
                hotKeys: [{key: 'escape'}],
                onClick: () => {
                    onCancel?.();
                },
                size: 'small',
            },
        };

        const resultButtons = mergeObjects(defaultButtons, {ok: okButtonProps, cancel: cancelButtonProps});
        setFormButtons(resultButtons);
    }, [okText, cancelText, onConfirm, onCancel, okButtonProps, cancelButtonProps]);

    return formButtons;
};
