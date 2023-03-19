import React, {useCallback} from 'react';
import {DropdownRender} from 'baseComponents/treeSelect/renders/dropdownRender';

export const useDefaultDropdownRender = ({fetchError, fetching, minSymbols}: {fetchError: string; fetching: boolean; minSymbols: number}) => {
    return useCallback(
        (menu: React.ReactNode) => <DropdownRender menu={menu} fetching={fetching} error={fetchError} minSymbols={minSymbols} />,
        [fetchError, fetching, minSymbols]
    );
};
