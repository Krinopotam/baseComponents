import {IDFormFieldMrGridProps, MrGridComponent} from 'baseComponents/dForm/components/mrGridComponent';
import {BaseComponentConfig} from './baseComponentConfig';
import {IGridRowData} from 'baseComponents/mrGrid/mrGrid';

export class MrGridComponentConfig<T> extends BaseComponentConfig<T> {
    constructor(id: keyof T) {
        super(id);
        this._config.component = MrGridComponent;
    }

    /** Grid columns */
    columns<TData extends IGridRowData>(value: IDFormFieldMrGridProps<TData>['columns']) {
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
        return this._config as unknown as IDFormFieldMrGridProps;
    }
}
