import {IDFormFieldLinkProps, LinkComponent} from 'baseComponents/dForm/components/linkComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class LinkComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = LinkComponent; 
    }


    /** Anchor url */
    href(value: IDFormFieldLinkProps['href']) {
        this._config.href = value;
        return this;
    }

    /** Anchor target */
    target(value: IDFormFieldLinkProps['target']) {
        this._config.target = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldLinkProps
    }
}