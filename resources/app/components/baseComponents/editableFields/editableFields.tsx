import {AutoSizedTextArea, copyStyles} from '@krinopotam/ui-autosized-textarea';
import {EditOutlined, EnterOutlined} from '@ant-design/icons/lib';
import React, {CSSProperties, ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import {RuleType, validateValue} from './validator';
import {Tooltip, Typography, message} from 'antd';
import dayjs, {Dayjs} from 'dayjs';

import {DatePicker} from '@krinopotam/ui-datepicker';
import {IFetchResult} from '../agGrid/services/webServices';
import {IFormButton} from '@krinopotam/ui-buttons-row';
import {LinkProps} from 'antd/lib/typography/Link';
import {ParagraphProps} from 'antd/es/typography/Paragraph';
import {PopConfirm} from 'baseComponents/popConfirm';
import {TextAreaRef} from 'antd/es/input/TextArea';
import {TextProps} from 'antd/es/typography/Text';
import {TitleProps} from 'antd/es/typography/Title';
import styled from 'styled-components';

const {Title, Text, Paragraph, Link} = Typography;

//region region Types
interface IEditableFieldProps {
    editIcon?: React.ReactNode;
    onStart?: () => void;
    validationRules?: RuleType[];

    onChange?: (value: string) => void;
    onSubmit?: (value: string, api: IEditFieldApi) => boolean | void;
    onCancel?: () => void;
    onEnd?: () => void;
    maxLength?: number;
    enterIcon?: React.ReactNode;
    bordered?: boolean;
    multiline?: boolean;
    placeholder?: string;
    submitOnBlur?: boolean;
    confirmSubmit?: boolean;
    saveMethod?: {fieldName: string} & IUseFetchDataProps;
}

interface IEditableCommonFieldProps extends IEditableFieldProps {
    fieldType: FieldType;
}

interface IEditCommonProps extends Omit<IEditableFieldProps, 'onStart' | 'editIcon'> {
    fieldType: FieldType;
    value?: string;
    textStyleRef: React.RefObject<CSSStyleDeclaration>;
    readOnly?: boolean;
    saveHandler?: Promise<IFetchResult>;
    error?: string;
}

interface IEditFieldProps extends IEditCommonProps {
    display: 'block' | 'inline';
}

interface IEditDateFieldProps extends Omit<IEditCommonProps, 'maxLength' | 'enterIcon' | 'multiline'> {
    temp?: boolean; //TODO:убрать
}

type FieldType = 'text' | 'title' | 'paragraph' | 'link' | 'date';

interface IEditFieldApi {
    showConfirm: (val: boolean) => void;
    okButtonProps: (btnProps: IFormButton) => void;
    cancel: () => void;
    editEnd: () => void;
}

//endregion

const enterIconStyle: CSSProperties = {
    position: 'absolute',
    //right: '10px',
    marginLeft: '-25px',
    bottom: '8px',
    color: 'rgba(0, 0, 0, 0.45)',
    fontWeight: 'normal',
    fontSize: '14px',
    fontStyle: 'normal',
    pointerEvents: 'none',
};

const EditableField = ({
    fieldType,
    onChange,
    onSubmit,
    onCancel,
    onStart,
    onEnd,
    multiline,
    maxLength,
    bordered,
    editIcon,
    enterIcon,
    placeholder,
    submitOnBlur,
    confirmSubmit,
    saveMethod,
    validationRules,
    ...typographyProps
}: IEditableCommonFieldProps & Omit<TextProps | ParagraphProps | TitleProps | LinkProps, 'editable'>): JSX.Element | null => {
    const [editValue, setEditValue] = useState(typeof typographyProps.children === 'string' ? typographyProps.children : '');
    const [href, setHref] = useState((typographyProps as LinkProps).href || '');
    const [error, setError] = useState('');

    const [editMode, setEditMode] = useState(false);

    const textRef = useRef<HTMLDivElement>(null);
    const textStyleRef = useRef<CSSStyleDeclaration>({} as CSSStyleDeclaration);

    useEffect(() => {
        if (textRef.current) {
            const calculatedStyles = window.getComputedStyle(textRef.current, null);
            copyStyles(calculatedStyles, textStyleRef.current);
        }
    }, [fieldType]);

    const onClickHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        onStart?.();
        validate(editValue);
        setEditMode(true);
    };

    const onEndHandler = () => {
        onEnd?.();
        setEditMode(false);
    };

    const onCancelHandler = () => {
        onCancel?.();
        setEditMode(false);
    };

    const onSubmitHandler = (value: string, api: IEditFieldApi) => {
        const updateValue = () => {
            const result = onSubmit?.(value, api);
            if (typeof result === 'boolean' && !result) return false;

            if (fieldType !== 'link') setEditValue(value);
            else {
                const parts = value.split('#');
                setEditValue(parts[0]);
                setHref(parts[1] || '');
            }
        };

        if (!validate(value)) return false;

        if (!saveMethod) {
            updateValue();
            return;
        }

        //region Async save via store
        api.okButtonProps({loading: true});
        const parameters = {...saveMethod.parameters};
        parameters[saveMethod.fieldName] = value;
        saveMethod
            .method({
                parameters: parameters,
                callbacks: {
                    onSuccess: () => {
                        api.okButtonProps({loading: false});
                        api.showConfirm(false);
                        updateValue();
                        api.editEnd();
                        message.success('Данные сохранены', 5).then();
                    },
                    onError: (fetchError) => {
                        api.okButtonProps({loading: false});
                        message.error('Ошибка сохранения: ' + fetchError.message, 5).then();
                    },
                },
            })
            .then();

        return false; //cancel submit process because we use async saveMethod
        //endregion
    };

    const validate = (value: string) => {
        if (!validationRules) return true;
        const validateError = validateValue(value, validationRules);
        setError(validateError);
        return !validateError;
    };

    const handlerOnChange = (value: string) => {
        validate(value);

        onChange?.(value);
    };

    let display: 'block' | 'inline' = 'block';
    let typographyElement: React.ReactNode = null;
    const editButton = <EditButton onClick={onClickHandler} editIcon={editIcon} />;

    if (fieldType === 'title') {
        const _props = typographyProps as TitleProps;
        typographyElement = (
            <Title {..._props} ref={textRef}>
                <span dangerouslySetInnerHTML={{__html: editValue}} />
                {editButton}
            </Title>
        );
    } else if (fieldType === 'text') {
        const _props = typographyProps as TextProps;
        typographyElement = (
            <Text {..._props} ref={textRef}>
                <span dangerouslySetInnerHTML={{__html: editValue}} />
                {editButton}
            </Text>
        );
        display = 'inline';
    } else if (fieldType === 'paragraph') {
        const _props = typographyProps as ParagraphProps;
        typographyElement = (
            <Paragraph {..._props} ref={textRef}>
                <span dangerouslySetInnerHTML={{__html: editValue}} />
                {editButton}
            </Paragraph>
        );
    } else if (fieldType === 'link') {
        const _props = typographyProps as LinkProps;
        typographyElement = (
            <Link {..._props} href={href} ref={textRef}>
                <span dangerouslySetInnerHTML={{__html: editValue}} />
                {editButton}
            </Link>
        );
        display = 'inline';
    } else if (fieldType === 'date') {
        const _props = typographyProps as TextProps;
        typographyElement = (
            <Text {..._props} ref={textRef}>
                <span dangerouslySetInnerHTML={{__html: editValue}} />
                {editButton}
            </Text>
        );
    }
    if (!typographyElement) return null;

    const defaultPlaceHolder = fieldType === 'link' ? 'Название#URL' : '';
    const editBaseField = (
        <EditField
            fieldType={fieldType}
            onEnd={onEndHandler}
            onSubmit={onSubmitHandler}
            onChange={handlerOnChange}
            onCancel={onCancelHandler}
            bordered={bordered}
            textStyleRef={textStyleRef}
            submitOnBlur={submitOnBlur}
            confirmSubmit={confirmSubmit}
            error={error}
            value={fieldType !== 'link' ? editValue : editValue + '#' + href}
            placeholder={placeholder ? placeholder : defaultPlaceHolder}
            display={display}
            maxLength={maxLength}
            enterIcon={enterIcon}
            multiline={fieldType !== 'link' && multiline}
        />
    );

    const editDateField = (
        <EditDateField
            fieldType={fieldType}
            onEnd={onEndHandler}
            onSubmit={onSubmitHandler}
            onChange={handlerOnChange}
            onCancel={onCancelHandler}
            bordered={bordered}
            textStyleRef={textStyleRef}
            submitOnBlur={submitOnBlur}
            confirmSubmit={confirmSubmit}
            error={error}
            value={editValue}
            placeholder={placeholder}
        />
    );

    let editField = editBaseField;
    if (fieldType === 'date') editField = editDateField;

    if (editMode) return <>{editField}</>;

    return <>{typographyElement}</>;
};

