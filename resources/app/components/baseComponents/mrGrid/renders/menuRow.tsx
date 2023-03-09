import React, {useLayoutEffect, useState} from 'react';
import {objectKeysLength} from 'helpers/helpersObjects';
import {ButtonsRow, IFormButtons} from 'baseComponents/buttonsRow';
import {IGridApi} from "baseComponents/mrGrid/hooks/api";
import {useInitButtons} from "baseComponents/mrGrid/hooks/buttons";

interface IGridMenuProps {
    gridApi:IGridApi
}

export const MenuRow = ({gridApi}: IGridMenuProps): JSX.Element | null => {
    const gridProps = gridApi.gridProps;
    const buttons =  useInitButtons(gridApi)

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
        <div style={{width: '100%', paddingBottom: 8, paddingTop: 8}}>
            <ButtonsRow formId={gridApi.getGridId()} buttons={buttons} apiRef={gridApi.buttonsApi} arrowsSelection={false} />
        </div>
    );
};
