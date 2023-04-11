// eslint-disable-next-line @typescript-eslint/no-var-requires
let extraMethods = require('./configExtraMethods');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let parsingMethods = require('./configParsingMethods');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let classMethods = require('./configClassMethods');

//region Options
const debug = !!process.argv[2];

const options = {
    formProps: {
        modulePath: '../dForm.tsx',
        savePath: '../configBuilder/dFormConfig.ts',
        typeName: 'IDFormProps',
        typePath: 'baseComponents/dForm/dForm',
    },
    formModalProps: {
        modulePath: '../../dFormModal/dFormModal.tsx',
        savePath: '../configBuilder/dFormModalConfig.ts',
        typeName: 'IDModalProps',
        typePath: 'baseComponents/dFormModal/dFormModal',
    },
    treeSelectProps: {
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
        options[component.name + 'Props'] = props;
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
 * @param {string} operation
 * @param {string} error
 * @param {boolean} [final]
 * @returns {boolean}
 */
function showStatusMsg(componentName, operation, error, final) {
    if (!error) {
        if (final) console.log(prepareAlignedStatusMsg(componentName, 'OK', 40));
        return true;
    }

    const status = operation + ' error' + (debug ? ': ' + error : '');
    console.log(prepareAlignedStatusMsg(componentName, status, 40));
    return false;
}
//endregion

//region Generate configs
/**
 * Generate form config class
 * @returns {void}
 */
function generateFormConfigClass() {
    const componentName = 'DForm';
    const componentClassName = componentName + 'Config';
    const formOptions = options.formProps;
    let parseResult = parsingMethods.parseProperties(formOptions);
    if (parseResult.error) {
        showStatusMsg(componentClassName, parseResult.error.operation, parseResult.error.message);
        return;
    }

    let properties = parseResult.properties;
    properties['fieldsProps'] = {...properties['fieldsProps'], type: 'Record<keyof T, IDFormFieldProps>'};
    properties['validationRules'] = {...properties['validationRules'], type: 'Record<keyof T, IRuleType[]>'};
    delete properties['formId'];

    /**
     * @type {IClassProps}
     */
    const classProps = {
        className: componentClassName + '<T>',
        imports: [
            formOptions,
            {typeName: 'BaseComponentConfig', typePath: './baseComponentConfig'},
            {typeName: 'IDFormFieldProps', typePath: '../components/baseComponent'},
            {typeName: 'IRuleType', typePath: '../validators/baseValidator'},
        ],
        constructor: {
            parameters: [{var: 'formId', type: 'string'}],
            rows: [`this._config.formId = formId`],
        },
        fields: [{access: 'protected', name: '_config', type: 'Record<string, unknown>', value: '{}'}],
        propMethods: properties,
        additionalMethods: [
            extraMethods.addField,
            extraMethods.addTabs,
            extraMethods.addFieldsConfig,
            extraMethods.updateFieldsProps,
            '/** Get form config */\n    getConfig() {\n        return this._config as unknown as ' + formOptions.typeName + '\n    }',
        ],
    };
    const classTxt = classMethods.generateClass(classProps);

    const saveResult = parsingMethods.saveFile(formOptions.savePath, classTxt);
    showStatusMsg(componentClassName, 'saving', saveResult, true);
}

/**
 * Generate  modal form config class
 * @returns {void}
 */
function generateModalFormConfigClass() {
    const componentName = 'DFormModal';
    const componentClassName = componentName + 'Config';
    const formOptions = options.formModalProps;
    let parseResult = parsingMethods.parseProperties(formOptions);
    if (parseResult.error) {
        showStatusMsg(componentClassName, parseResult.error.operation, parseResult.error.message);
        return;
    }
    const properties = parseResult.properties;
    delete properties['formId'];

    /**
     * @type {IClassProps}
     */
    const classProps = {
        className: componentClassName + '<T>',
        extends: 'DFormConfig<T>',
        imports: [formOptions, {typeName: 'DFormConfig', typePath: './dFormConfig'}, {typeName: 'IDFormModalProps', typePath: formOptions.typePath}],
        constructor: {
            parameters: [{var: 'formId', type: 'string'}],
            rows: [`super (formId)`],
        },
        propMethods: properties,
        additionalMethods: ['/** Get form config */\n    getConfig() {\n        return this._config as unknown as IDFormModalProps \n    }'],
    };
    const classTxt = classMethods.generateClass(classProps);

    const saveResult = parsingMethods.saveFile(formOptions.savePath, classTxt);
    showStatusMsg(componentClassName, 'saving', saveResult, true);
}

/**
 * generate components config classes
 * @returns {string[]}
 */
function generateComponentsConfigs() {
    const componentsClassNames = [];
    for (const component of componentsList) {
        if (component.name === 'baseComponent') continue;
        const className = generateComponentConfigClass(component.name);
        componentsClassNames.push(className);
    }

    return componentsClassNames;
}

/**
 * Generate component config class
 * @returns {IClassProps}
 */
function generaBaseComponentConfigClass() {
    const baseOptions = options['baseComponentProps'];
    const baseClassName = 'BaseComponentConfig';
    const basePropertiesResult = parsingMethods.parseProperties(baseOptions);

    if (basePropertiesResult.error) {
        showStatusMsg(baseClassName, basePropertiesResult.error.operation, basePropertiesResult.error.message);
        return undefined;
    }
    const baseProperties = basePropertiesResult.properties;
    delete baseProperties['component'];
    //endregion

    /**
     * @type {IClassProps}
     */
    const classProps = {
        className: baseClassName + '<T>',
        imports: [baseOptions, {typeName: 'IRuleType', typePath: '../validators/baseValidator'}],
        fields: [
            {access: 'protected', name: '_config', type: 'Record<string, unknown>', value: '{}'},
            {access: 'protected readonly', name: '_id', type: 'keyof T'},
            {access: 'protected', name: '_validationRules', type: 'IRuleType[]', value: '[]'},
        ],
        constructor: {
            parameters: [{var: 'id', type: 'keyof T'}],
            rows: [`this._id = id`],
        },
        propMethods: baseProperties,
        additionalMethods: [
            extraMethods.addValidationRules,
            extraMethods.getValidationRules,
            extraMethods.getId,
            '/** Get field config */\n    getConfig() {\n        return this._config as ' + baseOptions.typeName + '\n    }',
        ],
    };
    const classTxt = classMethods.generateClass(classProps);

    const saveResult = parsingMethods.saveFile(baseOptions.savePath, classTxt);
    showStatusMsg(baseClassName, 'saving', saveResult, true);

    return classProps;
}

/**
 * @param componentName
 * @returns {IClassProps}
 */
function generateComponentConfigClass(componentName) {
    //base options
    const baseOptions = options['baseComponentProps'];
    const baseClassName = 'BaseComponentConfig';
    const basePropertiesResult = parsingMethods.parseProperties(baseOptions);

    if (basePropertiesResult.error) {
        showStatusMsg(baseClassName, basePropertiesResult.error.operation, basePropertiesResult.error.message);
        return componentName;
    }
    const baseProperties = basePropertiesResult.properties;
    delete baseProperties['component'];

    //component options
    const componentOptions = options[componentName + 'Props'];
    const componentClassName = capitalizeFirstLetter(componentName) + 'Config';

    const propertiesResult = parsingMethods.parseProperties(componentOptions);
    if (propertiesResult.error) {
        showStatusMsg(componentClassName, propertiesResult.error.operation, propertiesResult.error.message);
        return componentName;
    }

    let componentProperties = propertiesResult.properties;
    delete componentProperties['component'];
    let properties = {...baseProperties, ...componentProperties};

    //region unique components extra processing
    let treeSelectImport = undefined;
    if (componentName === 'treeSelectComponent') {
        const treeSelectResult = parsingMethods.parseProperties(options.treeSelectProps);

        if (treeSelectResult.error) {
            showStatusMsg(componentClassName, treeSelectResult.error.operation, treeSelectResult.error.message);
            return componentName;
        }
        const treeSelectProperties = treeSelectResult.properties;
        properties = {...properties, ...treeSelectProperties};
        delete properties['onChange'];
        treeSelectImport = {typeName: 'ITreeSelectProps', typePath: options.treeSelectProps.typePath};
    }
    //endregion

    /**
     * @type {IClassProps}
     */
    const classProps = {
        className: componentClassName + '<T>',
        imports: [
            baseOptions,
            {typeName: 'IRuleType', typePath: '../validators/baseValidator'},
            componentOptions,
            {typeName: 'BaseComponentConfig', typePath: './baseComponentConfig'},
            {typeName: capitalizeFirstLetter(componentName), typePath: componentOptions.typePath},
            treeSelectImport,
        ],
        extends: 'BaseComponentConfig<T>',
        fields: [
            {access: 'protected', name: '_config', type: 'Record<string, unknown>', value: '{}'},
            {access: 'protected readonly', name: '_id', type: 'keyof T'},
            {access: 'protected', name: '_validationRules', type: 'IRuleType[]', value: '[]'},
        ],
        constructor: {
            parameters: [{var: 'id', type: 'keyof T'}],
            rows: ['super(id)', 'this._id = id', `this._config.component = ${capitalizeFirstLetter(componentName)}`],
        },
        propMethods: properties,
        additionalMethods: [
            extraMethods.addValidationRules,
            extraMethods.getValidationRules,
            extraMethods.getId,
            '/** Get field config */\n    getConfig() {\n        return this._config as ' + componentOptions.typeName + '\n    }',
        ],
    };
    const classTxt = classMethods.generateClass(classProps);

    const saveResult = parsingMethods.saveFile(options[componentName + 'Props'].savePath, classTxt);
    showStatusMsg(componentClassName, 'saving', saveResult, true);

    return classProps;
}

//endregion

async function run() {
    console.log('Generating DForm components config builders classes');
    console.log('    Components configs classes:');
    generaBaseComponentConfigClass();
    generateComponentsConfigs();

    console.log('    Forms configs classes:');
    generateFormConfigClass();
    generateModalFormConfigClass();
    console.log('The task finished');
}

run().then(null);

/**
 * @typedef {Object} IClassProps
 * @property {string} className
 * @property {{typePath: string, typeName: string}[]} [imports] - import props
 * @property {{access: string, name: string, [value]:string, type:string}[]} [fields] - fields props
 * @property {{parameters: {var: string, type: string}[], rows:string[]}} [constructor] - constructor props
 * @property {Object.<string, {name: string, type: string, sourceType: string, comment}>} [propMethods] - propMethods
 * @property {string[]} [additionalMethods] - additional methods props
 * @property {string} [types] - types props
 * @property {string} [implements] - types props
 * @property {string} [extends] - types props
 **/
