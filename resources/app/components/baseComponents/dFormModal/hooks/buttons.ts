import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {IFormButtons} from 'baseComponents/buttonsRow';
import {mergeObjects} from "helpers/helpersObjects";
import {useMemo} from "react";

/** Generate buttons */
export const useInitButtons = (formApi: IDFormModalApi, props: IDFormModalProps) => {
    return useMemo((): IFormButtons => {
        const defaultButtons: IFormButtons = {
            ok: {
                position: 'right',
                active: props.formMode !== 'view',
                hidden: props.formMode === 'view',
                title: 'Сохранить',
                hotKeys: [
                    {key: 'enter', ctrl: true},
                    {key: 's', ctrl: true},
                    {key: 'ы', ctrl: true},
                ],
                onClick: () => {
                    formApi.submitForm();
                },
            },
            cancel: {
                position: 'right',
                title: 'Отмена',
                hotKeys: [{key: 'escape'}],
                active: props.formMode === 'view',
                onClick: () => {
                    formApi.close();
                },
            },
        };

        return mergeObjects(defaultButtons, props.buttons);
    }, [formApi, props.buttons, props.formMode]);
};