// eslint-disable-next-line @typescript-eslint/no-var-requires
let extraMethods = require('./configExtraMethods');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let parsingMethods = require('./configParsingMethods');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let classMethods = require('./configClassMethods');

//region Options
const options = {
    dForm: {
        modulePath: '../dForm.tsx',
        savePath: '../configBuilder/dFormConfig.ts',
        typeName: 'IDFormProps',
        typePath: 'baseComponents/dForm/dForm',
    },
    dFormModal: {
        modulePath: '../../dFormModal/dFormModal.tsx',
        savePath: '../configBuilder/dFormModalConfig.ts',
        typeName: 'IDModalProps',
        typePath: 'baseComponents/dFormModal/dFormModal',
    },
    treeSelect: {
        modulePath: '../../treeSelect/treeSelect.tsx',
        savePath: '',
        typeName: 'ITreeSelectProps',
        typePath: 'baseComponents/treeSelect/treeSelect',
    },
};

const componentsList = [
    {name: 'baseComponent', interface: 'IDFormFieldProps'},
    {name: 'checkboxComponent', interface: 'IDFormFieldCheckBoxProps'},
    {name: 'dateTimeComponent', interface: 'IDFormFieldDateTimeProps'},
    {name: 'dragAndDropComponent', interface: 'IDFormFieldDragAndDropProps'},
    {name: 'inputComponent', interface: 'IDFormFieldInputProps'},
    {name: 'linkComponent', interface: 'IDFormFieldLinkProps'},
    {name: 'numberComponent', interface: 'IDFormFieldNumberProps'},
    {name: 'passwordComponent', interface: 'IDFormFieldPasswordProps'},
    {name: 'selectComponent', interface: 'IDFormFieldSelectProps'},
    {name: 'switchComponent', interface: 'IDFormFieldSwitchProps'},
    {name: 'textAreaComponent', interface: 'IDFormFieldTextAreaProps'},
    {name: 'textEditorComponent', interface: 'IDFormTextEditorProps'},
    {name: 'treeSelectComponent', interface: 'IDFormFieldTreeSelectProps'},
    {name: 'tabulatorGridComponent', interface: 'IDFormFieldTabulatorGridProps'},
];

function addComponentsToOptions() {
    for (const component of componentsList) {
        const props = {};
        props.modulePath = '../components/' + component.name + '.tsx';
        props.savePath = '../configBuilder/' + component.name + 'Config.ts';
        props.typeName = component.interface;
        props.typePath = 'baseComponents/dForm/components/' + component.name;
        options[component.name] = props;
    }
}

addComponentsToOptions();

//endregion

//region Service methods
/**
 * @param {string} string
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Get component config generation status info for console
 * @param {string} componentName
 * @param {string} status
 * @param {number} width
 * @param {number} status
 * @returns {string}
 */
function prepareAlignedStatusMsg(componentName, status, width) {
    let result = '        ' + componentName + ' ';
    const addSpaces = width - result.length;
    if (addSpaces > 0) result = result + ' '.repeat(addSpaces);
    return result + status;
}

/**
 * @param componentName
 * @param {string} [error]
 * @returns {boolean}
 */
function logStatus(componentName, error) {
    console.log(prepareAlignedStatusMsg(componentName, error ? error : 'OK', 40));
}
//endregion

//region Generate configs
/**
 * generate components config classes
 * @returns {string[]}
 */
function generateComponentsConfigs() {
    for (const component of componentsList) {
        if (component.name === 'baseComponent') continue;
        saveConfigClass(component.name, getComponentClassProps);
    }
}

/**
 * Generate base component config class props
 * @param {string} componentName
 * @returns {IClassProps}
 */
function getBaseComponentClassProps(componentName) {
    const baseOptions = options[componentName];
    const baseClassName = capitalizeFirstLetter(componentName + 'Config');
    const properties = parsingMethods.parseProperties(baseOptions);
    delete properties['component'];

    return {
        className: baseClassName + '<T>',
        imports: {IDFormFieldProps: baseOptions.typePath, IRuleType: '../validators/baseValidator'},
        fields: {
            _config: {access: 'protected', type: 'Record<string, unknown>', value: '{}'},
            _id: {access: 'protected readonly', type: 'keyof T'},
            _validationRules: {access: 'protected', type: 'IRuleType[]', value: '[]'},
        },
        constructor: {
            parameters: {id: 'keyof T'},
            rows: [`this._id = id`],
        },
        propMethods: properties,
        additionalMethods: {
            validationRules: extraMethods.addValidationRules,
            getValidationRules: extraMethods.getValidationRules,
            getId: extraMethods.getId,
            getConfig: '/** Get field config */\n    getConfig() {\n        return this._config as ' + baseOptions.typeName + '\n    }',
        },
    };
}

/**
 * Generate component config class props
 * @param {string} componentName
 * @returns {IClassProps}
 */
