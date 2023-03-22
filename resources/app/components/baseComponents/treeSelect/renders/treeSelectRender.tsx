import {TreeSelect as AntdTreeSelect} from 'antd';
import React from 'react';
import {ITreeSelectProps} from 'baseComponents/treeSelect';
import {useDropdownStyle} from 'baseComponents/treeSelect/hooks/dropdownStyle';
import {NotFound} from 'baseComponents/treeSelect/renders/notFound';
import {useDefaultDropdownRender} from 'baseComponents/treeSelect/hooks/defaultDropdownRender';
import {ITreeSelectApi} from 'baseComponents/treeSelect/hooks/api';
import {IAntTreeSelectProps} from 'baseComponents/treeSelect/treeSelect';
import {useDefaultFilter} from "baseComponents/treeSelect/hooks/filter";

// For clarity. Antd has labels for a node(1) and for the selected value(2). fieldNames.label property sets the node label(1) and treeNodeLabelProp sets the selected value label(2)
// In order not to get confused, we will consider Node's label is title(1), and Label of the selected value is label(2)
// For the implementation of the capabilities of the Title & Labels  renders, we add to dataSet 2 service fields: __title & __label
export const TreeSelectRender = ({
    api,
    antProps,
}: ITreeSelectProps & {
    api: ITreeSelectApi;
    antProps: IAntTreeSelectProps;
}) => {
    const treeProps = api.getProps();
    const _dropdownStyle = useDropdownStyle(treeProps.dropdownStyle);
    const defaultDropdownRender = useDefaultDropdownRender({fetchError: api.getFetchError(), fetching: api.getIsFetching(), minSymbols: api.getMinSymbols()});
    const defaultFilter = useDefaultFilter(api);

    return (
        <AntdTreeSelect
            {...antProps}
            treeData={api.getDataSet()}
            showSearch={treeProps.showSearch !== false}
            treeDefaultExpandAll={treeProps.treeDefaultExpandAll !== false}
            disabled={treeProps.disabled || treeProps.readOnly} //TODO: implement true readOnly
            //labelInValue // We do not use this mode, as it is useless. In this mode, onChange will return an object containing value and label, but you still can’t build a full node
            //loadData={onLoadData}

            dropdownStyle={_dropdownStyle}
            fieldNames={{
                //Customize node label, value, children field name. __title - special service field to show rendered node label
                label: !treeProps.titleRender ? treeProps.fieldNames?.title || 'title' : '__title',
                value: treeProps.fieldNames?.value ? treeProps.fieldNames.value : 'id',
                children: treeProps.fieldNames?.children ? treeProps.fieldNames.children : 'children',
            }}
            treeNodeLabelProp={
                treeProps.selectedLabelProp ? treeProps.selectedLabelProp : treeProps.labelRender ? '__label' : treeProps.fieldNames?.title || 'title'
            } //Selected value label. Will render as content of select. Default: title
            treeNodeFilterProp={treeProps.titleRender ? '__title' : treeProps.fieldNames?.title || 'title'} //Field to be  used for filtering if filterTreeNode returns true. Default: title
            filterTreeNode={(inputValue, treeNode) => {
                //Whether to filter treeNodes by input value. The value of treeNodeFilterProp is used for filtering by default
                if (!api.getIsAllFetched()) return true; //Data filtration when requested from the server is carried out by a server
                if (!treeProps.filterTreeNode) return defaultFilter(inputValue, treeNode);

                if (typeof treeProps.filterTreeNode === 'function') return treeProps.filterTreeNode(inputValue, treeNode);
                else return treeProps.filterTreeNode;
            }}
            value={api.getInternalValue()}
            onClear={() => {
                treeProps.callbacks?.onClear?.();
                api.setValues(null);
            }}
            onChange={(value) => {
                const selectedNodes = api.plainValueToNodes(value);
                api.setValues(selectedNodes || null);
            }}
            onDropdownVisibleChange={(open: boolean) => {
                if (open && (treeProps.fetchMode === 'onUse' || treeProps.fetchMode === 'onUseForce')) api.fetchData('');
            }}
            onSearch={(searchString) => {
                api.fetchData(searchString, true);
            }}
            notFoundContent={
                treeProps.notFoundContent || <NotFound fetching={api.getIsFetching()} error={api.getFetchError()} minSymbols={api.getMinSymbols()} />
            }
            dropdownRender={treeProps.dropdownRender || defaultDropdownRender}
        />
    );
};

