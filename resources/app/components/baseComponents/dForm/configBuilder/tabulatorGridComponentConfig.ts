import {IDFormFieldTabulatorGridProps, TabulatorGridComponent} from 'baseComponents/dForm/components/tabulatorGridComponent';
import {BaseComponentConfig} from './baseComponentConfig';

export class TabulatorGridComponentConfig<T> extends BaseComponentConfig<T> {
    constructor(id: keyof T) {
        super(id);
        this._config.component = TabulatorGridComponent;
    }

    /** Grid Id */
    id(value: IDFormFieldTabulatorGridProps['id']) {
        this._config.id = value;
        return this;
    }

    /** Grid columns */
    columns(value: IDFormFieldTabulatorGridProps['columns']) {
        this._config.columns = value;
        return this;
    }

    /** Grid data set */
    dataSet(value: IDFormFieldTabulatorGridProps['dataSet']) {
        this._config.dataSet = value;
        return this;
    }

    /** Grid height */
    bodyHeight(value: IDFormFieldTabulatorGridProps['bodyHeight']) {
        this._config.bodyHeight = value;
        return this;
    }

    /** Grid class name */
    className(value: IDFormFieldTabulatorGridProps['className']) {
        this._config.className = value;
        return this;
    }

    /** table style size */
    size(value: IDFormFieldTabulatorGridProps['size']) {
        this._config.size = value;
        return this;
    }

    buttons(value: IDFormFieldTabulatorGridProps['buttons']) {
        this._config.buttons = value;
        return this;
    }

    /** Table can't be edited */
    readonly(value: IDFormFieldTabulatorGridProps['readonly']) {
        this._config.readonly = value;
        return this;
    }

    /** Edit modal controls parameters */
    editFormProps(value: IDFormFieldTabulatorGridProps['editFormProps']) {
        this._config.editFormProps = value;
        return this;
    }

    /** Rows multiSelect */
    multiSelect(value: IDFormFieldTabulatorGridProps['multiSelect']) {
        this._config.multiSelect = value;
        return this;
    }

    /** Disable row hover effect */
    noHover(value: IDFormFieldTabulatorGridProps['noHover']) {
        this._config.noHover = value;
        return this;
    }

    /** Grid callbacks */
    callbacks(value: IDFormFieldTabulatorGridProps['callbacks']) {
        this._config.callbacks = value;
        return this;
    }

    /** Confirm message before rows delete */
    rowDeleteMessage(value: IDFormFieldTabulatorGridProps['rowDeleteMessage']) {
        this._config.rowDeleteMessage = value;
        return this;
    }

    /** Tree view mode */
    treeMode(value: IDFormFieldTabulatorGridProps['treeMode']) {
        this._config.treeMode = value;
        return this;
    }

    /** Should confirm before delete */
    confirmDelete(value: IDFormFieldTabulatorGridProps['confirmDelete']) {
        this._config.confirmDelete = value;
        return this;
    }

    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldTabulatorGridProps;
    }
}
