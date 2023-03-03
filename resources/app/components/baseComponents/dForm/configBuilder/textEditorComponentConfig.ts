import {IDFormTextEditorProps, TextEditorComponent} from 'baseComponents/dForm/components/textEditorComponent';
import {BaseComponentConfig} from './baseComponentConfig';


export class TextEditorComponentConfig<T>  extends BaseComponentConfig<T> {

    constructor(id: keyof T) {
        super(id);
        this._config.component = TextEditorComponent; 
    }


    /** Default value */
    default(value: IDFormTextEditorProps['default']) {
        this._config.default = value;
        return this;
    }

    /** Allowed formats. This is separate from adding a control in the Toolbar. For example, you can configure Quill to allow bolded content to be pasted into an editor that has no bold button in the toolbar */
    formats(value: IDFormTextEditorProps['formats']) {
        this._config.formats = value;
        return this;
    }

    /** Toolbars buttons config */ //TODO add type
    toolbar(value: IDFormTextEditorProps['toolbar']) {
        this._config.toolbar = value;
        return this;
    }


    /** Get field config */
    getConfig() {
        return this._config as unknown as IDFormTextEditorProps
    }
}