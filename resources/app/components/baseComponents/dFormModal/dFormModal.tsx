/**
 * @DynamicModalForm
 * @version 0.0.33.52
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {IDFormCallbacks, IDFormDataSet, IDFormProps} from 'baseComponents/dForm/dForm';
import {IDFormModalApi, useInitModalFormApi} from 'baseComponents/dFormModal/hooks/api';
import React, { useEffect, useMemo, useState } from 'react';

import {DFormModalRender} from './renders/dFormModalRender';
import {IButtonsRowApi} from 'baseComponents/buttonsRow';
import {getUuid} from 'helpers/helpersString';
import { splitObject } from 'helpers/helpersObjects';
import {useCallbacks} from 'baseComponents/dFormModal/hooks/callbacks';
import {useGetActualProps} from 'baseComponents/dForm/hooks/actualProps';
import {useInitButtons} from 'baseComponents/dFormModal/hooks/buttons';
import {useUpdateMessageBoxTheme} from 'baseComponents/messageBox/hooks/updateModalTheme';

//import './dFormModal.css';

//region Types
// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormModalProps extends IDFormProps {
    /** Modal controls callbacks */
    callbacks?: IDFormModalCallbacks;

    /** Confirm message before the form closing, if form is dirty */
    closeFormConfirmMessage?: React.ReactNode;

    /** Modal controls title */
    title?: string;

    /**Modal window width */
    width?: number;

    /**Modal window min width */
    minWidth?: number;

    /**Modal window max width */
    maxWidth?: number;

    /** Content body height*/
    bodyHeight?: number;

    /** Content body min height*/
    bodyMinHeight?: number;

    /** Content body max height*/
    bodyMaxHeight?: number;

    /** Content body CSS style (will be overwritten by bodyHeight, bodyMinHeight, bodyMaxHeight if set)*/
    bodyStyle?: React.CSSProperties;

    /** Content body wil not be scrollable */
    notScrollable?: boolean;

    /** Is modal can be resizable */
    resizable?: boolean;

    /** Is controls visible (for open for without api) */
    isOpened?: boolean;
}

export interface IDFormModalCallbacks extends IDFormCallbacks {
    onOpen?: (
        formApi: IDFormModalApi,
        mode: IDFormProps['formMode'],
        dataSet: IDFormDataSet | undefined,
        formParentData: IDFormDataSet | undefined
    ) => boolean | void;
    onOpened?: (formApi: IDFormModalApi, mode: IDFormProps['formMode'], dataSet: IDFormDataSet | undefined, formParentData: IDFormDataSet | undefined) => void;
    onClosing?: (formApi: IDFormModalApi, mode: IDFormProps['formMode']) => boolean | void;
    onClosed?: (formApi: IDFormModalApi, mode: IDFormProps['formMode']) => void;
}

//endregion

export const DFormModal = (props: IDFormModalProps): JSX.Element => {
    useUpdateMessageBoxTheme(); //set current theme to messageBox

    const [modalId] = useState(getUuid());
    const [modalFormProps, updateModalFormProps] = useGetActualProps(props); //props can be set both by parent component and via api

    const [formProps] = useSeparateProps(modalFormProps); // separates form props from modal props

    //region Init api
    const [formApi, setFormApi] = useState((modalFormProps.apiRef || {}) as IDFormModalApi);
    const [buttonsApi] = useState({} as IButtonsRowApi);
    const buttons = useInitButtons(formApi, modalFormProps);
    useInitModalFormApi(formApi, modalFormProps, buttonsApi, updateModalFormProps);

    //endregion

    const formCallbacks = useCallbacks(formApi, modalFormProps);

    //region Destructor
    useEffect(() => {
        return () => {
            setFormApi({} as IDFormModalApi); //clear api on component destroy
        };
    }, []);

    //endregion

    return (
        <DFormModalRender
            modalId={modalId}
            formApi={formApi}
            modalFormProps={modalFormProps}
            formProps={formProps}
            buttons={buttons}
            buttonsApi={buttonsApi}
            callbacks={formCallbacks}
        />
    );
};

const useSeparateProps = (props: IDFormModalProps) => {
    return useMemo((): [IDFormProps] => {
        const result = splitObject(props, [
            'notScrollable',
            'title',
            'minWidth',
            'maxWidth',
            'title',
            'bodyHeight',
            'bodyMinHeight',
            'bodyMaxHeight',
            'bodyStyle',
            'resizable',
            'isOpened',
            'closeFormConfirmMessage',
            
            //---Common props ------
            'apiRef',
            'buttons',
            'callbacks',
        ]);

        //const modalProps = result[0] as IDFormModalBaseProps;
        const formProps = result[1] as IDFormProps;

        formProps.buttons = null; //clear form buttons because the modal form has it own buttons

        return [formProps];
    }, [props]);
};
