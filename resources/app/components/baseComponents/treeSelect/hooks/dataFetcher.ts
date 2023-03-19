import {ITreeSelectApi} from 'baseComponents/treeSelect/hooks/api';
import {useCallback} from 'react';

export const useDataFetcher = (api: ITreeSelectApi) => {
    return useCallback(
        (searchString: string) => {
            if (!api.isMounted()) return;
            const treeProps = api.getProps();

            if (!treeProps.noCacheFetchedData && api.getIsAllFetched()) return;

            if (treeProps.minSearchLength && searchString.length < treeProps.minSearchLength) {
                api.setSetMynSymbols(treeProps.minSearchLength);
                api.setDataSet(undefined);
                return;
            }

            api.setSetMynSymbols(0);
            api.setSetFetchError(null);

            const dataSource = treeProps.callbacks?.onDataFetch?.(searchString, api);
            if (!dataSource) {
                api.setIsAllFetched(true);
                return;
            }

            api.setIsFetching(true);

            dataSource.then(
                (result) => {
                    if (!api.isMounted()) return;

                    api.setDataSet(result.data);
                    api.setIsAllFetched(api.getIsAllFetched() || !searchString);

                    if (!api.getIsReady()) {
                        api.setIsReady(true);
                        treeProps?.callbacks?.onReady?.();
                    }

                    api.setIsFetching(false);

                    treeProps.callbacks?.onDataFetchSuccess?.(result, api);
                    treeProps.callbacks?.onDataFetchComplete?.(api);
                },
                (error) => {
                    if (!api.isMounted()) return;
                    api.setSetFetchError(error.message);
                    api.setDataSet(undefined);
                    api.setIsFetching(false);
                }
            );
        },
        [api]
    );
};
