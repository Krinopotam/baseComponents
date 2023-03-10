/**
 * @GridComponent
 * @version 0.0.28.91
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {Grid, IGridDataSource, IGridProps, IGridRowData} from 'baseComponents/grid/grid';
import {IDFormComponentProps, IDFormFieldProps} from './baseComponent';
import React, {useEffect, useMemo, useState} from 'react';

import {IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {IDFormProps} from '../dForm';

// !used in configGenerator parsing. Don't use curly brackets and multi rows comments!
export interface IDFormFieldGridProps extends IDFormFieldProps {
    /** Default value */
    default?: IGridRowData;

    /** Columns properties */
    columns: IGridProps['columns'];

    /** Parameters for remote data fetching*/
    dataSource?: IGridDataSource;

    /** Grid height */
    height?: number;

    /** Hide all edit buttons */
    noButtons?: boolean;

    /** Should confirm before delete */
    confirmDelete?: boolean;

    /** Edit controls properties */
    editFormProps?: IDFormModalProps;
}

export const GridComponent = ({formApi, formProps, fieldName}: IDFormComponentProps): JSX.Element => {
    const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldGridProps;
    const value = formApi.model.getFieldValue(fieldName) as IGridRowData[];

    const [gridMenuVisible, setGridMenuVisible] = useState(false);

    const [gridSticky, buttonsStickyOffset] = useGetStickyProp(formProps, fieldName, gridMenuVisible);

    const callbacks = useMemo(
        () => ({
            onMenuVisibilityChanged: (visible: boolean) => {
                setGridMenuVisible(visible);
            },

            onDataSetChange: (dataSet: IGridRowData[]) => {
                formApi.model.setFieldValue(fieldName, dataSet || null);
                formApi.model.setFieldDirty(fieldName, true);
                formApi.model.setFieldTouched(fieldName, true);
            },
        }),
        [fieldName, formApi.model]
    );

    useEffect(() => {
        formApi.model.setFieldReady(fieldName, true); //TODO rework ready state
    }, [fieldName, formApi.model]);

    return (
        <Grid
            bodyHeight={fieldProps.height}
            buttonsStickyOffset={buttonsStickyOffset}
            callbacks={callbacks}
            columns={fieldProps.columns}
            confirmDelete={fieldProps.confirmDelete}
            dataSet={value}
            editFormProps={fieldProps.editFormProps}
            multiSelect={true}
            noHover={true}
            readonly={formApi.model.isFieldDisabled(fieldName) || formApi.model.isFieldReadOnly(fieldName)}
            rowSelection={{showSelectionColumn: false}}
            size="small"
            sticky={gridSticky}
        />
    );
};

const useGetStickyProp = (formProps: IDFormProps, fieldName: string, gridMenuVisible: boolean) => {
    return useMemo((): [
        (
            | boolean
            | {
                  getContainer?: () => HTMLElement | Window;
                  offsetHeader?: number;
                  offsetScroll?: number;
              }
        ),
        number
    ] => {
        const fieldProps = formProps.fieldsProps[fieldName] as IDFormFieldGridProps;
        if (fieldProps.height) return [false, 0];

        let hasTabs = false;
        for (const name in formProps.fieldsProps) {
            if (!formProps.fieldsProps[name].tab) continue;

            hasTabs = true;
            break;
        }

        const contentOffset = formProps.contentIndent || 12;
        const tabsOffset = hasTabs ? formProps.tabsProps?.height || 40 : 0;
        //const buttonsOffset = fieldProps.noButtons ? 0 : 30;
        const buttonsOffset = !gridMenuVisible ? 0 : 30;
        const offset = contentOffset + tabsOffset + buttonsOffset;

        const gridSticky = {
            getContainer: () => {
                //:TODO добавить в селектор ограничитель, так как форм может быть несколько
                return (document.querySelector('.ant-modal-body') as HTMLElement) || window;
            },
            offsetHeader: offset || 0,
        };

        const buttonsStickyOffset = contentOffset + tabsOffset;

        return [gridSticky, buttonsStickyOffset];
    }, [fieldName, formProps.contentIndent, formProps.tabsProps, formProps.fieldsProps, gridMenuVisible]);
};
