/**
 * @BaseValidator
 * @version 0.0.28.14
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import dayjs from 'dayjs';

//region Types
export interface IRuleString {
    type: 'string';
    rule: 'not-empty' | 'max-length' | 'min-length' | '=' | '!=' | 'is-email' | 'is-email-or-empty' | 'is-uuid' | 'is-uuid-or-empty';
    parameter?: ((value: unknown) => unknown) | unknown;
    message: string;
}

export interface IRuleNumber {
    type: 'number';
    rule: 'not-empty' | 'number-or-empty' | '=' | '!=' | '>' | '>=' | '<' | '<=';
    parameter?: ((value: unknown) => unknown) | unknown;
    message: string;
}

export interface IRuleFile {
    type: 'file';
    rule: 'not-empty' | 'extension';
    parameter?: ((value: unknown) => unknown) | unknown;
    message: string;
}

export interface IRuleDate {
    type: 'date';
    rule: 'not-empty' | 'date-or-empty' | '=' | '!=' | '>' | '>=' | '<' | '<=';
    parameter?: ((value: unknown) => unknown) | unknown;
    message: string;
}

export interface IRuleObject {
    type: 'object';
    rule: 'not-empty' | 'null' | '=' | '!=' | 'contains' | 'not-contains';
    parameter?: ((value: unknown) => unknown) | unknown;
    message: string;
}

export interface IRuleCustom {
    type: 'custom';
    callback: (value: unknown, allValues: Record<string, unknown> | undefined) => string;
}

export type IRuleType = IRuleString | IRuleNumber | IRuleDate | IRuleFile | IRuleObject | IRuleCustom;
//endregion
export class BaseValidator {
    public validate(values: Record<string, unknown>, validationRules?: Record<string, IRuleType[]>, hidden?: Record<string, boolean>): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!values || !validationRules) return errors;

        for (const name in validationRules) {
            if (hidden && hidden[name]) continue;
            const val = values[name] ? values[name] : null;
            const errorMsg = this.validateValue(val, validationRules[name], values);
            if (errorMsg) errors[name] = errorMsg;
        }

        return errors;
    }

    public validateValue(value: unknown, validationRules?: IRuleType[], allValues?: Record<string, unknown>) {
        if (!validationRules) return '';
        
        for (const rule of validationRules) {
            if (rule.type === 'string') {
                if (value && typeof value === 'object') return 'Неподходящий тип данных';
                if (!this.validateString(<string>value, rule)) return rule.message;
            } else if (rule.type === 'file') {
                if (value && typeof value === 'object') return 'Неподходящий тип данных';
                if (!this.validateFile(<string>value, rule)) return rule.message;
            } else if (rule.type === 'number') {
                if (value && typeof value === 'object') return 'Неподходящий тип данных';
                if (!this.validateNumber(<string>value, rule)) return rule.message;
            } else if (rule.type === 'date') {
                if (!this.validateDate(<string>value, rule)) return rule.message;
            } else if (rule.type === 'object') {
                if (typeof value !== 'object') return 'Неподходящий тип данных';
                if (!this.validateRowObject(<{id: string} | [{id: string}]>value, rule)) return rule.message;
            } else if (rule.type === 'custom') {
                if (typeof rule.callback === 'function') return rule.callback(value, allValues);
            }
        }

        return '';
    }

    private validateString(val: string | null, rule: IRuleString) {
        const ruleParameter = typeof rule.parameter === 'function' ? rule.parameter(val) : rule.parameter;
        val = val || '';

        if (val) {
            if (rule.rule === 'not-empty') return val.length > 0;
            if (rule.rule === 'max-length') return val.length <= ruleParameter;
            if (rule.rule === 'min-length') return val.length >= ruleParameter;
            if (rule.rule === '=') return val.length === ruleParameter;
            if (rule.rule === '!=') return val.length !== ruleParameter;
            if (rule.rule === 'is-uuid' || rule.rule === 'is-uuid-or-empty')
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
            if (rule.rule === 'is-email' || rule.rule === 'is-email-or-empty')
                return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(val);
        } else {
            if (rule.rule === 'not-empty') return false;
            if (rule.rule === 'max-length') return true;
            if (rule.rule === 'min-length') return !ruleParameter;
            if (rule.rule === '=') return !ruleParameter;
            if (rule.rule === '!=') return !!ruleParameter;
            if (rule.rule === 'is-uuid') return false;
            if (rule.rule === 'is-uuid-or-empty') return true;
            if (rule.rule === 'is-email') return false;
            if (rule.rule === 'is-email-or-empty') return true;
        }
        return false;
    }

    private validateFile(val: string | null, rule: IRuleFile) {
        const ruleParameter = typeof rule.parameter === 'function' ? rule.parameter(val) : rule.parameter;
        if (val) {
            if (rule.rule === 'not-empty') return val.length > 0;
            if (rule.rule === 'extension') {
                const fileExt = val.substring(val.lastIndexOf('.'));
                return ruleParameter.indexOf(fileExt) >= 0;
            }
        } else {
            if (rule.rule === 'not-empty') return false;
            if (rule.rule === 'extension') return false;
        }
        return false;
    }

    private validateNumber(val: string | null, rule: IRuleNumber) {
        if (!val) {
            val = '';
            if (rule.rule !== 'not-empty') return true;
        }

        if (rule.rule === 'not-empty') return this.isNumeric(val);
        if (rule.rule === 'number-or-empty') return !val || this.isNumeric(val);

        const ruleParameter = typeof rule.parameter === 'function' ? rule.parameter(val) : rule.parameter;

        const valNum: number = +val; //конвертация в числовой вид
        const paramNum: number = +ruleParameter;

        if (isNaN(valNum) || isNaN(paramNum)) return false;

        if (rule.rule === '=') return (!val && !ruleParameter) || valNum === paramNum;
        if (rule.rule === '!=') return valNum !== paramNum;
        if (rule.rule === '>') return valNum > paramNum;
        if (rule.rule === '>=') return valNum >= paramNum;
        if (rule.rule === '<') return valNum < paramNum;
        if (rule.rule === '<=') return valNum <= paramNum;
        return false;
    }

    private validateDate(val: string | null, rule: IRuleDate) {
        if (!val) {
            val = '';
            if (rule.rule !== 'not-empty') return true;
        }

        const valDate = dayjs(val, 'DD.MM.YYYY');
        const ruleParameter = typeof rule.parameter === 'function' ? rule.parameter(val) : rule.parameter;
        const parameterDate = dayjs(ruleParameter, 'DD.MM.YYYY');
        if (rule.rule === 'date-or-empty') return !val || (valDate.isValid() && val.length <= 10);
        if (rule.rule === 'not-empty') return valDate.isValid() && val.length <= 10;

        if (!valDate.isValid() || !parameterDate.isValid() || val.length > 10) return false;
        if (rule.rule === '=') return valDate === parameterDate;
        if (rule.rule === '!=') return valDate !== parameterDate;
        if (rule.rule === '>') return valDate > parameterDate;
        if (rule.rule === '>=') return valDate >= parameterDate;
        if (rule.rule === '<') return valDate < parameterDate;
        if (rule.rule === '<=') return valDate <= parameterDate;
        return false;
    }

    private validateRowObject(val: {id: string} | [{id: string}], rule: IRuleObject) {
        if (rule.rule === 'null') return val === null || typeof val === undefined;
        if (!val) return false;

        const ruleParameter = typeof rule.parameter === 'function' ? rule.parameter(val) : rule.parameter;

        if (rule.rule === 'not-empty') {
            if (val instanceof Array) {
                if (val.length > 0) return !!val[0]?.id;
                else return false;
            } else return !!val?.id;
        }

        if (rule.rule === '=') {
            if (val instanceof Array) {
                if (val.length > 0) return val[0].id === ruleParameter;
            } else return val.id === ruleParameter;
        }

        if (rule.rule === '!=') {
            if (val instanceof Array) {
                if (val.length > 0) return val[0].id !== ruleParameter;
            } else return val.id !== ruleParameter;
        }

        if (rule.rule === 'contains') {
            if (val instanceof Array) {
                return val.filter(function (item) {
                    return item.id === ruleParameter;
                });
            } else return val.id === ruleParameter;
        }

        if (rule.rule === 'not-contains') {
            if (val instanceof Array) {
                return !val.filter(function (item) {
                    return item.id === ruleParameter;
                });
            } else return val.id !== ruleParameter;
        }

        return false;
    }

    private isNumeric(val: string) {
        const parsedVal = parseFloat(val);
        return !isNaN(parsedVal) && isFinite(parsedVal);
    }
}
