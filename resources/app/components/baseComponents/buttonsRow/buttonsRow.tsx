import {Button, IButtonProps} from 'baseComponents/button';
import {Col, Row, Space, Tooltip} from 'antd';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {ButtonType} from 'antd/es/button';
import {IFormType} from 'baseComponents/modal';
import dispatcher from 'baseComponents/modal/service/formsDispatcher';
import {mergeObjects} from 'helpers/helpersObjects';

//region Types
interface IHotKey {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    key: string;
}

export interface IFormButton {
    //TODO implement info, danger, warning buttons type
    type?: 'default' | 'dashed' | 'link' | 'text' | 'element'; // YAR Kostyl - add type as ReactNode in title
    active?: boolean;
    danger?: boolean;
    disabled?: boolean;
    ghost?: boolean;
    loading?: boolean;
    hidden?: boolean;
    title?: React.ReactNode;
    position?: 'center' | 'left' | 'right';
    onClick?: (buttonName: string, button: IFormButton, context?: unknown) => void;
    props?: IButtonProps;
    icon?: string | React.ReactNode;
    size?: 'large' | 'middle' | 'small';
    hotKeys?: IHotKey[];

    /** Button tooltip */
    tooltip?: string;

    //TODO: to implement href and multi -level buttons
    href?: string;
    children?: IFormButton[];
}

export type IFormButtons = Record<string, IFormButton | null>;

interface IButtonRowProps {
    /** Container form ID */
    formId: string;

    /** Buttons props */
    buttons?: IFormButtons;

    /** Buttons row container class name */
    className?: string;

    /** Buttons row container style */
    style?: React.CSSProperties;

    /** Form type */
    formType?: IFormType;

    /** An mutable object to merge with these controls api */
    apiRef?: IButtonsRowApi;

    /** Any context. Will use in buttons callbacks  */
    context?: unknown;

    /** allow select buttons using arrows keys */
    arrowsSelection?: boolean;
}

export interface IButtonsRowApi {
    buttons: (buttons?: IFormButtons) => IFormButtons;
    updateButtons: (buttons: IFormButtons) => IFormButtons;
    setNextActive: (direction: 'forward' | 'backward') => void;
    setActive: (name: string, active?: boolean) => void;
    loading: (name: string, loading?: boolean) => boolean;
    disabled: (name: string, disabled?: boolean) => boolean;
    hidden: (name: string, hidden?: boolean) => boolean;
    triggerClick: (name: string) => void;
    activeTriggerClick: () => void;
}
//endregion

export const ButtonsRow = (props: IButtonRowProps): JSX.Element => {
    const [curButtons, setCurButtons] = usePrepareButtons(props);

    const api = useApi(props, curButtons, setCurButtons);

    useSubscribeToKeyDownEvent(props, api);

    if (!curButtons) return <></>;

    return (
        <div style={{display: 'block', ...props.style}} className={'controls-buttons-dynamic-row ' + props.className}>
            <Row wrap={false}>
                <Col flex="auto" style={{textAlign: 'left'}}>
                    <ButtonsGroup key="leftButtons" buttons={curButtons} position={'left'} context={props.context} />
                </Col>
                <Col flex="auto" style={{textAlign: 'center'}}>
                    <ButtonsGroup key="centerButtons" buttons={curButtons} position={'center'} context={props.context} />
                </Col>
                <Col flex="auto" style={{textAlign: 'right'}}>
                    <ButtonsGroup key="rightButtons" buttons={curButtons} position="right" context={props.context} />
                </Col>
            </Row>
        </div>
    );
};

export const ButtonsGroup = ({
    buttons,
    position,
    context,
}: {
    buttons?: IFormButtons;
    position: 'left' | 'center' | 'right' | undefined;
    context?: unknown;
}): JSX.Element | null => {
    if (!buttons) return null;

    return (
        <Space wrap>
            {Object.keys(buttons).map((name) => {
                const button = buttons?.[name];
                if (!button) return null;
                return <ButtonComponent key={name} name={name} button={button} position={position} context={context} />;
            })}
        </Space>
    );
};

