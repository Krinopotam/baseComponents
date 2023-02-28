import {IDFormApi} from 'baseComponents/dForm/hooks/api';
import {IDFormProps} from 'baseComponents/dForm/dForm';
import {IFormButtons} from 'baseComponents/buttonsRow';
import {mergeObjects} from "helpers/helpersObjects";
import {useMemo} from "react";

export const useGetButtons = (formProps: IDFormProps, formApi: IDFormApi): IFormButtons => {
    return useMemo(() => {
        if (formProps.buttons === null) return {};
        const defaultButtons: IFormButtons = {
            ok: {
                position: 'left',
                active: true,
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
        };

        return mergeObjects(defaultButtons, formProps.buttons);
    }, [formProps.buttons, formApi]);
};