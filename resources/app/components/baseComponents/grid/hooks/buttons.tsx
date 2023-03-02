import {IFormButton, IFormButtons} from 'baseComponents/buttonsRow';
import React, {useLayoutEffect, useState} from 'react';
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {MessageBox} from 'baseComponents/messageBox';
import {mergeObjects} from 'helpers/helpersObjects';
import {IGridRowData} from 'baseComponents/grid/grid';
import {IGridApi} from 'baseComponents/grid/hooks/api';

export const useInitButtons = (gridApi: IGridApi): IFormButtons => {
    const [gridButtons, setGridButtons] = useState({});
    const buttons = gridApi.gridProps.buttons;
    const selectedRowsKeys = gridApi.getSelectedRowKeys();
    useLayoutEffect(() => {
        const selectedRows = gridApi.getSelectedRows();
        const defaultButtons = {
            view: getViewButton(gridApi, selectedRows),
            create: getCreateButton(gridApi, selectedRows),
            clone: getCloneButton(gridApi, selectedRows),
            update: getUpdateButton(gridApi, selectedRows),
            delete: getDeleteButton(gridApi, selectedRows),
        } as IFormButtons;

        setGridButtons(mergeObjects(defaultButtons, buttons));
    }, [gridApi, buttons, selectedRowsKeys]);

    return gridButtons;
};

/** Get view button props */
const getViewButton = (gridApi: IGridApi, selectedRows: IGridRowData[]): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    const editFormApi = gridApi.editFormApi;
    if (!gridProps.editFormProps || !gridProps.readonly || gridProps.buttons?.view === null) return undefined;

    return {
        title: 'Просмотреть',
        icon: <EyeOutlined />,
        position: 'right',
        size: 'small',
        disabled: selectedRows.length !== 1,
        onClick: () => {
            editFormApi.open('view', {...selectedRows[0]}, {...selectedRows[0]});
        },
    };
};

/** Get create button props */
const getCreateButton = (gridApi: IGridApi, selectedRows: IGridRowData[]): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    const editFormApi = gridApi.editFormApi;
    if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.create === null) return undefined;
    return {
        title: 'Создать',
        icon: <PlusOutlined />,
        position: 'right',
        size: 'small',
        onClick: () => {
            editFormApi.open('create', undefined, {...selectedRows[0]});
        },
    };
};

/** Get clone button props */
const getCloneButton = (gridApi: IGridApi, selectedRows: IGridRowData[]): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    const editFormApi = gridApi.editFormApi;
    if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.clone === null) return undefined;

    return {
        title: 'Клонировать',
        icon: <CopyOutlined />,
        position: 'right',
        size: 'small',
        disabled: selectedRows.length !== 1,
        onClick: () => {
            editFormApi.open('clone', {...selectedRows[0]}, {...selectedRows[0]});
        },
    };
};

/** Get update button props */
const getUpdateButton = (gridApi: IGridApi, selectedRows: IGridRowData[]): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    const editFormApi = gridApi.editFormApi;
    if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.update === null) return undefined;

    return {
        title: 'Редактировать',
        icon: <EditOutlined />,
        position: 'right',
        size: 'small',
        disabled: selectedRows.length !== 1,
        onClick: () => {
            editFormApi.open('update', {...selectedRows[0]}, {...selectedRows[0]});
        },
    };
};

/** Get delete button props */
const getDeleteButton = (gridApi: IGridApi, selectedRows: IGridRowData[]): IFormButton | undefined => {
    const gridProps = gridApi.gridProps;
    if (!gridProps.editFormProps || gridProps.readonly || gridProps.buttons?.delete === null) return undefined;

    return {
        title: 'Удалить',
        icon: <DeleteOutlined />,
        position: 'right',
        danger: true,
        size: 'small',
        disabled: selectedRows.length === 0,
        onClick: () => {
            if (gridProps.confirmDelete) {
                MessageBox.confirm({
                    content: gridProps.rowDeleteMessage || 'Удалить выбранные строки?',
                    type: 'error',
                    onOk: () => {
                        gridApi.deleteRows(selectedRows, true);
                        gridProps.callbacks?.onDelete?.(selectedRows);
                    },
                });
                return;
            }

            // TODO: remove dataStoreDelete
            if (gridProps.dataStoreDelete) {
                gridProps.dataStoreDelete.param = {idList: gridApi.getSelectedRowKeys() as string[]};
                gridProps.dataStoreDelete.fetch({idList: gridApi.getSelectedRowKeys() as string[]}, true, () => {
                    gridApi.deleteRows(selectedRows, true);
                });
            }
        },
    };
};
