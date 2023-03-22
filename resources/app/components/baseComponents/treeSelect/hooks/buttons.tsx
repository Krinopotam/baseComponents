import {IFormButtons} from 'baseComponents/buttonsRow';
import {isPromise, mergeObjects} from 'helpers/helpersObjects';
import React, {useMemo} from 'react';
import {ITreeSelectApi} from 'baseComponents/treeSelect';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {IDFormModalApi} from 'baseComponents/dFormModal/hooks/api';
import {MessageBoxApi} from 'baseComponents/messageBox/messageBoxApi';
import {MessageBox} from 'baseComponents/messageBox';
import {ITreeSelectDeletePromise} from 'baseComponents/treeSelect/treeSelect';

/** Generate buttons */
export const useInitButtons = (api: ITreeSelectApi, formApi: IDFormModalApi) => {
    const selectedNodes = api.getValues();
    const treeProps = api.getProps();
    return useMemo((): IFormButtons => {
        const defaultButtons: IFormButtons = {
            add: {
                icon: <PlusOutlined />,
                tooltip: 'Добавить',
                position: 'left',
                onClick: () => {
                    formApi.open('create');
                },
            },
            edit: {
                icon: <EditOutlined />,
                tooltip: 'Редактировать',
                position: 'center',
                disabled: !selectedNodes || selectedNodes.length !== 1,
                onClick: () => {
                    const values = api.getValues();
                    if (values.length !== 1) return;
                    formApi.open('update', values[0]);
                },
            },
            delete: {
                icon: <DeleteOutlined />,
                tooltip: 'Удалить',
                position: 'right',
                disabled: !selectedNodes || selectedNodes.length < 1,
                onClick: () => {
                    deleteHandler(api);
                },
            },
        };

        return mergeObjects(defaultButtons, treeProps.editButtons);
    }, [api, formApi, selectedNodes, treeProps.editButtons]);
};

const deleteHandler = (api: ITreeSelectApi) => {
    const treeProps = api.getProps();
    const selectedNodes = api.getValues();
    if (selectedNodes.length < 1) return;

    let messageBox: MessageBoxApi;
    const removeRows = () => {
        const deletePromise = treeProps.callbacks?.onDelete?.(selectedNodes, api);

        if (isPromise(deletePromise)) {
            if (!treeProps.confirmDelete) {
                api.buttonsApi.loading('delete', true);
                api.buttonsApi.disabled('add', true);
                api.buttonsApi.disabled('edit', true);
            }
            const promiseResult = deletePromise as ITreeSelectDeletePromise;
            promiseResult
                .then(() => {
                    if (!api.isMounted()) return;
                    api.deleteNodes(selectedNodes);
                    api.setValues(null);
                    if (!treeProps.confirmDelete) {
                        api.buttonsApi.loading('delete', false);
                        api.buttonsApi.disabled('delete', true);
                        api.buttonsApi.disabled('add', false);
                    } else messageBox?.destroy();
                })
                .catch((error) => {
                    if (!api.isMounted()) return;
                    if (!treeProps.confirmDelete) {
                        api.buttonsApi.loading('delete', false);
                        api.buttonsApi.disabled('add', false);
                        api.buttonsApi.disabled('edit', false);
                    } else messageBox?.destroy();
                    MessageBox.alert({content: error.message, type: 'error'});
                });
            return;
        }

        api.deleteNodes(selectedNodes);
        api.setValues(null);
        if (messageBox) messageBox.destroy();
    };

    if (treeProps.confirmDelete) {
        messageBox = MessageBox.confirmWaiter({
            content: treeProps.nodeDeleteMessage || 'Удалить выбранные строки?',
            onOk: removeRows,
        });
    } else {
        removeRows();
    }
};