const EditButton = ({onClick, editIcon}: {onClick: (e: React.MouseEvent) => void; editIcon?: React.ReactNode}): JSX.Element => {
    return (
        <div
            role="button"
            tabIndex={0}
            className="ant-typography-edit"
            aria-label="Edit"
            style={{border: '0px', background: 'transparent', padding: '0', lineHeight: 'inherit', display: 'inline-block'}}
            onClick={onClick}
        >
            {editIcon || <EditOutlined />}
        </div>
    );
};

//region Css
const InputContainer = styled.div`
    position: relative;
`;
//endregion

const convertHtmlToTextbox = (val: string | undefined) => {
    return (val || '').replace(/<br>|<br\s?\/>|<br\/>/gim, '\n');
};

const EditField = (props: IEditFieldProps): JSX.Element => {
    const [current, setCurrent, setDirty, showConfirm, onBlur, onKeyDown, onConfirmOk, onConfirmCancel, okButtonProps] = useCommonMethods(
        props,
        convertHtmlToTextbox
    );

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrent(e.target.value);
        props.onChange?.(e.target.value);
        setDirty(true);
    };

    const textAreaRef = useRef<TextAreaRef>(null);
    useEffect(function () {
        if (!textAreaRef.current) return;

        textAreaRef.current.focus();
        if (textAreaRef.current.resizableTextArea) {
            const length = textAreaRef.current.resizableTextArea?.textArea.value?.length || 0;
            textAreaRef.current.resizableTextArea.textArea.setSelectionRange(length, length);
        }
    }, []);

    let enterIcon: React.ReactNode = null;
    if (typeof props.enterIcon === 'undefined' || (typeof props.enterIcon === 'boolean' && props.enterIcon))
        enterIcon = <EnterOutlined style={enterIconStyle} />;
    else if (React.isValidElement(props.enterIcon)) enterIcon = React.cloneElement(props.enterIcon, {style: enterIconStyle});

    return (
        <InputContainer style={{display: props.display === 'block' ? 'block' : 'inline-block', marginLeft: '-12px', marginTop: '-5px'}}>
            <AutoSizedTextArea
                ref={textAreaRef}
                textStyleRef={props.textStyleRef}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                value={current}
                maxLength={props.maxLength}
                bordered={props.bordered}
                multiline={props.multiline}
                extraWidth={enterIcon ? 20 : 0}
                placeholder={props.placeholder}
                readOnly={showConfirm}
                status={props.error ? 'error' : ''}
            />
            <Tooltip title={props.error} placement="bottom" open={!!props.error} />
            <PopConfirm
                open={showConfirm}
                placement="right"
                title="Сохранить изменения"
                okText="Да"
                cancelText="Нет"
                onConfirm={onConfirmOk}
                onCancel={onConfirmCancel}
                trigger=""
                okButtonProps={okButtonProps}
            />
            {/*<Popconfirm
                placement="right"
                title="Сохранить изменения"
                okText="Да"
                cancelText="Нет"
                open={showConfirm}
                onConfirm={onConfirmOk}
                onCancel={onConfirmCancel}
                trigger=""
                okButtonProps={okButtonProps}
            />*/}
            {enterIcon}
        </InputContainer>
    );
};

