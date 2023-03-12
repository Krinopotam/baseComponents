import {IDFormFieldTabulatorGridProps, TabulatorGridComponent} from 'baseComponents/dForm/components/tabulatorGridComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class TabulatorGridComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = TabulatorGridComponent; 
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


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldTabulatorGridProps
    }
}