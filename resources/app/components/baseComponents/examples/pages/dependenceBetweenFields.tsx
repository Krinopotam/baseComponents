
import React from 'react';
import {FormBetweenFields} from '../components/FormBetweenFields';
import { Divider } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const DependenceBetweenFields = (): JSX.Element => {

return (
    <>
        <div>
            <FormBetweenFields />
        </div>
        <Divider />
    </>
);
};
