
    import React from 'react';
    import {Route, Routes} from 'react-router-dom';
    import {ExamplesLayout} from './examplesLayout';
    import {FormDependedFieldPage} from './pages/formDependedFieldPage';
    import {HomePage} from './pages/homePage';
    import {ModalWithGroupsPage} from './pages/modalWithGroupsPage';
    import {ModalWithTabsPage} from './pages/modalWithTabsPage';
    import {ModalWithTabsGroupsPage} from './pages/modalWithTabsGroupsPage';
    import {SimpleFormPage} from './pages/simpleFormPage';
    import {SimpleFormFetchingPage} from './pages/simpleFormFetchingPage';
    import {SimpleFormModalPage} from './pages/simpleFormModalPage';
    import {SimpleFormModalFetchingPage} from './pages/simpleFormModalFetchingPage';
    import {SimpleFormModalSubmittingPage} from './pages/simpleFormModalSubmittingPage';
    import {SimpleFormSubmittingPage} from './pages/simpleFormSubmittingPage';
    import {SimpleValidationPage} from './pages/simpleValidationPage';


export const ExamplesRoutes = () => {
    return (
        <Routes>
            <Route path="/localreact.html" element={<ExamplesLayout />}>
                <Route index element={<HomePage />} />
                <Route path="FormDependedField" element={<FormDependedFieldPage />} />;
                <Route path="Home" element={<HomePage />} />;
                <Route path="ModalWithGroups" element={<ModalWithGroupsPage />} />;
                <Route path="ModalWithTabs" element={<ModalWithTabsPage />} />;
                <Route path="ModalWithTabsGroups" element={<ModalWithTabsGroupsPage />} />;
                <Route path="SimpleForm" element={<SimpleFormPage />} />;
                <Route path="SimpleFormFetching" element={<SimpleFormFetchingPage />} />;
                <Route path="SimpleFormModal" element={<SimpleFormModalPage />} />;
                <Route path="SimpleFormModalFetching" element={<SimpleFormModalFetchingPage />} />;
                <Route path="SimpleFormModalSubmitting" element={<SimpleFormModalSubmittingPage />} />;
                <Route path="SimpleFormSubmitting" element={<SimpleFormSubmittingPage />} />;
                <Route path="SimpleValidation" element={<SimpleValidationPage />} />;

                <Route path="*" element={<HomePage />} />
            </Route>
        </Routes>
    );
};
