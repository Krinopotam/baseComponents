import {reactToHtml} from 'helpers/helpersDOM';
import {Button} from 'baseComponents/button';
import React from 'react';

export const collapseSvg = reactToHtml(
    <Button
        size={'small'}
        style={{width: 17, height: 17, lineHeight: '13px', paddingLeft: 0, paddingRight: 0, paddingBottom: 3, marginRight: 5, borderRadius: 2}}
    >
        -
    </Button>
);
export const expandSvg = reactToHtml(
    <Button
        size={'small'}
        style={{width: 17, height: 17, lineHeight: '13px', paddingLeft: 0, paddingRight: 0, paddingBottom: 3, marginRight: 5, borderRadius: 2}}
    >
        +
    </Button>
);
