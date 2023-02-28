// eslint-disable-next-line @typescript-eslint/no-var-requires
let extraMethods = require('./configExtraMethods');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let parsingMethods = require('./configParsingMethods');
// eslint-disable-next-line @typescript-eslint/no-var-requires
let plassMethods = require('./configClassMethods');

//region Options
const debug = !!process.argv[2];

const options = {
    formProps: {
        modulePath: '..\\dForm.tsx',
        savePath: '..\\configBuilder\\dFormConfig.ts',
        typeName: 'IDFormProps',
        typePath: 'baseComponents/dForm/dForm',
    },
    formModalProps: {
        modulePath: '..\\..\\dFormModal\\dFormModal.tsx',
        savePath: '..\\configBuilder\\dFormModalConfig.ts',
        typeName: 'IDFormModalProps',
        typePath: 'baseComponents/dFormModal/dFormModal',
    },
    treeSelectProps: {
        modulePath: '..\\..\\treeSelect\\treeSelect.tsx',
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
    {name: 'gridComponent', interface: 'IDFormFieldGridProps'},
    {name: 'inputComponent', interface: 'IDFormFieldInputProps'},
    {name: 'linkComponent', interface: 'IDFormFieldLinkProps'},
    {name: 'numberComponent', interface: 'IDFormFieldNumberProps'},
    {name: 'passwordComponent', interface: 'IDFormFieldPasswordProps'},
    {name: 'selectComponent', interface: 'IDFormFieldSelectProps'},
    {name: 'switchComponent', interface: 'IDFormFieldSwitchProps'},
    {name: 'textAreaComponent', interface: 'IDFormFieldTextAreaProps'},
    {name: 'textEditorComponent', interface: 'IDFormTextEditorProps'},
    {name: 'treeSelectComponent', interface: 'IDFormFieldTreeSelectProps'},
];

function addComponentsToOptions() {
    for (const component of componentsList) {
        const props = {};
        props.modulePath = '..\\components\\' + component.name + '.tsx';
        props.savePath = '..\\configBuilder\\' + component.name + 'Config.ts';
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
 * @param {boolean} isModal
 * @returns {Promise<void>}
 */
async function generateFormConfigClass(isModal) {
    const componentName = isModal ? 'DFormModal' : 'DForm';
    const componentClassName = componentName + 'Config';
    const formOptions = isModal ? options.formModalProps : options.formProps;
    let parseResult = await parsingMethods.parseProperties(formOptions);
    if (parseResult.error) {
        showStatusMsg(componentClassName, parseResult.error.operation, parseResult.error.message);
        return;
    }

    let properties = parseResult.properties;

    let dFormPropsImport = undefined;
    if (isModal) {
        //The modal form props interface separated on 2 parts. We need to join it to the form props
        const frmPropertiesResult = await parsingMethods.parseProperties(options.formProps);
        if (frmPropertiesResult.error) {
            showStatusMsg(componentClassName, frmPropertiesResult.error.operation, frmPropertiesResult.error.message);
            return;
        }
        const frmProperties = frmPropertiesResult.properties;
        properties = {...frmProperties, ...properties};
        dFormPropsImport = {typeName: options.formProps.typeName, typePath: options.formProps.typePath};
    }

    const classTxt = plassMethods.generateClass(componentClassName, {
        imports: [
            formOptions,
            {typeName: 'IDFormFieldProps', typePath: '../components/baseComponent'},
            {typeName: 'IRuleType', typePath: '../validators/baseValidator'},
            dFormPropsImport,
        ],
        types: extraMethods.IConfigGetter,
        fields: [{access: 'private', name: '_config', type: formOptions.typeName, value: '{} as ' + formOptions.typeName}],
        propMethods: properties,
        additionalMethods: [
            extraMethods.addField,
            extraMethods.addTabs,
            extraMethods.addFieldsConfig,
            extraMethods.updateFieldsProps,
            extraMethods.getFormConfig,
        ],
    });

    const saveResult = await parsingMethods.saveFile(formOptions.savePath, classTxt);
    showStatusMsg(componentClassName, 'saving', saveResult, true);
}

/**
 * generate components config classes
 * @returns {Promise<string[]>}
 */
async function generateComponentsConfigs() {
    const componentsClassNames = [];
    for (const component of componentsList) {
        if (component.name === 'baseComponent') continue;
        const className = await generateComponentConfigClass(component.name);
        componentsClassNames.push(className);
    }

    return componentsClassNames;
}

/**
 * Generate component config class
 * @param {string}componentName
 * @returns {Promise<string>}
 */
async function generateComponentConfigClass(componentName) {
    const baseOptions = options['baseComponentProps'];
    const componentOptions = options[componentName + 'Props'];
    const componentClassName = capitalizeFirstLetter(componentName) + 'Config';
    const basePropertiesResult = await parsingMethods.parseProperties(baseOptions);

    if (basePropertiesResult.error) {
        showStatusMsg(componentClassName, basePropertiesResult.error.operation, basePropertiesResult.error.message);
        return componentName;
    }
    const baseProperties = basePropertiesResult.properties;
    const propertiesResult = await parsingMethods.parseProperties(componentOptions);
    if (propertiesResult.error) {
        showStatusMsg(componentClassName, propertiesResult.error.operation, propertiesResult.error.message);
        return componentName;
    }

    const properties = propertiesResult.properties;

    let commonProperties = {...baseProperties, ...properties};
    delete commonProperties['component'];

    //region unique components extra processing
    let altEditFormProps = undefined;
    let formConfigImport = undefined;
    let treeSelectImport = undefined;
    if (componentName === 'gridComponent') {
        delete commonProperties['editFormProps'];
        altEditFormProps = extraMethods.altEditFormProps;
        formConfigImport = {typeName: 'DFormModalConfig', typePath: './dFormModalConfig'};
    } else if (componentName === 'treeSelectComponent') {
        const treeSelectResult = await parsingMethods.parseProperties(options.treeSelectProps);

        if (treeSelectResult.error) {
            showStatusMsg(componentClassName, treeSelectResult.error.operation, treeSelectResult.error.message);
            return componentName;
        }
        const treeSelectProperties = treeSelectResult.properties;
        commonProperties = {...treeSelectProperties, ...commonProperties};
        delete commonProperties['onChange'];
        treeSelectImport = {typeName: 'ITreeSelectProps', typePath: options.treeSelectProps.typePath};
    }
    //endregion

    const classTxt = plassMethods.generateClass(componentClassName, {
        imports: [
            baseOptions,
            componentOptions,
            {typeName: capitalizeFirstLetter(componentName), typePath: componentOptions.typePath},
            {typeName: 'IConfigGetter', typePath: './dFormConfig'},
            {typeName: 'IRuleType', typePath: '../validators/baseValidator'},
            formConfigImport,
            treeSelectImport,
        ],
        implements: 'IConfigGetter',
        fields: [
            {access: 'private', name: '_config', type: componentOptions.typeName, value: '{} as ' + componentOptions.typeName},
            {access: 'private readonly', name: '_id', type: 'string'},
            {access: 'private', name: '_validationRules', type: 'IRuleType[]', value: '[]'},
        ],
        constructor: {
            parameters: [{var: 'id', type: 'string'}],
            rows: [`this._id = id`, `this._config.component = ${capitalizeFirstLetter(componentName)}`],
        },
        propMethods: commonProperties,
        additionalMethods: [extraMethods.getComponentConfig, altEditFormProps, extraMethods.addValidationRules],
    });

    const saveResult = await parsingMethods.saveFile(options[componentName + 'Props'].savePath, classTxt);
    showStatusMsg(componentClassName, 'saving', saveResult, true);

    return componentClassName;
}

//endregion

async function run() {
    console.log('Generating DForm components config builders classes');
    console.log('    Components configs classes:');
    await generateComponentsConfigs();

    console.log('    Forms configs classes:');
    await generateFormConfigClass(false);
    await generateFormConfigClass(true);
    console.log('The task finished');
}

run().then(null);
