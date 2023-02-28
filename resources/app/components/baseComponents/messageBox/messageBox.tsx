/**
 * @MessageBox
 * @description Static message box instance.
 * @version 0.0.1.98
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import './messageBox.css';

import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import {Modal, ModalFuncProps, Spin} from 'antd';

import {ButtonsRender} from 'baseComponents/modal/renders/buttonsRender';
import {ContentRender} from './renders/contentRender';
import {HeaderRender} from 'baseComponents/modal/renders/headerRender';
import {IFormType} from 'baseComponents/modal';
import {MessageBoxApi} from './messageBoxApi';
import {ModalRender} from 'baseComponents/modal/renders/modalRender';
import {ModalStaticFunctions} from 'antd/es/modal/confirm';
import React from 'react';
import dispatcher from 'baseComponents/modal/service/formsDispatcher';
import {getUuid} from 'helpers/helpersString';
import {mergeObjects} from 'helpers/helpersObjects';

//region Types
export interface IModalBaseConfig {
    /** Form id */
    formId: string;
    /**  Form title */
    title?: React.ReactNode;
    /** Form content */
    content?: React.ReactNode;
    /** Form type */
    type?: IFormType;
    /** Form buttons */
    buttons?: IFormButtons;
    /** Center modal */
    centered?: boolean;
    /** Whether a close (x) button is visible on top right of the modal dialog or not */
    closable?: boolean;
    /** Whether to close the modal dialog when the mask (area outside the modal) is clicked */
    maskClosable?: boolean;
    /** After controls close callback */
    afterClose?: () => void;
    /** On controls close callback */
    onClose?: () => void;
}

type IModalConfig = Omit<IModalBaseConfig, 'formId'>;

export interface IModalAlertConfig extends IModalConfig {
    okText?: string;
    onOk?: (messageBox: MessageBoxApi) => boolean | void;
}

export interface IModalConfirmConfig extends IModalConfig {
    okText?: string;
    onOk?: (messageBox: MessageBoxApi) => boolean | void;
    cancelText?: string;
    onCancel?: (messageBox: MessageBoxApi) => boolean | void;
}

export interface IModalConfirmWaiterConfig extends IModalConfirmConfig {
    waitTitle?: React.ReactNode;
    waitContent?: React.ReactNode;
}

export type IAnyModalConfig = IModalAlertConfig | IModalConfirmConfig | IModalConfirmWaiterConfig;

type ModalType = Omit<ModalStaticFunctions, 'warn'>;

//endregion

class MessageBox {
    private static _instance: MessageBox; //singleton instance

    private _themedModalInstance?: ModalType = undefined;

    /** singleton implementation  */
    public static get Instance() {
        return this._instance || (this._instance = new this()); // Do you need arguments? Make it a regular static method instead.
    }

    public alert({okText, onOk, ...otherProps}: IModalAlertConfig): MessageBoxApi {
        const defaultButtons: IFormButtons = {
            ok: {
                position: 'right',
                active: true,
                title: okText || 'ОК',
                hotKeys: [{key: 'escape'}, {key: 'enter', ctrl: true}],
                onClick: () => {
                    const callbackResult = onOk ? onOk(messageBox) : undefined;
                    if (typeof callbackResult === 'boolean' && !callbackResult) return;
                    messageBox.destroy();
                },
            },
        };

        const props: IModalConfirmConfig = {...otherProps};
        const buttons = mergeObjects(defaultButtons, props.buttons);

        if (!props.onClose) props.onClose = () => this.triggerButtonClick('ok', buttons.ok);

        const messageBox = this.modalBase({...props, buttons});
        return messageBox;
    }

    public confirm({okText, cancelText, onOk, onCancel, ...otherProps}: IModalConfirmConfig): MessageBoxApi {
        const defaultButtons: IFormButtons = {
            ok: {
                position: 'right',
                active: true,
                title: okText || 'ОК',
                hotKeys: [{key: 'enter', ctrl: true}],
                onClick: () => {
                    const callbackResult = onOk ? onOk(messageBox) : undefined;
                    if (typeof callbackResult === 'boolean' && !callbackResult) return;
                    messageBox.destroy();
                },
            },
            cancel: {
                position: 'right',
                title: cancelText || 'Отмена',
                hotKeys: [{key: 'escape'}],
                onClick: () => {
                    const callbackResult = onCancel ? onCancel(messageBox) : undefined;
                    if (typeof callbackResult === 'boolean' && !callbackResult) return;
                    messageBox.destroy();
                },
            },
        };

        const props: IModalConfirmConfig = {...otherProps};
        const buttons = mergeObjects(defaultButtons, props.buttons);

        if (!props.onClose) props.onClose = () => this.triggerButtonClick('cancel', buttons.cancel);

        if (typeof props.closable === 'undefined') props.closable = false;
        if (typeof props.maskClosable === 'undefined') props.maskClosable = false;

        const messageBox = this.modalBase({...props, buttons});
        return messageBox;
    }