const EditDateField = (props: IEditDateFieldProps): JSX.Element => {
    const dateFormat = 'DD.MM.YYYY';

    const [current, setCurrent, setDirty, showConfirm, onBlur, onKeyDown] = useCommonMethods(props);

    const onChange = (_date: Dayjs | null, dateString: string) => {
        props.onChange?.(dateString);
        setCurrent(dateString);
        setDirty(true);
    };

    return (
        <InputContainer style={{display: 'inline-block', marginLeft: '-12px', marginTop: '-5px'}}>
            <DatePicker
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                value={current ? dayjs(current, dateFormat) : null}
                bordered={props.bordered}
                placeholder={props.placeholder}
                format={dateFormat}
                autoFocus={true}
                readOnly={showConfirm}
                status={props.error ? 'error' : ''}
            />
            <Tooltip title={props.error} placement="bottom" open={!!props.error} />
            {/* <Popconfirm
                placement="right"
                title="Сохранить изменения"
                okText="Да"
                cancelText="Нет"
                open={showConfirm}
                onConfirm={onConfirmOk}
                onCancel={onConfirmCancel}
                trigger=""
                okButtonProps={okButtonProps}
            /> */}
        </InputContainer>
    );
};

const useCommonMethods = (
    props: IEditCommonProps,
    prepareCurrentValue?: (val: string | undefined) => string
): [
    string,
    (current: string) => void,
    (dirty: boolean) => void,
    boolean,
    () => void,
    (e: React.KeyboardEvent) => void,
    () => void,
    () => void,
    IFormButton
] => {
    const [dirty, setDirty] = useState(false);
    const [current, setCurrent] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [okButtonProps, setOkButtonProps] = useState<IFormButton>({});

    const [fieldApi] = useState({} as IEditFieldApi);

    useEffect(
        function () {
            const val = prepareCurrentValue ? prepareCurrentValue(props.value) : props.value || '';
            setCurrent(val);
        },
        [prepareCurrentValue, setCurrent, props.value]
    );

    const submitConfirm = () => {
        const originalValue = current.trim();
        const htmlValue = originalValue.replace(/\n\r|\n|\r/gim, '<br/>');

        const result = props.onSubmit?.(htmlValue, fieldApi);
        if (typeof result === 'boolean' && !result) return false;
        editEnd();
    };

    const submit = () => {
        if (props.error) return;

        if (!dirty) {
            cancel();
            return;
        }

        if (!props.confirmSubmit) {
            submitConfirm();
            return;
        }

        setShowConfirm(true);
    };

    const editEnd = () => {
        props.onEnd?.();
    };

    const cancel = () => {
        props.onCancel?.();
        editEnd();
    };

    const onBlur = () => {
        if (typeof props.submitOnBlur === 'undefined' || props.submitOnBlur) submit();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!e?.key) return;
        const key = e.key.toLowerCase();

        if (key === 'enter' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
            //ENTER
            e.stopPropagation();
            e.preventDefault();
            submit();
        } else if (key === 'escape' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
            //ESC
            e.stopPropagation();
            e.preventDefault();
            cancel();
        }
    };

    const onConfirmCancel = () => {
        cancel();
    };

    fieldApi.showConfirm = (val) => setShowConfirm(val);
    fieldApi.okButtonProps = (btnProps: IFormButton) => setOkButtonProps(btnProps);
    fieldApi.cancel = cancel;
    fieldApi.editEnd = editEnd;

    return [current, setCurrent, setDirty, showConfirm, onBlur, onKeyDown, submitConfirm, onConfirmCancel, okButtonProps];
};

