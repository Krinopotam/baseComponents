import React from "react";

export const NotFound = ({fetching, error, minSymbols}: {fetching: boolean; error: string; minSymbols: number}): JSX.Element => {
    if (minSymbols || fetching || error) return <></>;
    return <div style={{paddingLeft: '30px', fontSize: '12px'}}>Данные отсутствуют</div>;
};