function getComponentClassProps(componentName) {
    const baseComponentsClassProps = getBaseComponentClassProps('baseComponent');

    //component options
    const componentOptions = options[componentName];
    const componentClassName = capitalizeFirstLetter(componentName) + 'Config';
    let properties = parsingMethods.parseProperties(componentOptions);
    delete properties['component'];

    //region unique components extra processing
    let treeSelectImport = undefined;
    if (componentName === 'treeSelectComponent') {
        const treeSelectProperties = parsingMethods.parseProperties(options.treeSelect);
        delete treeSelectProperties['onChange'];
        properties = {...treeSelectProperties, ...properties};
        treeSelectImport = options.treeSelect.typePath;
    }
    //endregion

    /**@type IClassProps */
    const classProps = {
        className: componentClassName + '<T>',
        imports: {
            //...baseComponentsClassProps.imports,
            'IDFormFieldProps': baseComponentsClassProps.imports['IDFormFieldProps'],
            BaseComponentConfig: './baseComponentConfig',
        },
        extends: 'BaseComponentConfig<T>',
        constructor: {
            parameters: {id: 'keyof T'},
            rows: ['super(id)', `this._config.component = ${capitalizeFirstLetter(componentName)}`],
        },
        propMethods: {...baseComponentsClassProps.propMethods, ...properties},
        additionalMethods: {
            getConfig: '/** Get field config */\n    getConfig() {\n        return this._config as ' + componentOptions.typeName + '\n    }',
        },
    };

    classProps.imports[componentOptions.typeName] = componentOptions.typePath;
    classProps.imports[capitalizeFirstLetter(componentName)] = componentOptions.typePath;
    if (treeSelectImport) classProps.imports['ITreeSelectProps'] = treeSelectImport;
    return classProps;
}

/**
 * Generate DForm config class props
 * @param {string} componentName
 * @returns {IClassProps}
 */
function getFormClassProps(componentName) {
    const formClassname = capitalizeFirstLetter(componentName + 'Config');
    const formOptions = options[componentName];
    const properties = parsingMethods.parseProperties(formOptions);
    properties['fieldsProps'] = {...properties['fieldsProps'], type: 'Record<keyof T, IDFormFieldProps>'};
    properties['validationRules'] = {...properties['validationRules'], type: 'Record<keyof T, IRuleType[]>'};
    delete properties['formId'];

    return {
        className: formClassname + '<T>',
        imports: {
            IDFormProps: formOptions.typePath,
            BaseComponentConfig: './baseComponentConfig',
            IDFormFieldProps: '../components/baseComponent',
            IRuleType: '../validators/baseValidator',
        },
        constructor: {
            parameters: {formId: 'string'},
            rows: [`this._config.formId = formId`],
        },
        fields: {_config: {access: 'protected', type: 'Record<string, unknown>', value: '{}'}},
        propMethods: properties,
        additionalMethods: {
            addFields: extraMethods.addField,
            addTab: extraMethods.addTabs,
            addFieldsConfig: extraMethods.addFieldsConfig,
            updateFieldsProps: extraMethods.updateFieldsProps,
            getConfig: '/** Get form config */\n    getConfig() {\n        return this._config as unknown as ' + formOptions.typeName + '\n    }',
        },
    };
}

/**
 * Generate DFormModal config class props
 * @param {string} componentName
 * @returns {IClassProps}
 */
function getFormModalClassProps(componentName) {
    const formClassProps = getFormClassProps('dForm');

    const formModalClassname = capitalizeFirstLetter(componentName + 'Config');
    const formModalOptions = options[componentName];
    const properties = parsingMethods.parseProperties(formModalOptions);
    delete properties['formId'];

    return {
        className: formModalClassname + '<T>',
        extends: 'DFormConfig<T>',
        imports: {
            ...formClassProps.imports,
            DFormConfig: './dFormConfig',
            IDModalProps: formModalOptions.typePath,
            IDFormModalProps: formModalOptions.typePath,
        },
        constructor: {
            parameters: {formId: 'string'},
            rows: [`super (formId)`],
        },
        propMethods: {...formClassProps.propMethods, ...properties},
        additionalMethods: {
            getConfig: '/** Get form config */\n    getConfig() {\n        return this._config as unknown as IDFormModalProps \n    }',
            addTab: formClassProps.additionalMethods.addTab,
            addFields: formClassProps.additionalMethods.addFields,
        },
    };
}
//endregion

/**
 *
 * @param {string} componentName
 * @param {function(string): IClassProps} classGenerator
 */
function saveConfigClass(componentName, classGenerator) {
    try {
        const componentOptions = options[componentName];
        const classProps = classGenerator(componentName);
        const classTxt = classMethods.generateClass(classProps);
        parsingMethods.saveFile(componentOptions.savePath, classTxt);
        logStatus(componentName);
    } catch (e) {
        logStatus(componentName, e.message);
    }
}

function run() {
    console.log('Generating DForm components config builders classes');
    console.log('    Components configs classes:');
    saveConfigClass('baseComponent', getBaseComponentClassProps);
    generateComponentsConfigs();

    console.log('    Forms configs classes:');
    saveConfigClass('dForm', getFormClassProps);
    saveConfigClass('dFormModal', getFormModalClassProps);
    console.log('The task finished');
}

run();

/**
 * This callback returns component config class properties
 * @callback classGenerator
 * @param {string} componentName
 * @returns {IClassProps}
 */

/**
 * @typedef {Object} IClassProps
 * @property {string} className
 * @property {Object.<string, string>} [imports] - import props
 * @property {Object.<string, {[access]: string, [value]:string, type:string}>} [fields] - fields props
 * @property {{parameters: Object.<string, string>, rows:string[]}} [constructor] - constructor props
 * @property {Object.<string, {name: string, type: string, sourceType: string, comment}>} [propMethods] - propMethods
 * @property {Object.<string, string>} [additionalMethods] - additional methods props
 * @property {string} [types] - types props
 * @property {string} [implements] - types props
 * @property {string} [extends] - types props
 **/