//region Convert to fields
export const EditableTitle = (props: IEditableFieldProps & Omit<TitleProps, 'editable'>): JSX.Element | null => {
    const component = useMemo(() => {
        return (
            <EditableField fieldType="title" {...props}>
                {props.children}
            </EditableField>
        );
    }, [props]);
    return <>{component}</>;
};

export const EditableText = (props: IEditableFieldProps & Omit<TextProps, 'editable'>): JSX.Element | null => {
    const component = useMemo(() => {
        return (
            <EditableField fieldType="text" {...props}>
                {props.children}
            </EditableField>
        );
    }, [props]);
    return <>{component}</>;
};

export const EditableParagraph = (props: IEditableFieldProps & Omit<ParagraphProps, 'editable'>): JSX.Element | null => {
    const component = useMemo(() => {
        return (
            <EditableField fieldType="paragraph" {...props}>
                {props.children}
            </EditableField>
        );
    }, [props]);
    return <>{component}</>;
};

export const EditableLink = (props: IEditableFieldProps & Omit<LinkProps, 'editable'>): JSX.Element | null => {
    const component = useMemo(() => {
        return (
            <EditableField fieldType="link" {...props}>
                {props.children}
            </EditableField>
        );
    }, [props]);
    return <>{component}</>;
};

export const EditableDate = (props: IEditableFieldProps & Omit<TextProps, 'editable'>): JSX.Element | null => {
    const component = useMemo(() => {
        return (
            <EditableField fieldType="date" {...props}>
                {props.children}
            </EditableField>
        );
    }, [props]);
    return <>{component}</>;
};
//endregion
