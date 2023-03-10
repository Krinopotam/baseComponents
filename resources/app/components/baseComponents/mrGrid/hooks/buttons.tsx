import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import React, {useLayoutEffect, useState} from 'react';
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {MessageBox} from 'baseComponents/messageBox';
import {mergeObjects} from 'helpers/helpersObjects';
import {IGridApi} from 'baseComponents/mrGrid/hooks/api';
import {IGridRowData} from "baseComponents/mrGrid/mrGrid";

export const useInitButtons = (gridApi: IGridApi): IFormButtons => {
    const [gridButtons, setGridButtons] = useState({});
    const buttons = gridApi.gridProps.buttons;
    const selectedRowKeys = gridApi.getSelectedRowKeys(true) as string[];
    const activeRowKey = gridApi.getActiveRowKey();
    useLayoutEffect(() => {
        const defaultButtons = {
            view: getViewButton(gridApi, activeRowKey, selectedRowKeys),
            create: getCreateButton(gridApi),
            clone: getCloneButton(gridApi, activeRowKey, selectedRowKeys),
            update: getUpdateButton(gridApi, activeRowKey, selectedRowKeys),
            delete: getDeleteButton(gridApi, selectedRowKeys),
        } as IFormButtons;

        setGridButtons(mergeObjects(defaultButtons, buttons));
    }, [gridApi, buttons, activeRowKey, selectedRowKeys]);

    return gridButtons;
};

/** Get view button props */
const getViewButton = (gridApi: IGridApi, activeRowKey: string, selectedRowKeys: string[]): IFormButton | undefined => {
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
            const activeRow = gridApi.getActiveRow()
            if (!activeRow) return
            editFormApi.open('view', {...activeRow.original}, {...activeRow.original}); //TODO get parent row
        },
    };
};

/** Get create button props */
const getCreateButton = (gridApi: IGridApi): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    const editFormApi = gridApi.editFormApi;
    if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.create === null) return undefined;
    return {
        title: 'Создать',
        icon: <PlusOutlined />,
        position: 'left',
        size: 'small',
        onClick: () => {
            const activeRow = gridApi.getActiveRow()
            const formParent = activeRow ? {...activeRow?.original} : undefined
            editFormApi.open('create', undefined, formParent);
        },
    };
};

/** Get clone button props */
const getCloneButton = (gridApi: IGridApi, activeRowKey: string, selectedRowKeys: string[]): IFormButton | undefined => {
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
            const activeRow = gridApi.getActiveRow()
            if (!activeRow) return
            editFormApi.open('clone', {...activeRow.original}, {...activeRow.original}); //TODO get parent row
        },
    };
};

/** Get update button props */
const getUpdateButton = (gridApi: IGridApi, activeRowKey: string, selectedRowKeys: string[]): IFormButton | undefined => {
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
            const activeRow = gridApi.getActiveRow()
            if (!activeRow) return
            editFormApi.open('update', {...activeRow.original}, {...activeRow.original}); //TODO get parent row
        },
    };
};

/** Get delete button props */
const getDeleteButton = (gridApi: IGridApi, selectedRowKeys: string[]): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.delete === null) return undefined;

    return {
        title: 'Удалить',
        icon: <DeleteOutlined />,
        position: 'left',
        danger: true,
        size: 'small',
        disabled: !selectedRowKeys || selectedRowKeys.length===0,
        onClick: () => {
            const selectedRows = gridApi.getSelectedRowsData(true) as IGridRowData[]
            const deleteHandler = () => {
                gridApi.deleteRows(selectedRowKeys, true);
                gridProps.callbacks?.onDelete?.(selectedRows);
            }

            if (gridProps.confirmDelete) {
                MessageBox.confirmWaiter({
                    content: gridProps.rowDeleteMessage || 'Удалить выбранные строки?',
                    type: 'error',
                    onOk: deleteHandler,
                });
            }
            else {
                //gridApi.buttonsApi.loading('delete', true)
                deleteHandler()
            }
        },
    };
};
