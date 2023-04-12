//region Form config extra methods
module.exports.addField = `/** Add fields or fields inline groups */
    addFields(...args: BaseComponentConfig<T>[]) {
        this.addFieldsConfig(undefined, args);
        return this;
    }`;

module.exports.addTabs = `/** Add tabs */
    addTab(tabName: string, ...args: BaseComponentConfig<T>[]) {
        this.addFieldsConfig(tabName, args);
        return this;
    }`;

module.exports.addFieldsConfig = `/** Add field properties to form config */
    protected addFieldsConfig(tabName: string | undefined, configs: BaseComponentConfig<T>[]) {
        for (const config of configs) {
            this.updateFieldsProps(config, tabName);
        }
        return this;
    }`;

module.exports.updateFieldsProps = `/** Update the field properties */
    protected updateFieldsProps(configClass: BaseComponentConfig<T>, tabName?: string) {
        const id  = configClass.getId();
        const fieldProps = configClass.getConfig();
        const validationRules = configClass.getValidationRules();
        
        if (!fieldProps || !id) return;
        if (!this._config.fieldsProps) this._config.fieldsProps = {};
        const formFieldsProps = this._config.fieldsProps as Record<keyof T, IDFormFieldProps>;
        formFieldsProps[id] = <T>{...fieldProps};

        if (!this._config.validationRules) this._config.validationRules = {};
        const formValidationRules = this._config.validationRules as Record<keyof T, IRuleType[]>;
        if (validationRules && validationRules.length > 0) formValidationRules[id] = <T>[...validationRules];

        if (typeof tabName !== 'undefined') formFieldsProps[id].tab = tabName;
    }`;
//endregion

//region Components config extra methods
module.exports.getId = `/** Get component id */
    getId() {
        return this._id as keyof T;
    }`;

module.exports.getValidationRules = `/** Get validation rules */
    getValidationRules() {
        return this._validationRules;
    }`;

module.exports.addValidationRules =`/** Add validation rules */
    validationRules(...args: IRuleType[]) {
        for (const rule of args) {
            this._validationRules.push(rule)
        }
        
        return this;
    }`
//endregion
