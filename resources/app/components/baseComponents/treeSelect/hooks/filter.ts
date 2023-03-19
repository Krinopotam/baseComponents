import {ITreeSelectNode} from 'baseComponents/treeSelect';
import {useCallback} from 'react';
import {ITreeSelectApi} from "baseComponents/treeSelect/hooks/api";

export const useDefaultFilter = (api:ITreeSelectApi) => {
    const fields = api.getProps().fieldNames
    const titleKey = fields?.title || 'title';
    return useCallback((inputValue: string, treeNode: ITreeSelectNode | unknown) => {
        const node = treeNode as ITreeSelectNode;
        if (!node || typeof node[titleKey] !== 'string') return false;
        const title = node[titleKey] as string;
        return title.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    }, [titleKey]);
};
