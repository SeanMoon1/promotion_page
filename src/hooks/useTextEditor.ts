import { useState, useCallback, useMemo } from 'react';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  textAlign: string;
  fontStyle: string;
  lineHeight?: number;
  letterSpacing?: number;
  textDecoration?: string;
}

export interface TextEditorOptions {
  initialStyle?: Partial<TextStyle>;
  onStyleChange?: (style: TextStyle) => void;
  onApply?: (style: TextStyle) => void;
}

export const useTextEditor = (options: TextEditorOptions = {}) => {
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    backgroundColor: 'transparent',
    textAlign: 'left',
    fontStyle: 'normal',
    lineHeight: 1.5,
    letterSpacing: 0,
    textDecoration: 'none',
    ...options.initialStyle
  });

  const fontOptions = useMemo(() => [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Merriweather', label: 'Merriweather' },
    { value: 'Noto Sans KR', label: 'Noto Sans KR' },
    { value: 'Nanum Gothic', label: 'Nanum Gothic' }
  ], []);

  const fontWeightOptions = useMemo(() => [
    { value: 'normal', label: '보통' },
    { value: 'bold', label: '굵게' },
    { value: '100', label: '매우 얇게' },
    { value: '300', label: '얇게' },
    { value: '500', label: '중간' },
    { value: '700', label: '굵게' },
    { value: '900', label: '매우 굵게' }
  ], []);

  const textAlignOptions = useMemo(() => [
    { value: 'left', label: '왼쪽' },
    { value: 'center', label: '가운데' },
    { value: 'right', label: '오른쪽' },
    { value: 'justify', label: '양쪽' }
  ], []);

  const updateStyle = useCallback((property: keyof TextStyle, value: string | number) => {
    setTextStyle(prev => {
      const newStyle = { ...prev, [property]: value };
      options.onStyleChange?.(newStyle);
      return newStyle;
    });
  }, [options.onStyleChange]);

  const applyStyle = useCallback(() => {
    options.onApply?.(textStyle);
  }, [textStyle, options.onApply]);

  const getStyleString = useCallback(() => {
    return `
      font-family: ${textStyle.fontFamily}, sans-serif;
      font-size: ${textStyle.fontSize}px;
      font-weight: ${textStyle.fontWeight};
      color: ${textStyle.color};
      background-color: ${textStyle.backgroundColor};
      text-align: ${textStyle.textAlign};
      font-style: ${textStyle.fontStyle};
      line-height: ${textStyle.lineHeight};
      letter-spacing: ${textStyle.letterSpacing}px;
      text-decoration: ${textStyle.textDecoration};
    `;
  }, [textStyle]);

  const getInlineStyle = useCallback(() => ({
    fontFamily: `${textStyle.fontFamily}, sans-serif`,
    fontSize: `${textStyle.fontSize}px`,
    fontWeight: textStyle.fontWeight,
    color: textStyle.color,
    backgroundColor: textStyle.backgroundColor,
    textAlign: textStyle.textAlign as any,
    fontStyle: textStyle.fontStyle,
    lineHeight: textStyle.lineHeight,
    letterSpacing: `${textStyle.letterSpacing}px`,
    textDecoration: textStyle.textDecoration,
    padding: textStyle.backgroundColor !== 'transparent' ? '1rem' : '0',
    borderRadius: textStyle.backgroundColor !== 'transparent' ? '0.5rem' : '0'
  }), [textStyle]);

  return {
    textStyle,
    fontOptions,
    fontWeightOptions,
    textAlignOptions,
    updateStyle,
    applyStyle,
    getStyleString,
    getInlineStyle
  };
}; 