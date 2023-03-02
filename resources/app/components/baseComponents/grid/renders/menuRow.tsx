import React, {useLayoutEffect, useState} from 'react';
import {objectKeysLength} from 'helpers/helpersObjects';
import {ButtonsRow, IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';
import {IFormType} from 'baseComponents/modal';
import {IGridProps} from 'baseComponents/grid/grid';
import {theme} from 'antd';

interface IGridMenuProps {
    buttons: IFormButtons | undefined;
    buttonsApi?: IButtonsRowApi;
    formType?: IFormType;
    gridId: string;
    gridProps: IGridProps;
}

const {useToken} = theme;

export const MenuRow = (props: IGridMenuProps): JSX.Element | null => {
    const {token} = useToken();

    const {buttons, gridProps} = props;

    const [isMenuVisible, setIsMenuVisible] = useState<boolean | undefined>(undefined);

    useLayoutEffect(() => {
        const menuVisible = objectKeysLength(buttons) > 0;
        if (typeof isMenuVisible === 'undefined' || isMenuVisible !== menuVisible) {
            setIsMenuVisible(menuVisible);
            if (gridProps.callbacks?.onMenuVisibilityChanged) gridProps.callbacks.onMenuVisibilityChanged(menuVisible);
        }
    }, [buttons, gridProps.callbacks, gridProps.callbacks?.onMenuVisibilityChanged, isMenuVisible]);

    if (!buttons) return null;

    return (
        <div style={{width: '100%', backgroundColor: token.colorBgElevated, paddingBottom: 5, paddingTop: 5}}>
            <ButtonsRow formId={props.gridId} buttons={buttons} apiRef={props.buttonsApi} arrowsSelection={false} />
        </div>
    );

/*
    return (
        <div style={{width: '100%', backgroundColor: token.colorBgElevated, height: isMenuVisible ? '40px' : '0', overflow: 'hidden'}}>
            <div style={{width: '100%', height: '3px'}} />
            <ButtonsRow formId={props.gridId} buttons={buttons} apiRef={props.buttonsApi} arrowsSelection={false} />
            <div style={{width: '100%', height: '3px'}} />
        </div>
    );*/
};
