
    import React from 'react';
    import {Route, Routes} from 'react-router-dom';
    import {ExamplesLayout} from './examplesLayout';
    import {Home} from './home';
    import {FormBetweenFieldsPage} from './pages/formBetweenFieldsPage';
    import {FormDependedFieldPage} from './pages/formDependedFieldPage';
    import {FormFetchingPage} from './pages/formFetchingPage';
    import {FormSimplePage} from './pages/formSimplePage';
    import {FormSimpleHorizontalPage} from './pages/formSimpleHorizontalPage';
    import {FormSubmittingPage} from './pages/formSubmittingPage';
    import {FormValidationPage} from './pages/formValidationPage';
    import {FormWithTemplatedFieldsPage} from './pages/formWithTemplatedFieldsPage';
    import {ModalFormFetchingPage} from './pages/modalFormFetchingPage';
    import {ModalFormSimplePage} from './pages/modalFormSimplePage';
    import {ModalFormSubmittingPage} from './pages/modalFormSubmittingPage';
    import {ModalFormWithGridPage} from './pages/modalFormWithGridPage';
    import {ModalFormWithGroupsPage} from './pages/modalFormWithGroupsPage';
    import {ModalFormWithTabsPage} from './pages/modalFormWithTabsPage';
    import {ModalFormWithTabsGroupsPage} from './pages/modalFormWithTabsGroupsPage';
    import {MrGridSimplePage} from './pages/mrGridSimplePage';
    import {MrGridSimpleTreePage} from './pages/mrGridSimpleTreePage';
    import {MrGridWithComplexDataSetPage} from './pages/mrGridWithComplexDataSetPage';
    import {MrGridWithFormPage} from './pages/mrGridWithFormPage';
    import {MrGridWithFormAsyncPage} from './pages/mrGridWithFormAsyncPage';
    import {PlayGroundPage} from './pages/playGroundPage';


export const ExamplesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ExamplesLayout />}>
                <Route index element={<Home />} />
                <Route path="FormBetweenFields" element={<FormBetweenFieldsPage />} />;
                <Route path="FormDependedField" element={<FormDependedFieldPage />} />;
                <Route path="FormFetching" element={<FormFetchingPage />} />;
                <Route path="FormSimple" element={<FormSimplePage />} />;
                <Route path="FormSimpleHorizontal" element={<FormSimpleHorizontalPage />} />;
                <Route path="FormSubmitting" element={<FormSubmittingPage />} />;
                <Route path="FormValidation" element={<FormValidationPage />} />;
                <Route path="FormWithTemplatedFields" element={<FormWithTemplatedFieldsPage />} />;
                <Route path="ModalFormFetching" element={<ModalFormFetchingPage />} />;
                <Route path="ModalFormSimple" element={<ModalFormSimplePage />} />;
                <Route path="ModalFormSubmitting" element={<ModalFormSubmittingPage />} />;
                <Route path="ModalFormWithGrid" element={<ModalFormWithGridPage />} />;
                <Route path="ModalFormWithGroups" element={<ModalFormWithGroupsPage />} />;
                <Route path="ModalFormWithTabs" element={<ModalFormWithTabsPage />} />;
                <Route path="ModalFormWithTabsGroups" element={<ModalFormWithTabsGroupsPage />} />;
                <Route path="MrGridSimple" element={<MrGridSimplePage />} />;
                <Route path="MrGridSimpleTree" element={<MrGridSimpleTreePage />} />;
                <Route path="MrGridWithComplexDataSet" element={<MrGridWithComplexDataSetPage />} />;
                <Route path="MrGridWithForm" element={<MrGridWithFormPage />} />;
                <Route path="MrGridWithFormAsync" element={<MrGridWithFormAsyncPage />} />;
                <Route path="PlayGround" element={<PlayGroundPage />} />;

                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
};
