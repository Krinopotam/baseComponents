import {CSSProperties, useMemo} from 'react';

export const useDropdownStyle = (dropdownStyle: CSSProperties|undefined) => {
    return useMemo(() => {
        const defaultStyle = {
            maxHeight: 400,
            overflow: 'auto',
        };

        return {...defaultStyle, ...(dropdownStyle || {})};
    }, [dropdownStyle]);
};
