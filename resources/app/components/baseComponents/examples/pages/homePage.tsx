
    import React from 'react';
    import {Home} from '../components/home';
    import { Divider } from 'antd';
    import SyntaxHighlighter from 'react-syntax-highlighter';
    import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

    export const HomePage = (): JSX.Element => {
    const source = `import React from 'react';

export const Home = (): JSX.Element => {
    return (
        <h1>Примеры использования компонентов</h1>
    );
};
`
    return (
        <>
            <div>
                <Home />
            </div>
            <Divider />
            <div>
                <SyntaxHighlighter language="javascript" style={docco}>
                    {source}
                </SyntaxHighlighter>
            </div>
        </>
    );
};
