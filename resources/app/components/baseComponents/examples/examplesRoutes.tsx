
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
    import {TabulatorGridMultiSelectPage} from './pages/tabulatorGridMultiSelectPage';
    import {TabulatorGridSimplePage} from './pages/tabulatorGridSimplePage';
    import {TabulatorGridTreePage} from './pages/tabulatorGridTreePage';
    import {TabulatorGridTreeCellFormatPage} from './pages/tabulatorGridTreeCellFormatPage';
    import {TabulatorGridTreeWithFormPage} from './pages/tabulatorGridTreeWithFormPage';
    import {TabulatorGridWithFormPage} from './pages/tabulatorGridWithFormPage';
    import {TabulatorGridWithFormAsyncPage} from './pages/tabulatorGridWithFormAsyncPage';
    import {TreeSelectAsyncPage} from './pages/treeSelectAsyncPage';
    import {TreeSelectAsyncSearchPage} from './pages/treeSelectAsyncSearchPage';
    import {TreeSelectBasicPage} from './pages/treeSelectBasicPage';
    import {TreeSelectDefaultValuePage} from './pages/treeSelectDefaultValuePage';
    import {TreeSelectDependedPage} from './pages/treeSelectDependedPage';
    import {TreeSelectDependedAsyncPage} from './pages/treeSelectDependedAsyncPage';
    import {TreeSelectNodeRenderPage} from './pages/treeSelectNodeRenderPage';
    import {TreeSelectWithFormPage} from './pages/treeSelectWithFormPage';
    import {TreeSelectWithFormAsyncPage} from './pages/treeSelectWithFormAsyncPage';


export const ExamplesRoutes = (props: {darkMode: boolean; setDarkMode: (mode:boolean) => void}) => {
    return (
        <Routes>
            <Route path="/" element={<ExamplesLayout setDarkMode={props.setDarkMode} />}>
                <Route index element={<Home />} />
                <Route path="FormBetweenFields" element={<FormBetweenFieldsPage darkMode={props.darkMode} />} />;
                <Route path="FormDependedField" element={<FormDependedFieldPage darkMode={props.darkMode} />} />;
                <Route path="FormFetching" element={<FormFetchingPage darkMode={props.darkMode} />} />;
                <Route path="FormSimple" element={<FormSimplePage darkMode={props.darkMode} />} />;
                <Route path="FormSimpleHorizontal" element={<FormSimpleHorizontalPage darkMode={props.darkMode} />} />;
                <Route path="FormSubmitting" element={<FormSubmittingPage darkMode={props.darkMode} />} />;
                <Route path="FormValidation" element={<FormValidationPage darkMode={props.darkMode} />} />;
                <Route path="FormWithTemplatedFields" element={<FormWithTemplatedFieldsPage darkMode={props.darkMode} />} />;
                <Route path="ModalFormFetching" element={<ModalFormFetchingPage darkMode={props.darkMode} />} />;
                <Route path="ModalFormSimple" element={<ModalFormSimplePage darkMode={props.darkMode} />} />;
                <Route path="ModalFormSubmitting" element={<ModalFormSubmittingPage darkMode={props.darkMode} />} />;
                <Route path="ModalFormWithGrid" element={<ModalFormWithGridPage darkMode={props.darkMode} />} />;
                <Route path="ModalFormWithGroups" element={<ModalFormWithGroupsPage darkMode={props.darkMode} />} />;
                <Route path="ModalFormWithTabs" element={<ModalFormWithTabsPage darkMode={props.darkMode} />} />;
                <Route path="ModalFormWithTabsGroups" element={<ModalFormWithTabsGroupsPage darkMode={props.darkMode} />} />;
                <Route path="PlayGround" element={<PlayGroundPage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridCellFormat" element={<TabulatorGridCellFormatPage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridMultiSelect" element={<TabulatorGridMultiSelectPage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridSimple" element={<TabulatorGridSimplePage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridTree" element={<TabulatorGridTreePage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridTreeCellFormat" element={<TabulatorGridTreeCellFormatPage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridTreeWithForm" element={<TabulatorGridTreeWithFormPage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridWithForm" element={<TabulatorGridWithFormPage darkMode={props.darkMode} />} />;
                <Route path="TabulatorGridWithFormAsync" element={<TabulatorGridWithFormAsyncPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectAsync" element={<TreeSelectAsyncPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectAsyncSearch" element={<TreeSelectAsyncSearchPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectBasic" element={<TreeSelectBasicPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectDefaultValue" element={<TreeSelectDefaultValuePage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectDepended" element={<TreeSelectDependedPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectDependedAsync" element={<TreeSelectDependedAsyncPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectNodeRender" element={<TreeSelectNodeRenderPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectWithForm" element={<TreeSelectWithFormPage darkMode={props.darkMode} />} />;
                <Route path="TreeSelectWithFormAsync" element={<TreeSelectWithFormAsyncPage darkMode={props.darkMode} />} />;

                <Route path="*" element={<Home />} />
            </Route>
        </Routes>
    );
};
