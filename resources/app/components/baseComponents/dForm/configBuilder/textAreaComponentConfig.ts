import {IDFormFieldTextAreaProps, TextAreaComponent} from 'baseComponents/dForm/components/textAreaComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class TextAreaComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = TextAreaComponent; 
    }


    /** Height auto size feature, can be set to true | false or an object ( minRows: 2, maxRows: 6 ) */
    autoSize(value: IDFormFieldTextAreaProps['autoSize']) {
        this._config.autoSize = value;
        return this;
    }

    /** Specifies the visible width of a text area */
    cols(value: IDFormFieldTextAreaProps['cols']) {
        this._config.cols = value;
        return this;
    }

    /** Specifies the visible number of lines in a text area */
    rows(value: IDFormFieldTextAreaProps['rows']) {
        this._config.rows = value;
        return this;
    }

    /** Default value */
    default(value: IDFormFieldTextAreaProps['default']) {
        this._config.default = value;
        return this;
    }

    /** Text wrap parameters. Specifies how the text in a text area is to be wrapped when submitted in a form */
    wrap(value: IDFormFieldTextAreaProps['wrap']) {
        this._config.wrap = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormFieldTextAreaProps
    }
}