import {IDFormModalProps} from "baseComponents/dFormModal/dFormModal";
import {IGridApi} from "baseComponents/grid/hooks/api";
import {useMemo} from "react";
import {IDFormApi} from "baseComponents/dForm/hooks/api";
import {IGridRowData} from "baseComponents/grid/grid";

export const usePrepareEditFormProps = (editFormProps: IDFormModalProps | undefined, gridApi: IGridApi) => {
    return useMemo(() => {
        if (!editFormProps) return undefined;

        const formProps = {...editFormProps};

        if (!formProps.callbacks) formProps.callbacks = {};

        formProps.callbacks.onSubmit = (values: Record<string, unknown>, formApi: IDFormApi) => {
            const result = editFormProps?.callbacks?.onSubmit?.(values, formApi);

            const formMode = formApi.model.getFormMode();
            const formProps = formApi.getFormProps();
            // values contain only controls fields data and not contain all the original values, passed to controls (formData). So, we have to merge
            const updatedRow = {...formProps.dataSet, ...values} as IGridRowData;

            if (formMode === 'create' || formMode === 'clone') {
                const curSelectedKeys = gridApi.getSelectedRowKeys();
                const selectedId = curSelectedKeys.length>0 ? curSelectedKeys[0] : undefined
                gridApi.insertRows(updatedRow, 'after', selectedId, true);
            } else if (formMode === 'update') {
                gridApi.updateRows(updatedRow, true);
            }

            return result;
        };

        return formProps;
    }, [editFormProps, gridApi]);
};