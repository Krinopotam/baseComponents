import {IDFormFieldMrGridProps, MrGridComponent} from 'baseComponents/dForm/components/mrGridComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class MrGridComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = MrGridComponent; 
    }


    /** Grid columns */
    columns(value: IDFormFieldMrGridProps['columns']) {
        this._config.columns = value;
        return this;
    }

    /** Grid data set */
    dataSet(value: IDFormFieldMrGridProps['dataSet']) {
        this._config.dataSet = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldMrGridProps
    }
}