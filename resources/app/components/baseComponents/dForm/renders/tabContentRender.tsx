/**
 * @RenderFields
 * @version 0.0.30.65
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, { useSyncExternalStore } from 'react';

import { BaseComponent } from '../components/baseComponent';
import { FieldGroupRender } from './fieldGroupRender';
import { IDFormApi } from "baseComponents/dForm/hooks/api";
import { IDFormProps } from '../dForm';

interface IFieldsRenderProps {
    /** Tab name */
    tabName: string;

    /** form api instance */
    formApi: IDFormApi;

    /** form properties */
    formProps: IDFormProps;
}

export const TabContentRender = ({tabName, formApi, formProps}: IFieldsRenderProps): JSX.Element => {
    useExternalRenderCall(formApi, tabName);

    const groupsProp = formApi.model.getGroupsProps(tabName);

    return (
        <>
            {Object.keys(groupsProp).map((groupName) => {
                if (Object.keys(groupsProp[groupName]).length === 0) return null;

                if (Object.keys(groupsProp[groupName]).length > 1) {
                    return <FieldGroupRender key={groupName} formApi={formApi} formProps={formProps} tabName={tabName} groupName={groupName} />;
                } else {
                    const fieldName = Object.keys(groupsProp[groupName])[0];
                    return <BaseComponent key={fieldName} formApi={formApi} formProps={formProps} fieldName={fieldName} />;
                }
            })}
        </>
    );
};

const useExternalRenderCall = (formApi: IDFormApi, tabName: string) => {
    const subscribe = formApi.model.subscribeRenderTab(tabName);

    const getSnapshot = () => {
        const snaps = formApi.model.getTabRenderSnapshots();
        if (!snaps[tabName]) return undefined;
        return snaps[tabName];
    };

    return useSyncExternalStore(subscribe, getSnapshot);
};
