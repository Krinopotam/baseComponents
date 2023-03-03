import {IDFormFieldGridProps, GridComponent} from 'baseComponents/dForm/components/gridComponent';
import {BaseComponentConfig} from './baseComponentConfig';
import {DFormModalConfig} from './dFormModalConfig';


export class GridComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = GridComponent; 
    }


    /** Default value */
    default(value: IDFormFieldGridProps['default']) {
        this._config.default = value;
        return this;
    }

    /** Columns properties */
    columns(value: IDFormFieldGridProps['columns']) {
        this._config.columns = value;
        return this;
    }

    /** Parameters for remote data fetching*/
    dataSource(value: IDFormFieldGridProps['dataSource']) {
        this._config.dataSource = value;
        return this;
    }

    /** Grid height */
    height(value: IDFormFieldGridProps['height']) {
        this._config.height = value;
        return this;
    }

    /** Hide all edit buttons */
    noButtons(value: IDFormFieldGridProps['noButtons']) {
        this._config.noButtons = value;
        return this;
    }

    /** Should confirm before delete */
    confirmDelete(value: IDFormFieldGridProps['confirmDelete']) {
        this._config.confirmDelete = value;
        return this;
    }


    /** Edit controls properties */
    editFormProps(value: IDFormFieldGridProps['editFormProps'] | DFormModalConfig) {
        if (value instanceof  DFormModalConfig) this._config.editFormProps = value.getConfig();
        else this._config.editFormProps = value;
        return this;
    }

    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldGridProps
    }
}