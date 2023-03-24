
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
    import {PlayGroundPage} from './pages/playGroundPage';
    import {TabulatorGridCellFormatPage} from './pages/tabulatorGridCellFormatPage';
    import {TabulatorGridSimplePage} from './pages/tabulatorGridSimplePage';
    import {TabulatorGridTreePage} from './pages/tabulatorGridTreePage';
    import {TabulatorGridTreeWithFormPage} from './pages/tabulatorGridTreeWithFormPage';
    import {TabulatorGridWithFormPage} from './pages/tabulatorGridWithFormPage';
    import {TabulatorGridWithFormAsyncPage} from './pages/tabulatorGridWithFormAsyncPage';
    import {TreeSelectAsyncPage} from './pages/treeSelectAsyncPage';
    import {TreeSelectAsyncSearchPage} from './pages/treeSelectAsyncSearchPage';
    import {TreeSelectBasicPage} from './pages/treeSelectBasicPage';
    import {TreeSelectDependedPage} from './pages/treeSelectDependedPage';
    import {TreeSelectDependedAsyncPage} from './pages/treeSelectDependedAsyncPage';
    import {TreeSelectNodeRenderPage} from './pages/treeSelectNodeRenderPage';
    import {TreeSelectWithFormPage} from './pages/treeSelectWithFormPage';
    import {TreeSelectWithFormAsyncPage} from './pages/treeSelectWithFormAsyncPage';


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
                <Route path="PlayGround" element={<PlayGroundPage />} />;
                <Route path="TabulatorGridCellFormat" element={<TabulatorGridCellFormatPage />} />;
                <Route path="TabulatorGridSimple" element={<TabulatorGridSimplePage />} />;
                <Route path="TabulatorGridTree" element={<TabulatorGridTreePage />} />;
                <Route path="TabulatorGridTreeWithForm" element={<TabulatorGridTreeWithFormPage />} />;
                <Route path="TabulatorGridWithForm" element={<TabulatorGridWithFormPage />} />;
                <Route path="TabulatorGridWithFormAsync" element={<TabulatorGridWithFormAsyncPage />} />;
                <Route path="TreeSelectAsync" element={<TreeSelectAsyncPage />} />;
                <Route path="TreeSelectAsyncSearch" element={<TreeSelectAsyncSearchPage />} />;
                <Route path="TreeSelectBasic" element={<TreeSelectBasicPage />} />;
                <Route path="TreeSelectDepended" element={<TreeSelectDependedPage />} />;
                <Route path="TreeSelectDependedAsync" element={<TreeSelectDependedAsyncPage />} />;
                <Route path="TreeSelectNodeRender" element={<TreeSelectNodeRenderPage />} />;
                <Route path="TreeSelectWithForm" element={<TreeSelectWithFormPage />} />;
                <Route path="TreeSelectWithFormAsync" element={<TreeSelectWithFormAsyncPage />} />;

                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
};
