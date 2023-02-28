import React, {CSSProperties, ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';
import {TextAreaProps, TextAreaRef} from 'antd/es/input/TextArea';

import {Input} from 'antd';
import {mergeObjects} from 'helpers/helpersObjects';
import styled from 'styled-components';

const {TextArea} = Input;

//region Types
interface IAutoSizedProps {
    value: string;
    textStyleRef: React.RefObject<CSSStyleDeclaration>;
    style?: CSSProperties;
    children?: React.ReactNode;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    multiline?: boolean;
    extraHeight?: number;
    extraWidth?: number;
    placeholder?: string;
}

type IAutoSizedTextAreaProps = IAutoSizedProps & Omit<TextAreaProps, 'autoSize, showCount'>;

interface IInputBoundsStyle {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    borderTopWidth: number;
    borderBottomWidth: number;
    borderLeftWidth: number;
    borderRightWidth: number;
}

//endregion

//region Css
const SizerDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    //border-style: solid;
    //border-color: aqua;
    white-space: pre;
    &:after {
        content: ' ';
    }
`;
//endregion

export const AutoSizedTextArea = React.forwardRef<TextAreaRef, IAutoSizedTextAreaProps>(
    ({textStyleRef, style, value, onChange, multiline, extraHeight, extraWidth, placeholder, ...props}, ref): JSX.Element => {
        const sizerRef = useRef<HTMLDivElement>(null);
        const placeholderSizerRef = useRef<HTMLDivElement>(null);
        const inputBoundsStyle = useGetInputBoundsStyle(ref as React.RefObject<TextAreaRef>);
        useCopyTextAreaStyles(sizerRef, placeholderSizerRef, ref as React.RefObject<TextAreaRef>, textStyleRef);
        const [inputHeight, inputWidth] = useCalculateSize(sizerRef, placeholderSizerRef, value, inputBoundsStyle, extraHeight, extraWidth);
        const _style = usePrepareInputStyles(style, inputHeight, inputWidth);

        const _onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            if (typeof multiline === 'boolean' && !multiline) e.target.value = e.target.value.replace(/[\n\r]/g, ''); //prevent multiline input
            if (onChange) onChange(e);
        };

        return (
            <>
                <TextArea {...props} placeholder={placeholder} ref={ref} style={_style} onChange={_onChange} value={value} />
                <SizerDiv ref={sizerRef}>{value}</SizerDiv>
                {placeholder && <SizerDiv ref={placeholderSizerRef}>{placeholder}</SizerDiv>}
            </>
        );
    }
);
AutoSizedTextArea.displayName = 'AutoSizedTextArea2';

const useGetInputBoundsStyle = (textAreaRef: React.RefObject<TextAreaRef>): IInputBoundsStyle => {
    const [inputStyle, setInputStyle] = useState<IInputBoundsStyle>({
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    });
    useEffect(() => {
        if (!textAreaRef.current || !textAreaRef.current.resizableTextArea) return;
        const calculatedStyles = window.getComputedStyle(textAreaRef.current.resizableTextArea.textArea, null);
        setInputStyle({
            paddingTop: parseInt(calculatedStyles.paddingTop, 10),
            paddingBottom: parseInt(calculatedStyles.paddingBottom, 10),
            paddingLeft: parseInt(calculatedStyles.paddingLeft, 10),
            paddingRight: parseInt(calculatedStyles.paddingRight, 10),
            borderTopWidth: parseInt(calculatedStyles.borderTopWidth, 10),
            borderBottomWidth: parseInt(calculatedStyles.borderBottomWidth, 10),
            borderLeftWidth: parseInt(calculatedStyles.borderLeftWidth, 10),
            borderRightWidth: parseInt(calculatedStyles.borderRightWidth, 10),
        });
    }, [textAreaRef, setInputStyle]);

    return inputStyle;
};

const useCopyTextAreaStyles = (
    sizerRef: React.RefObject<HTMLDivElement>,
    placeholderSizerRef: React.RefObject<HTMLDivElement>,
    textAreaRef: React.RefObject<TextAreaRef>,
    textStyleRef: React.RefObject<CSSStyleDeclaration>
) => {
    useEffect(() => {
        if (!sizerRef.current || !textAreaRef || !textAreaRef.current || !textAreaRef.current.resizableTextArea || !textStyleRef || !textStyleRef.current)
            return;
        copyStyles(textStyleRef.current, textAreaRef.current.resizableTextArea.textArea.style);
        copyStyles(textStyleRef.current, sizerRef.current.style);
        if (placeholderSizerRef.current) copyStyles(textStyleRef.current, placeholderSizerRef.current.style);
    }, [textAreaRef, textStyleRef, sizerRef, placeholderSizerRef]);
};

const useCalculateSize = (
    sizerRef: React.RefObject<HTMLDivElement>,
    placeholderSizerRef: React.RefObject<HTMLDivElement>,
    value: string,
    inputBoundsStyle: IInputBoundsStyle,
    extraHeight: number | undefined,
    extraWidth: number | undefined
): [number, number] => {
    const [inputWidth, setInputWidth] = useState(0);
    const [inputHeight, setInputHeight] = useState(0);
    useEffect(() => {
        if (!sizerRef.current) return;
        const paddingHeight =
            inputBoundsStyle.paddingTop +
            inputBoundsStyle.paddingBottom +
            inputBoundsStyle.borderTopWidth +
            inputBoundsStyle.borderBottomWidth +
            (extraHeight || 0);
        const paddingWidth =
            inputBoundsStyle.paddingLeft +
            inputBoundsStyle.paddingRight +
            inputBoundsStyle.borderLeftWidth +
            inputBoundsStyle.borderRightWidth +
            (extraWidth || 0);
        const sizerStyles = window.getComputedStyle(sizerRef.current, null);
        const sizerHeight = parseInt(sizerStyles.height, 10);
        const sizerWidth = parseInt(sizerStyles.width, 10);
        let placeholderSizerHeight = 0;
        let placeholderSizerWidth = 0;

        if (placeholderSizerRef.current) {
            const placeholderSizerStyles = window.getComputedStyle(placeholderSizerRef.current, null);
            placeholderSizerHeight = parseInt(placeholderSizerStyles.height, 10);
            placeholderSizerWidth = parseInt(placeholderSizerStyles.width, 10);
        }

        setInputHeight(Math.max(sizerHeight, placeholderSizerHeight) + paddingHeight);
        setInputWidth(Math.max(sizerWidth, placeholderSizerWidth) + paddingWidth);
    }, [sizerRef, placeholderSizerRef, value, inputBoundsStyle, extraHeight, extraWidth]);

    return [inputHeight, inputWidth];
};

const usePrepareInputStyles = (style: CSSProperties | undefined, inputHeight: number, inputWidth: number) => {
    return useMemo(() => {
        return mergeObjects(style || {}, {height: inputHeight, width: inputWidth, transition: 'none', overflow: 'hidden', resize: 'none'});
    }, [style, inputWidth, inputHeight]);
};

export const copyStyles = (sourceStyles: CSSStyleDeclaration, destinationStyles: CSSStyleDeclaration) => {
    destinationStyles.fontSize = sourceStyles.fontSize;
    destinationStyles.fontFamily = sourceStyles.fontFamily;
    destinationStyles.fontWeight = sourceStyles.fontWeight;
    destinationStyles.fontStyle = sourceStyles.fontStyle;
    destinationStyles.letterSpacing = sourceStyles.letterSpacing;
    destinationStyles.textTransform = sourceStyles.textTransform;
    destinationStyles.lineHeight = sourceStyles.lineHeight;
};
