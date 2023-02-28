/**
 * @RenderFormFooter
 * @version 0.0.28.83
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {ButtonsRow, IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';

import {IFormType} from '../modal';
import React from 'react';

interface IFormButtonsRenderProps {
    /** form ID */
    formId: string;

    /** form buttons collection */
    buttons?: IFormButtons;

    /** Form buttons api */
    buttonsApi?: IButtonsRowApi;

    /** form type */
    formType?: IFormType;

    /** buttons container style */
    containerStyle?: React.CSSProperties;

    /** allow select buttons using arrows keys */
    arrowsSelection?: boolean;

    /** Any context. Will use in buttons callbacks  */
    context?: unknown;
}

export const ButtonsRender = ({
    formId,
    formType,
    buttons,
    buttonsApi,
    containerStyle,
    arrowsSelection,
    context,
}: IFormButtonsRenderProps): JSX.Element | null => {
    if (!buttons || Object.keys(buttons).length === 0) return null;

    return (
        <div style={containerStyle}>
            <ButtonsRow formId={formId} buttons={buttons} apiRef={buttonsApi} formType={formType} arrowsSelection={arrowsSelection} context={context} />
        </div>
    );
};
