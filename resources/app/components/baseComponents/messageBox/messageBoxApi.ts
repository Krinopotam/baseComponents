import { IAnyModalConfig, IModalBaseConfig } from "./messageBox";
import dispatcher, { FormsDispatcher } from "../modal/service/formsDispatcher";

import {IFormButton} from 'baseComponents/buttonsRow';
import { ModalFuncProps } from "antd";
import { mergeObjects } from "helpers/helpersObjects";

export class MessageBoxApi  {
    private _modal: {destroy: () => void; update: (configUpdate: ModalFuncProps) => void};

    private _modalConfigGenerator;
    private _currentConfig: IModalBaseConfig;
    private readonly _formsDispatcher: FormsDispatcher | undefined;
    private _id: string;

    constructor(
        id: string,
        modal: {destroy: () => void; update: (configUpdate: ModalFuncProps) => void},
        config: IModalBaseConfig,
        modalConfigGenerator: (config: IModalBaseConfig) => ModalFuncProps
    ) {
        this._modal = modal;
        this._currentConfig = config;
        this._formsDispatcher = dispatcher;
        this._modalConfigGenerator = modalConfigGenerator;
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public destroy() {
        if (this._formsDispatcher) this._formsDispatcher.removeFromStack(this._id);
        this._modal.destroy();
    }

    public update(newConfig: Omit<IAnyModalConfig, 'formId'>) {
        const resultConfig = mergeObjects(this._currentConfig, newConfig) || {};
        const generatedConfig = this._modalConfigGenerator(resultConfig);
        this._modal.update(generatedConfig);
        this._currentConfig = resultConfig;
    }

    public updateButton(buttonName: string, buttonConfig: IFormButton) {
        const currentConfig = {...this._currentConfig};
        const currentButtons = currentConfig.buttons || {};

        if (buttonConfig.active) {
            for (const key in currentButtons) {
                const button = currentButtons[key];
                if (!button) continue;
                button.active = false;
            }
        }

        if (!currentButtons[buttonName]) currentButtons[buttonName] = buttonConfig;
        else currentButtons[buttonName] = {...currentButtons[buttonName], ...buttonConfig};

        currentConfig.buttons = currentButtons;
        this.update(currentConfig);
    }

    public removeButton(buttonName: string) {
        const currentConfig = {...this._currentConfig};
        const currentButtons = currentConfig.buttons || {};
        delete currentButtons[buttonName];
        currentConfig.buttons = currentButtons;
        this.update(currentConfig);
    }

    public getCurrentConfig() {
        return this._currentConfig;
    }

    public getCurrentButtons() {
        return this._currentConfig.buttons || {};
    }
}
