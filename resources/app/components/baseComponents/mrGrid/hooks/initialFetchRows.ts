import {useEffect} from "react";
import {IGridApi} from "baseComponents/mrGrid/hooks/api";

export const useInitialFetchData = (gridApi: IGridApi) => {
    useEffect(() => {
        gridApi.fetchData()
    }, [gridApi]);
};
