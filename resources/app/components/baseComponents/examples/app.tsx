import {App, ConfigProvider, theme} from 'antd';

import {BrowserRouter} from 'react-router-dom';
import { ExamplesRoutes } from './examplesRoutes';
import React from 'react';
import {createRoot} from 'react-dom/client';
import dayjs from 'dayjs';
import ruRU from 'antd/locale/ru_RU';

dayjs.locale('ru');

(() => {
    const rootElement = document.getElementById('root') as Element;
    const root = createRoot(rootElement);

    root.render(
        <ConfigProvider
            locale={ruRU}
            theme={{
                /*token: {
                    colorPrimary: '#00b96b',
                    borderRadius: 4,
                },*/
                components: {Modal: {paddingContentHorizontal: 0}},
                algorithm: theme.defaultAlgorithm,
            }}
        >
            {/** antd context for static Modal (form MessageBox). Should use in root component */}
            <App>
                <BrowserRouter>
                    <ExamplesRoutes />
                </BrowserRouter>
            </App>
        </ConfigProvider>
    );
})();
