import {IGridApi} from 'baseComponents/mrGrid/hooks/api';
import {useMemo} from 'react';
import {IDFormApi} from 'baseComponents/dForm/hooks/api';
import {IGridRowData} from 'baseComponents/mrGrid/mrGrid';
import {getUuid} from 'helpers/helpersString';

export const usePrepareEditFormProps = (gridApi: IGridApi) => {
    return useMemo(() => {
        const editFormProps = gridApi.gridProps.editFormProps;
        if (!editFormProps) return undefined;

        const formProps = {...editFormProps};

        const prevOnSubmitSuccess = editFormProps?.callbacks?.onSubmitSuccess;
        if (!formProps.callbacks) formProps.callbacks = {};

        formProps.callbacks.onSubmitSuccess = (values: Record<string, unknown>, resultValues: Record<string, unknown> | undefined, formApi: IDFormApi) => {
            if (prevOnSubmitSuccess && prevOnSubmitSuccess(values, resultValues, formApi) === false) return false;
            const updatedRow = {...formApi.model.getFormDataSet(), ...resultValues} as IGridRowData;

            const formMode = formApi.model.getFormMode();

            if (formMode === 'create' || formMode === 'clone') {
                if (!updatedRow.id) updatedRow.id = getUuid();
                const curSelectedKeys = gridApi.getSelectedRowKeys() as string[];
                const selectedId = curSelectedKeys.length > 0 ? curSelectedKeys[0] : undefined;
                gridApi.insertRows(updatedRow, 'after', selectedId, true);
            } else if (formMode === 'update') {
                gridApi.updateRows(updatedRow, true);
            }
        };

        return formProps;
    }, [gridApi]);
};
