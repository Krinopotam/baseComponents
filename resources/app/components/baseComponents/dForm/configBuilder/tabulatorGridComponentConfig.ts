import {IDFormFieldTabulatorGridProps, TabulatorGridComponent} from 'baseComponents/dForm/components/tabulatorGridComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class TabulatorGridComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = TabulatorGridComponent; 
    }


    /** Grid Id */
    id(value: IDFormFieldTabulatorGridProps['id']) {
        this._config.id = value;
        return this;
    }

    /** Grid mode: local or remote*/
    gridMode(value: IDFormFieldTabulatorGridProps['gridMode']) {
        this._config.gridMode = value;
        return this;
    }

    /** Tree view mode */
    treeMode(value: IDFormFieldTabulatorGridProps['treeMode']) {
        this._config.treeMode = value;
        return this;
    }

    /** Grid columns */
    columns(value: IDFormFieldTabulatorGridProps['columns']) {
        this._config.columns = value;
        return this;
    }

    /** Grid class name */
    className(value: IDFormFieldTabulatorGridProps['className']) {
        this._config.className = value;
        return this;
    }

    
    buttons(value: IDFormFieldTabulatorGridProps['buttons']) {
        this._config.buttons = value;
        return this;
    }

    /** Edit modal controls parameters */
    editFormProps(value: IDFormFieldTabulatorGridProps['editFormProps']) {
        this._config.editFormProps = value;
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

    /** Should confirm before delete */
    confirmDelete(value: IDFormFieldTabulatorGridProps['confirmDelete']) {
        this._config.confirmDelete = value;
        return this;
    }

    /** No rows placeholder */
    placeholder(value: IDFormFieldTabulatorGridProps['placeholder']) {
        this._config.placeholder = value;
        return this;
    }

    /** Table layout */
    layout(value: IDFormFieldTabulatorGridProps['layout']) {
        this._config.layout = value;
        return this;
    }

    /** Adjust to the data each time you load it into the table */
    layoutColumnsOnNewData(value: IDFormFieldTabulatorGridProps['layoutColumnsOnNewData']) {
        this._config.layoutColumnsOnNewData = value;
        return this;
    }

    /** Grid container width*/
    width(value: IDFormFieldTabulatorGridProps['width']) {
        this._config.width = value;
        return this;
    }

    /** Grid container max width*/
    maxWidth(value: IDFormFieldTabulatorGridProps['maxWidth']) {
        this._config.maxWidth = value;
        return this;
    }

    /** Grid container min width*/
    minWidth(value: IDFormFieldTabulatorGridProps['minWidth']) {
        this._config.minWidth = value;
        return this;
    }

    /** Grid height*/
    height(value: IDFormFieldTabulatorGridProps['height']) {
        this._config.height = value;
        return this;
    }

    /** Min grid height*/
    minHeight(value: IDFormFieldTabulatorGridProps['minHeight']) {
        this._config.minHeight = value;
        return this;
    }

    /** Max grid height*/
    maxHeight(value: IDFormFieldTabulatorGridProps['maxHeight']) {
        this._config.maxHeight = value;
        return this;
    }

    /** allow multi select */
    multiSelect(value: IDFormFieldTabulatorGridProps['multiSelect']) {
        this._config.multiSelect = value;
        return this;
    }

    /** Resize a column its neighbouring column has the opposite resize applied to keep to total width of columns the same */
    resizableColumnFit(value: IDFormFieldTabulatorGridProps['resizableColumnFit']) {
        this._config.resizableColumnFit = value;
        return this;
    }

    /** Row height */
    rowHeight(value: IDFormFieldTabulatorGridProps['rowHeight']) {
        this._config.rowHeight = value;
        return this;
    }

    /** Is the user can resize rows */
    resizableRows(value: IDFormFieldTabulatorGridProps['resizableRows']) {
        this._config.resizableRows = value;
        return this;
    }

    /** is columns movable */
    movableColumns(value: IDFormFieldTabulatorGridProps['movableColumns']) {
        this._config.movableColumns = value;
        return this;
    }

    /** is rows movable */
    movableRows(value: IDFormFieldTabulatorGridProps['movableRows']) {
        this._config.movableRows = value;
        return this;
    }

    /** Group rows by field/fields data*/
    groupBy(value: IDFormFieldTabulatorGridProps['groupBy']) {
        this._config.groupBy = value;
        return this;
    }

    /** Store column state in browser local storage */
    persistence(value: IDFormFieldTabulatorGridProps['persistence']) {
        this._config.persistence = value;
        return this;
    }

    /** Local storage key  */
    persistenceID(value: IDFormFieldTabulatorGridProps['persistenceID']) {
        this._config.persistenceID = value;
        return this;
    }

    /** Persistent layout */
    persistentLayout(value: IDFormFieldTabulatorGridProps['persistentLayout']) {
        this._config.persistentLayout = value;
        return this;
    }

    /** Persistent Filter */
    persistentFilter(value: IDFormFieldTabulatorGridProps['persistentFilter']) {
        this._config.persistentFilter = value;
        return this;
    }

    /** Persistent sort */
    persistentSort(value: IDFormFieldTabulatorGridProps['persistentSort']) {
        this._config.persistentSort = value;
        return this;
    }

    /** Frozen rows*/
    frozenRows(value: IDFormFieldTabulatorGridProps['frozenRows']) {
        this._config.frozenRows = value;
        return this;
    }

    /** Frozen row field name/names (default: id) */
    frozenRowsField(value: IDFormFieldTabulatorGridProps['frozenRowsField']) {
        this._config.frozenRowsField = value;
        return this;
    }

    /** Initial filter */
    initialFilter(value: IDFormFieldTabulatorGridProps['initialFilter']) {
        this._config.initialFilter = value;
        return this;
    }

    /** Initial sort */
    initialSort(value: IDFormFieldTabulatorGridProps['initialSort']) {
        this._config.initialSort = value;
        return this;
    }

    /** Initial header filter */
    initialHeaderFilter(value: IDFormFieldTabulatorGridProps['initialHeaderFilter']) {
        this._config.initialHeaderFilter = value;
        return this;
    }

    /** Is the header should be visible */
    headerVisible(value: IDFormFieldTabulatorGridProps['headerVisible']) {
        this._config.headerVisible = value;
        return this;
    }

    /** Default column properties */
    columnDefaults(value: IDFormFieldTabulatorGridProps['columnDefaults']) {
        this._config.columnDefaults = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldTabulatorGridProps
    }
}