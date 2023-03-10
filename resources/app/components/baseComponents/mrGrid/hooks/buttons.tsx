import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import React, {useLayoutEffect, useMemo, useState} from 'react';
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {MessageBox} from 'baseComponents/messageBox';
import {isPromise, mergeObjects} from 'helpers/helpersObjects';
import {IGridApi} from 'baseComponents/mrGrid/hooks/api';
import {IGridDeletePromise, IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {MessageBoxApi} from 'components/baseComponents/messageBox/messageBoxApi';

export const useInitButtons = (gridApi: IGridApi): IFormButtons => {
    const [gridButtons, setGridButtons] = useState({});
    const buttons = gridApi.gridProps.buttons;
    const selectedRowKeys = gridApi.getSelectedRowKeys(true) as string[];
    const activeRowKey = gridApi.getActiveRowKey();

    const vewButton = useGetViewButton(gridApi, activeRowKey, selectedRowKeys);
    const createButton = useGetCreateButton(gridApi);
    const cloneButton = useGetCloneButton(gridApi, activeRowKey, selectedRowKeys);
    const updateButton = useGetUpdateButton(gridApi, activeRowKey, selectedRowKeys);
    const deleteButton = useGetDeleteButton(gridApi, selectedRowKeys);

    useLayoutEffect(() => {
        const defaultButtons = {
            view: vewButton,
            create: createButton,
            clone: cloneButton,
            update: updateButton,
            delete: deleteButton,
        } as IFormButtons;

        setGridButtons(mergeObjects(defaultButtons, buttons));
    }, [gridApi, buttons, activeRowKey, selectedRowKeys, deleteButton, vewButton, createButton, cloneButton, updateButton]);

    return gridButtons;
};

/** Get view button props */
const useGetViewButton = (gridApi: IGridApi, activeRowKey: string, selectedRowKeys: string[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || !gridProps.readonly || gridProps.buttons?.view === null) return undefined;

        return {
            title: 'Просмотреть',
            icon: <EyeOutlined />,
            position: 'left',
            size: 'small',
            disabled: !activeRowKey || selectedRowKeys.length !== 1,
            onClick: () => {
                const activeRow = gridApi.getActiveNode();
                if (!activeRow) return;
                editFormApi.open('view', {...activeRow.original}, {...activeRow.original}); //TODO get parent row
            },
        };
    }, [activeRowKey, gridApi, selectedRowKeys.length]);
};

/** Get create button props */
const useGetCreateButton = (gridApi: IGridApi): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;

        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.create === null) return undefined;
        return {
            title: 'Создать',
            icon: <PlusOutlined />,
            position: 'left',
            size: 'small',
            onClick: () => {
                const activeRow = gridApi.getActiveNode();
                const formParent = activeRow ? {...activeRow?.original} : undefined;
                editFormApi.open('create', undefined, formParent);
            },
        };
    }, [gridApi]);
};

/** Get clone button props */
const useGetCloneButton = (gridApi: IGridApi, activeRowKey: string, selectedRowKeys: string[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.clone === null) return undefined;

        return {
            title: 'Клонировать',
            icon: <CopyOutlined />,
            position: 'left',
            size: 'small',
            disabled: !activeRowKey || selectedRowKeys.length !== 1,
            onClick: () => {
                const activeRow = gridApi.getActiveNode();
                if (!activeRow) return;
                editFormApi.open('clone', {...activeRow.original}, {...activeRow.original}); //TODO get parent row
            },
        };
    }, [activeRowKey, gridApi, selectedRowKeys.length]);
};

/** Get update button props */
const useGetUpdateButton = (gridApi: IGridApi, activeRowKey: string, selectedRowKeys: string[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.update === null) return undefined;

        return {
            title: 'Редактировать',
            icon: <EditOutlined />,
            position: 'left',
            size: 'small',
            disabled: !activeRowKey || selectedRowKeys.length !== 1,
            onClick: () => {
                const activeRow = gridApi.getActiveNode();
                if (!activeRow) return;
                editFormApi.open('update', {...activeRow.original}, {...activeRow.original}); //TODO get parent row
            },
        };
    }, [activeRowKey, gridApi, selectedRowKeys.length]);
};

/** Get delete button props */
const useGetDeleteButton = (gridApi: IGridApi, selectedRowKeys: string[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.delete === null) return undefined;

        return {
            title: 'Удалить',
            icon: <DeleteOutlined />,
            position: 'left',
            danger: true,
            size: 'small',
            disabled: !selectedRowKeys || selectedRowKeys.length === 0,
            onClick: () => {
                deleteHandler(gridApi);
            },
        };
    }, [gridApi, selectedRowKeys]);
};

const deleteHandler = (gridApi: IGridApi) => {
    const gridProps = gridApi.gridProps;
    const selectedRows = gridApi.getSelectedRows(true) as IGridRowData[];

    let messageBox: MessageBoxApi;
    const removeRows = () => {
        const deletePromise = gridProps.callbacks?.onDelete?.(selectedRows, gridApi);

        if (isPromise(deletePromise)) {
            if (!gridProps.confirmDelete) gridApi.setIsLoading(true);
            const promiseResult = deletePromise as IGridDeletePromise;
            promiseResult
                .then(() => {
                    if (!gridApi.getIsMounted()) return;
                    gridApi.deleteRows(selectedRows, true);
                    if (!gridProps.confirmDelete) gridApi.setIsLoading(false);
                    else if (messageBox) messageBox.destroy();
                })
                .catch((error) => {
                    if (!gridApi.getIsMounted()) return;
                    if (!gridProps.confirmDelete) gridApi.setIsLoading(false);
                    else if (messageBox) messageBox.destroy();
                    MessageBox.alert({content: error.message, type: 'error'});
                });
            return;
        }

        gridApi.deleteRows(selectedRows, true);
        if (messageBox) messageBox.destroy();
    };

    if (gridProps.confirmDelete) {
        messageBox = MessageBox.confirmWaiter({
            content: gridProps.rowDeleteMessage || 'Удалить выбранные строки?',
            onOk: removeRows,
        });
    } else {
        removeRows();
    }
};
