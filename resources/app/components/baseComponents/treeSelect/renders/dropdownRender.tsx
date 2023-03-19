import React from 'react';
import {DropdownStatus} from 'baseComponents/treeSelect/renders/dropdownStatus';

export const DropdownRender = ({
    menu,
    fetching,
    error,
    minSymbols,
}: {
    menu: React.ReactNode;
    fetching: boolean;
    error: string;
    minSymbols: number;
}): JSX.Element => (
    <>
        {menu}
        <DropdownStatus fetching={fetching} error={error} minSymbols={minSymbols} />
    </>
);