const ButtonComponent = ({
    name,
    button,
    position,
    context,
}: {
    name: string;
    button: IFormButton;
    position: 'left' | 'center' | 'right' | undefined;
    context?: unknown;
}): JSX.Element | null => {
    const onClick = useCallback(() => {
        if (button.onClick) button.onClick(name, button, context);
    }, [button, name, context]);

    if (!button || button.hidden) return null;
    if (position && button.position !== position) return null;

    if (button.type === 'element') {
        if (button.tooltip) {
            return <Tooltip title={button.tooltip}>button.title</Tooltip>;
        } else return <>button.title</>;
    }

    if (button.tooltip) {
        //Popover and tooltip has a bug: they are not displayed for custom components, so we have to repeat the same code
        return (
            <Tooltip title={button.tooltip}>
                <Button
                    key={name}
                    type={(button.active ? 'primary' : button.type) as ButtonType}
                    disabled={button.disabled}
                    ghost={button.ghost}
                    loading={button.loading}
                    //style={position === 'left' ? {marginRight: '8px'} : {marginLeft: '8px'}}
                    danger={button.danger}
                    onClick={onClick}
                    size={button.size}
                    icon={button.icon}
                    {...button.props}
                >
                    {button.title}
                </Button>
            </Tooltip>
        );
    } else {
        return (
            <Button
                key={name}
                type={(button.active ? 'primary' : button.type) as ButtonType}
                disabled={button.disabled}
                ghost={button.ghost}
                loading={button.loading}
                //style={position === 'left' ? {marginRight: '8px'} : {marginLeft: '8px'}}
                danger={button.danger}
                onClick={onClick}
                size={button.size}
                icon={button.icon}
                {...button.props}
            >
                {button.title}
            </Button>
        );
    }
};

const useApi = (props: IButtonRowProps, curButtons: IFormButtons, setCurButtons: (buttons: IFormButtons) => void): IButtonsRowApi => {
    const [api] = useState((props.apiRef || {}) as IButtonsRowApi);
    return useMemo(() => {
        api.buttons = (buttons) => {
            if (typeof buttons === 'undefined') return curButtons;
            setCurButtons(prepareButtons(buttons, props.formType));
            return buttons;
        };

        api.updateButtons = (buttons) => {
            const updatedButtons = prepareButtons(mergeObjects(curButtons, buttons));
            setCurButtons(updatedButtons);
            return updatedButtons;
        };

        api.setNextActive = (direction) => {
            const changedButtons = changeActiveButton(curButtons, direction);
            setCurButtons(changedButtons);
        };

        api.setActive = (name, active) => {
            const changedButtons = setActiveButton(curButtons, name, active);
            setCurButtons(changedButtons);
        };

        api.loading = (name: string, loading?: boolean): boolean => {
            const buttons = {...curButtons};
            const button = buttons[name];
            if (!button) return false;

            if (typeof loading === 'undefined') return !!button.loading;

            button.loading = loading;
            setCurButtons(buttons);
            return loading;
        };

        api.disabled = (name: string, disabled?: boolean): boolean => {
            const buttons = {...curButtons};
            const button = buttons[name];
            if (!button) return false;

            if (typeof disabled === 'undefined') return !!button.disabled;

            button.disabled = disabled;

            setTimeout(() => {
                //Workaround to avoid error: Cannot update a component while rendering a different component.
                setCurButtons(buttons);
            }, 0);

            return disabled;
        };

        api.hidden = (name: string, hidden?: boolean): boolean => {
            const buttons = {...curButtons};
            const button = buttons[name];
            if (!button) return false;

            if (typeof hidden === 'undefined') return !!button.hidden;

            button.hidden = hidden;
            setCurButtons({...buttons});

            return hidden;
        };

        api.triggerClick = (name: string) => {
            const button = curButtons[name];
            if (!button) return;
            if (button.onClick && !button.disabled && !button.loading && !button.hidden) button.onClick(name, button, props.context);
        };

        api.activeTriggerClick = () => {
            const activeButtonName =
                Object.keys(curButtons).find((name) => {
                    const button = curButtons[name];
                    if (button?.active) return name;
                }) || '';
            api.triggerClick(activeButtonName);
        };

        return api;
    }, [api, curButtons, setCurButtons, props.formType, props.context]);
};

const usePrepareButtons = (props: IButtonRowProps): [IFormButtons, (buttons: IFormButtons) => void] => {
    const [curButtons, setCurButtons] = useState(prepareButtons(props.buttons, props.formType));

    const setTimeoutCurButtons = (buttons: IFormButtons) => {
        setTimeout(() => {
            //Workaround to avoid error: Cannot update a component while rendering a different component.
            setCurButtons(buttons);
        }, 0);
    };

    //useUpdateButtonProps(setCurButtons)
    useEffect(() => {
        const _buttons = prepareButtons(props.buttons, props.formType);
        setCurButtons(_buttons);
    }, [props.buttons, props.formType]);

    return [curButtons, setTimeoutCurButtons];
};

const useSubscribeToKeyDownEvent = (props: IButtonRowProps, api: IButtonsRowApi) => {
    //We use refs, since the subscription for the event occurs only 1 time, and Props can change api is ref already
    const propsRef = useRef(props);
    propsRef.current = props;

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => keyDownHandler(e, propsRef, api);
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
        // eslint-disable-next-line
    }, []);
};

