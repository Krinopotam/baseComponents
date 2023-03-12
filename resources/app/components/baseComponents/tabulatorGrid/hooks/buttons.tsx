import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import React, {useCallback, useMemo, useState} from 'react';
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {MessageBox} from 'baseComponents/messageBox';
import {isPromise, mergeObjects} from 'helpers/helpersObjects';
import {MessageBoxApi} from 'components/baseComponents/messageBox/messageBoxApi';
import {IGridApi} from "baseComponents/tabulatorGrid/hooks/api";
import {IGridDeletePromise, IGridRowData} from "baseComponents/tabulatorGrid/tabulatorGrid";

export const useInitButtons = (gridApi: IGridApi): IFormButtons => {
    const [,refreshButtons] = useState({});
    const buttons = gridApi.gridProps.buttons;
    const activeRowKey = gridApi.getActiveRowKey();
    const selectedRows = gridApi.getSelectedRows() as IGridRowData[];

    gridApi.buttonsApi.refreshButtons = useRefreshButtons(refreshButtons);

    const vewButton = useGetViewButton(gridApi, activeRowKey, selectedRows);
    const createButton = useGetCreateButton(gridApi);
    const cloneButton = useGetCloneButton(gridApi, activeRowKey, selectedRows);
    const updateButton = useGetUpdateButton(gridApi, activeRowKey, selectedRows);
    const deleteButton = useGetDeleteButton(gridApi, selectedRows);

    const gridButtons = useMemo(()=>{
        const defaultButtons = {
            view: vewButton,
            create: createButton,
            clone: cloneButton,
            update: updateButton,
            delete: deleteButton,
        } as IFormButtons;

        return mergeObjects(defaultButtons, buttons);
    }, [buttons, cloneButton, createButton, deleteButton, updateButton, vewButton])

    return gridButtons;
};

const useRefreshButtons = ( refreshButtons: React.Dispatch<React.SetStateAction<Record<string, unknown>>>)=>{
    return useCallback(()=>{
        refreshButtons({})
    }, [refreshButtons])
}

/** Get view button props */
const useGetViewButton = (gridApi: IGridApi, activeRowKey: string|number|undefined, selectedRow: IGridRowData[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || !gridProps.readonly || gridProps.buttons?.view === null) return undefined;

        return {
            title: 'Просмотреть',
            icon: <EyeOutlined />,
            position: 'right',
            size: 'small',
            disabled: !activeRowKey || selectedRow.length !== 1,
            onClick: () => {
                const activeRow = gridApi.getActiveRow();
                if (!activeRow) return;
                editFormApi.open('view', {...activeRow}, {...activeRow}); //TODO get parent row
            },
        };
    }, [activeRowKey, gridApi, selectedRow.length]);
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
            position: 'right',
            size: 'small',
            onClick: () => {
                const activeRow = gridApi.getActiveRow();
                const formParent = activeRow ? {...activeRow} : undefined;
                editFormApi.open('create', undefined, formParent);
            },
        };
    }, [gridApi]);
};

/** Get clone button props */
const useGetCloneButton = (gridApi: IGridApi, activeRowKey: string|number|undefined, selectedRow: IGridRowData[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.clone === null) return undefined;

        return {
            title: 'Клонировать',
            icon: <CopyOutlined />,
            position: 'right',
            size: 'small',
            disabled: !activeRowKey || selectedRow.length !== 1,
            onClick: () => {
                const activeRow = gridApi.getActiveRow();
                if (!activeRow) return;
                editFormApi.open('clone', {...activeRow}, {...activeRow}); //TODO get parent row
            },
        };
    }, [activeRowKey, gridApi, selectedRow.length]);
};

/** Get update button props */
const useGetUpdateButton = (gridApi: IGridApi, activeRowKey: string|number|undefined, selectedRow: IGridRowData[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        const editFormApi = gridApi.editFormApi;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.update === null) return undefined;

        return {
            title: 'Редактировать',
            icon: <EditOutlined />,
            position: 'right',
            size: 'small',
            disabled: !activeRowKey || selectedRow.length !== 1,
            onClick: () => {
                const activeRow = gridApi.getActiveRow();
                if (!activeRow) return;
                editFormApi.open('update', {...activeRow}, {...activeRow}); //TODO get parent row
            },
        };
    }, [activeRowKey, gridApi, selectedRow.length]);
};

/** Get delete button props */
const useGetDeleteButton = (gridApi: IGridApi, selectedRows: IGridRowData[]): IFormButton | undefined => {
    return useMemo(() => {
        const gridProps = gridApi.gridProps;
        if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.delete === null) return undefined;

        return {
            title: 'Удалить',
            icon: <DeleteOutlined />,
            position: 'right',
            danger: true,
            size: 'small',
            disabled: !selectedRows || selectedRows.length === 0,
            onClick: () => {
                deleteHandler(gridApi);
            },
        };
    }, [gridApi, selectedRows]);
};

const deleteHandler = (gridApi: IGridApi) => {
    const gridProps = gridApi.gridProps;
    const selectedRows = gridApi.getSelectedRows() as IGridRowData[];

    let messageBox: MessageBoxApi;
    const removeRows = () => {
        const deletePromise = gridProps.callbacks?.onDelete?.(selectedRows, gridApi);

        if (isPromise(deletePromise)) {
            if (!gridProps.confirmDelete) gridApi.setIsLoading(true);
            const promiseResult = deletePromise as IGridDeletePromise;
            promiseResult
                .then(() => {
                    if (!gridApi.getIsMounted()) return;
                    gridApi.deleteRows(selectedRows);
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

        gridApi.deleteRows(selectedRows);
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
