//region Form config extra methods
module.exports.addField = `/** Add fields or fields inline groups */
    addFields(...args: (IConfigGetter | Record<string, IConfigGetter[]>)[]) {
        this.addFieldsConfig(undefined, args);
        return this;
    }`;

module.exports.addTabs = `/** Add tabs */
    addTab(tabName: string, ...args: (IConfigGetter | Record<string, IConfigGetter[]>)[]) {
        this.addFieldsConfig(tabName, args);
        return this;
    }`;

module.exports.addFieldsConfig = `/** Add field properties to form config */
    private addFieldsConfig(tabName: string | undefined, fieldClassList: (IConfigGetter | Record<string, IConfigGetter[]>)[]) {
        for (const fieldClass of fieldClassList) {
            if (typeof fieldClass !== 'object') continue;
            if (fieldClass.getConfig) {
                const fieldClass1 = fieldClass as IConfigGetter;
                this.updateFieldsProps(fieldClass1, undefined, tabName);
                continue;
            }

            const fieldsClassesGroup = fieldClass as Record<string, IConfigGetter[]>;
            for (const groupName in fieldsClassesGroup) {
                const groupFieldsClasses = fieldsClassesGroup[groupName];
                if (!Array.isArray(groupFieldsClasses)) continue;

                for (const fieldClass2 of groupFieldsClasses) {
                    if (!fieldClass2.getConfig) continue;
                    this.updateFieldsProps(fieldClass2, groupName, tabName);
                }
            }
        }
        return this;
    }`;

module.exports.updateFieldsProps = `/** Update the field properties */
    private updateFieldsProps(fieldClass: IConfigGetter, groupName?: string, tabName?: string) {
        const fieldConfig = fieldClass.getConfig();
        if (!fieldConfig.fieldProps) return;
        if (!this._config.fieldsProps) this._config.fieldsProps = {};
        const formFieldsProps = this._config.fieldsProps;
        const fieldProps = fieldConfig.fieldProps as IDFormFieldProps;
        formFieldsProps[fieldConfig.id] = {...fieldProps};

        if (!this._config.validationRules) this._config.validationRules = {};
        if (fieldConfig.rules && fieldConfig.rules.length > 0) this._config.validationRules[fieldConfig.id] = [...fieldConfig.rules];

        if (typeof groupName !== 'undefined') formFieldsProps[fieldConfig.id].inlineGroup = groupName;
        if (typeof tabName !== 'undefined') formFieldsProps[fieldConfig.id].tab = tabName;
    }`;

module.exports.getFormConfig = `/** Get form config */
    getConfig() {
        return this._config;
    }`;

module.exports.IConfigGetter = `export interface IConfigGetter{
    getConfig:() => {id: string, fieldProps: object, rules: IRuleType[]};
}
`;
//endregion

//region Components config extra methods
module.exports.getComponentConfig = `/** Get component config */
    getConfig() {
        return {id: this._id, fieldProps: this._config, rules: this._validationRules};
    }`;

/** alternative editFormProps method for gridComponent */
module.exports.altEditFormProps = `/** Edit controls properties */
    editFormProps(value: IDFormFieldGridProps['editFormProps'] | DFormModalConfig) {
        if (value instanceof  DFormModalConfig) this._config.editFormProps = value.getConfig();
        else this._config.editFormProps = value;
        return this;
    }`;

module.exports.addValidationRules =`/** Add validation rules */
    validationRules(...args: IRuleType[]) {
        for (const rule of args) {
            this._validationRules.push(rule)
        }
        
        return this;
    }`
//endregion
