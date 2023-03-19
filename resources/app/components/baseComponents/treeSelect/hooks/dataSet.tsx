import React, {useCallback, useState} from 'react';
import {ITreeSelectNode, ITreeSelectProps} from 'baseComponents/treeSelect';

export const useDataSet = (
    titleRender: ITreeSelectProps['titleRender'],
    labelRender: ITreeSelectProps['labelRender'],
    isMountedRef: React.MutableRefObject<boolean>
): [typeof dataSet, typeof setPreparedDataSet] => {
    const [dataSet, setDataSet] = useState<ITreeSelectProps['dataSet']>();

    const setPreparedDataSet = useCallback(
        (newDataSet: ITreeSelectProps['dataSet']) => {
            if (!isMountedRef.current) return;
            if (!newDataSet) {
                setDataSet(undefined);
                return;
            }

            let preparedDataSet: ITreeSelectProps['dataSet'];
            if (titleRender || labelRender) preparedDataSet = prepareNodeRender(newDataSet, titleRender, labelRender);
            else preparedDataSet = newDataSet;

            setDataSet(preparedDataSet);
        },
        [titleRender, labelRender, isMountedRef]
    );

    return [dataSet, setPreparedDataSet];
};

const prepareNodeRender = (
    dataSet: ITreeSelectProps['dataSet'],
    titleRender?: (node: ITreeSelectNode) => React.ReactNode,
    labelRender?: (node: ITreeSelectNode) => React.ReactNode
) => {
    if (!dataSet) return [];
    const newDataSet: ITreeSelectNode[] = [];
    for (const node of dataSet) {
        const nodeClone = {...node};

        if (labelRender) nodeClone['__label'] = labelRender(node);
        if (titleRender) nodeClone['__title'] = titleRender(node);

        newDataSet.push(nodeClone);
        if (node.children) nodeClone.children = prepareNodeRender(nodeClone.children, titleRender, labelRender);
    }

    return newDataSet;
};
