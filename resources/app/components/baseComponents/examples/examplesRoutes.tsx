
    import React from 'react';
    import {Route, Routes} from 'react-router-dom';
    import {ExamplesLayout} from './examplesLayout';
    import {FormDependedFieldPage} from './pages/formDependedFieldPage';
    import {FormSimplePage} from './pages/formSimplePage';
    import {FormWithTemplatedFieldsPage} from './pages/formWithTemplatedFieldsPage';
    import {HomePage} from './pages/homePage';
    import {ModalWithGridPage} from './pages/modalWithGridPage';
    import {ModalWithGroupsPage} from './pages/modalWithGroupsPage';
    import {ModalWithTabsPage} from './pages/modalWithTabsPage';
    import {ModalWithTabsGroupsPage} from './pages/modalWithTabsGroupsPage';
    import {MrGridSimplePage} from './pages/mrGridSimplePage';
    import {MrGridSimpleTreePage} from './pages/mrGridSimpleTreePage';
    import {MrGridWithComplexDataSetPage} from './pages/mrGridWithComplexDataSetPage';
    import {MrGridWithFormPage} from './pages/mrGridWithFormPage';
    import {PlayGroundPage} from './pages/playGroundPage';
    import {SimpleFormFetchingPage} from './pages/simpleFormFetchingPage';
    import {SimpleFormModalPage} from './pages/simpleFormModalPage';
    import {SimpleFormModalFetchingPage} from './pages/simpleFormModalFetchingPage';
    import {SimpleFormModalSubmittingPage} from './pages/simpleFormModalSubmittingPage';
    import {SimpleFormSubmittingPage} from './pages/simpleFormSubmittingPage';
    import {SimpleValidationPage} from './pages/simpleValidationPage';


export const ExamplesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ExamplesLayout />}>
                <Route index element={<HomePage />} />
                <Route path="FormDependedField" element={<FormDependedFieldPage />} />;
                <Route path="FormSimple" element={<FormSimplePage />} />;
                <Route path="FormWithTemplatedFields" element={<FormWithTemplatedFieldsPage />} />;
                <Route path="Home" element={<HomePage />} />;
                <Route path="ModalWithGrid" element={<ModalWithGridPage />} />;
                <Route path="ModalWithGroups" element={<ModalWithGroupsPage />} />;
                <Route path="ModalWithTabs" element={<ModalWithTabsPage />} />;
                <Route path="ModalWithTabsGroups" element={<ModalWithTabsGroupsPage />} />;
                <Route path="MrGridSimple" element={<MrGridSimplePage />} />;
                <Route path="MrGridSimpleTree" element={<MrGridSimpleTreePage />} />;
                <Route path="MrGridWithComplexDataSet" element={<MrGridWithComplexDataSetPage />} />;
                <Route path="MrGridWithForm" element={<MrGridWithFormPage />} />;
                <Route path="PlayGround" element={<PlayGroundPage />} />;
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