    public confirmWaiter({okText, cancelText, onOk, onCancel, waitTitle, waitContent, ...otherProps}: IModalConfirmWaiterConfig): MessageBoxApi {
        waitTitle = waitTitle || 'Обработка';
        if (typeof waitTitle === 'string') {
            waitContent = (
                <div style={{height: 22}}>
                    <Spin key={'waitSpinner'} /> {waitContent || 'Пожалуйста, подождите...'}
                </div>
            );
        }
        const defaultButtons: IFormButtons = {
            ok: {
                position: 'right',
                active: true,
                title: okText || 'ОК',
                hotKeys: [{key: 'enter', ctrl: true}],
                onClick: () => {
                    const callbackResult = onOk ? onOk(messageBox) : undefined;
                    if (typeof callbackResult === 'boolean' && !callbackResult) return;
                    messageBox.update({title: waitTitle, content: waitContent, buttons: {ok: {disabled: true}, cancel: {disabled: true}}});
                },
            },
            cancel: {
                position: 'right',
                title: cancelText || 'Отмена',
                hotKeys: [{key: 'escape'}],
                onClick: () => {
                    const callbackResult = onCancel ? onCancel(messageBox) : undefined;
                    if (typeof callbackResult === 'boolean' && !callbackResult) return;
                    messageBox.destroy();
                },
            },
        };

        const props: IModalConfirmConfig = {...otherProps};
        const buttons = mergeObjects(defaultButtons, props.buttons);

        if (!props.onClose) props.onClose = () => this.triggerButtonClick('cancel', buttons.cancel);

        if (typeof props.closable === 'undefined') props.closable = false;
        if (typeof props.maskClosable === 'undefined') props.maskClosable = false;

        const messageBox = this.modalBase({...props, buttons});
        return messageBox;
    }

    private modalBase({type = 'primary', ...otherProps}: IModalConfig): MessageBoxApi {
        const props: IModalConfig = {...otherProps};

        const formType = !type || type === 'primary' ? 'confirm' : type;
        const formId = getUuid();
        const config = {...props, type: formType, formId: formId};

        let modal: ModalType = Modal;
        if (this._themedModalInstance) modal = this._themedModalInstance;
        const modalInst = modal[formType](this.generateModalConfig(config));

        const messageBoxApi = new MessageBoxApi(formId, modalInst, config, this.generateModalConfig);

        dispatcher.pushToStack(messageBoxApi.id);
        return messageBoxApi;
    }

    private triggerButtonClick(buttonName: string, button: IFormButton | undefined | null) {
        if (button && button.onClick && !button.disabled && !button.hidden) button.onClick(buttonName, button);
    }

    private generateModalConfig({
        formId,
        title,
        content,
        afterClose,
        buttons,
        centered = true,
        closable = true,
        maskClosable = true,
        type,
        onClose,
    }: IModalBaseConfig): ModalFuncProps {
        const paddingBottom = 20;
        const paddingLeft = 24;
        const paddingRight = 24;
        return {
            className: 'custom-antd-message-box',

            icon: null,
            title: (
                <HeaderRender
                    title={title || (type === 'error' ? 'Ошибка' : 'Внимание')}
                    type={type}
                    style={{paddingLeft: 24, paddingRight: paddingRight, paddingTop: 3, paddingBottom: 3}}
                />
            ),
            content: (
                <ContentRender paddingLeft={paddingLeft} paddingRight={paddingRight}>
                    {content}
                </ContentRender>
            ),

            footer: (
                <ButtonsRender
                    formId={formId}
                    buttons={buttons}
                    formType={type}
                    containerStyle={{marginTop: '32px', marginLeft: paddingLeft, marginRight: paddingRight, marginBottom: paddingBottom}}
                />
            ),

            centered: !!centered,
            closable: closable,
            keyboard: false,
            maskClosable: maskClosable,
            wrapClassName: 'managed-dynamic-buttons-row',
            onCancel: onClose,

            modalRender: ModalRender,
            afterClose: () => afterClose?.(),
        };
    }

    public updateThemedModal(modal: ModalType) {
        this._themedModalInstance = modal;
    }
}

const messageBox = MessageBox.Instance;
export default messageBox;