const prepareButtons = (buttons: IFormButtons | undefined, formType?: IFormType) => {
    const clonedButtons = buttons ? {...buttons} : {};
    const leftButtons: IFormButtons = {};
    const centerButtons: IFormButtons = {};
    const rightButtons: IFormButtons = {};
    for (const key in clonedButtons) {
        const button = clonedButtons[key];
        if (!button) continue;
        if (!button.type) button.type = 'default';
        if (!button.position) button.position = 'right';
        if (typeof button.danger === 'undefined' && formType === 'error') button.danger = true;
        if (button.position === 'left') leftButtons[key] = button;
        else if (button.position === 'center') centerButtons[key] = button;
        else rightButtons[key] = button;
    }

    return {...leftButtons, ...centerButtons, ...rightButtons};
};

const keyDownHandler = (e: KeyboardEvent, props: React.MutableRefObject<IButtonRowProps>, api: IButtonsRowApi) => {
    if (props.current.formId && !dispatcher?.isActive(props.current.formId)) return;

    const target = e.target as HTMLElement;

    if (!e.key) return;

    const key = e.key.toLowerCase();
    if (key === 'f5' || (e.ctrlKey && e.shiftKey && key === 'r')) return; //F5 or ctrl+shift+r pressed - при нажатии кнопок обновления страницы просто выходим

    if (props.current.arrowsSelection || typeof props.current.arrowsSelection === 'undefined') {
        if (
            target &&
            target.closest('.managed-dynamic-buttons-row') && //TODO: think about how to get rid of this class
            target.tagName.toLocaleUpperCase() !== 'INPUT' &&
            target.tagName.toLocaleUpperCase() !== 'TEXTAREA' &&
            !(target.tagName.toLocaleUpperCase() === 'BUTTON' && target.getAttribute('role') === 'switch')
        ) {
            if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
                if (key === 'enter') {
                    e.stopPropagation();
                    api.activeTriggerClick();
                } else if (key === 'arrowleft') {
                    e.stopPropagation();
                    api.setNextActive('backward');
                } else if (key === 'arrowright') {
                    e.stopPropagation();
                    api.setNextActive('forward');
                }
            }
        }
    }

    const buttons = api.buttons();

    for (const name in buttons) {
        const button = buttons[name];
        if (!button?.hotKeys || button.disabled || button.hidden) continue;
        for (const hotKey of button.hotKeys) {
            if (
                !!hotKey.ctrl === e.ctrlKey &&
                !!hotKey.alt === e.altKey &&
                !!hotKey.shift === e.shiftKey &&
                !!hotKey.meta === e.metaKey &&
                hotKey.key.toLowerCase() === key
            ) {
                e.stopPropagation();
                e.preventDefault();
                api.setActive(name);
                api.triggerClick(name);
            }
        }
    }
};

const getNextButtonName = (currentName: string, buttons: IFormButtons, direction: 'forward' | 'backward', onlyVisible: boolean) => {
    const keys = Object.keys(buttons);

    const currentIndex = keys.findIndex((name) => {
        return name === currentName;
    });

    if (direction === 'forward') {
        if (currentIndex >= keys.length) return currentName;
        for (let i = currentIndex + 1; i < keys.length; i++) {
            const name = keys[i];
            const button = buttons[name];
            if (!button) continue;
            if (!button.disabled && (!onlyVisible || !button.hidden)) return keys[i];
        }
    } else {
        if (currentIndex <= 0) return currentName;
        for (let i = currentIndex - 1; i >= 0; i--) {
            const name = keys[i];
            const button = buttons[name];
            if (!button) continue;
            if (!button.disabled && (!onlyVisible || !button.hidden)) return keys[i];
        }
    }

    return currentName;
};

const changeActiveButton = (buttons: IFormButtons, direction: 'backward' | 'forward') => {
    const _buttons = {...buttons};
    const keys = Object.keys(_buttons);

    let activeIndex = keys.findIndex((name) => {
        const button = _buttons[name];
        if (button?.active) return true;
    });

    if (activeIndex < 0) activeIndex = 0;

    const currentName = keys[activeIndex];
    const currentButton = _buttons[currentName];
    if (currentButton) currentButton.active = false;

    const nextName = getNextButtonName(currentName, buttons, direction, true);
    const nextButton = _buttons[nextName];
    if (nextButton) nextButton.active = true;

    return _buttons;
};

const setActiveButton = (buttons: IFormButtons, name: string, active?: boolean) => {
    const _buttons = {...buttons};
    for (const btnName in _buttons) {
        const button = _buttons[btnName];
        if (!button) continue;
        if (typeof active === 'boolean' && !active) {
            button.active = false;
            continue;
        }

        button.active = btnName === name;
    }
    return _buttons;
};
