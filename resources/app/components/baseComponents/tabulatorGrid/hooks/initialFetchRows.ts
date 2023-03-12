import {useEffect} from "react";
import {IGridApi} from "baseComponents/tabulatorGrid/hooks/api";

export const useInitialFetchData = (gridApi: IGridApi) => {
    useEffect(() => {
        gridApi.fetchData()
    }, [gridApi]);
};
