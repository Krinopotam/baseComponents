/**
 * @RenderFormFooter
 * @version 0.0.28.83
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {ButtonsRow, IButtonsRowApi, IFormButtons} from 'baseComponents/buttonsRow';

import React from 'react';

interface ITreeSelectButtonsRenderProps {
    /** container ID */
    containerId: string;

    /** form buttons collection */
    buttons?: IFormButtons;

    /** Form buttons api */
    buttonsApi?: IButtonsRowApi;

    /** Any context. Will use in buttons callbacks  */
    context?: unknown;
}

export const ButtonsRender = ({containerId, buttons, buttonsApi, context}: ITreeSelectButtonsRenderProps): JSX.Element | null => {
    if (!buttons || Object.keys(buttons).length === 0) return null;

    return <ButtonsRow formId={containerId} buttons={buttons} apiRef={buttonsApi} context={context} arrowsSelection={false} />;
};
