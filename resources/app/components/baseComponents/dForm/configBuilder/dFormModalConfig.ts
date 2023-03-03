import {IDModalProps, IDFormModalProps} from 'baseComponents/dFormModal/dFormModal';
import {DFormConfig} from './dFormConfig';


export class DFormModalConfig<T>  extends DFormConfig<T> {




    /** Modal controls callbacks */
    callbacks(value: IDModalProps['callbacks']) {
        this._config.callbacks = value;
        return this;
    }

    /** Confirm message before the form closing, if form is dirty */
    closeFormConfirmMessage(value: IDModalProps['closeFormConfirmMessage']) {
        this._config.closeFormConfirmMessage = value;
        return this;
    }

    /** Modal controls title */
    title(value: IDModalProps['title']) {
        this._config.title = value;
        return this;
    }

    /**Modal window width */
    width(value: IDModalProps['width']) {
        this._config.width = value;
        return this;
    }

    /**Modal window min width */
    minWidth(value: IDModalProps['minWidth']) {
        this._config.minWidth = value;
        return this;
    }

    /**Modal window max width */
    maxWidth(value: IDModalProps['maxWidth']) {
        this._config.maxWidth = value;
        return this;
    }

    /** Content body height*/
    bodyHeight(value: IDModalProps['bodyHeight']) {
        this._config.bodyHeight = value;
        return this;
    }

    /** Content body min height*/
    bodyMinHeight(value: IDModalProps['bodyMinHeight']) {
        this._config.bodyMinHeight = value;
        return this;
    }

    /** Content body max height*/
    bodyMaxHeight(value: IDModalProps['bodyMaxHeight']) {
        this._config.bodyMaxHeight = value;
        return this;
    }

    /** Content body CSS style (will be overwritten by bodyHeight, bodyMinHeight, bodyMaxHeight if set)*/
    bodyStyle(value: IDModalProps['bodyStyle']) {
        this._config.bodyStyle = value;
        return this;
    }

    /** Content body wil not be scrollable */
    notScrollable(value: IDModalProps['notScrollable']) {
        this._config.notScrollable = value;
        return this;
    }

    /** Is modal can be resizable */
    resizable(value: IDModalProps['resizable']) {
        this._config.resizable = value;
        return this;
    }

    /** Is controls visible (for open for without api) */
    isOpened(value: IDModalProps['isOpened']) {
        this._config.isOpened = value;
        return this;
    }


    /** Get form config */
    getConfig() {
        return this._config as unknown as IDFormModalProps 
    }
}