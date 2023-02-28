import hash from 'object-hash';
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';

/** Check if parameter is array */
export function isArray(val: unknown): boolean {
    return val instanceof Array;
}

/** Check if parameter is promise */
export function isPromise(val: unknown): boolean {
    return !!val && Object.prototype.toString.call(val) === '[object Promise]';
}

/** Returns object's keys list as string array */
export function objectKeys(val: unknown): string[] | undefined {
    if (!val || typeof val !== 'object') return undefined;
    return Object.keys(val);
}

/**  Returns object's keys count */
export function objectKeysLength(val: unknown): number {
    const keys = objectKeys(val);
    return keys ? keys.length : 0;
}

/** Search index in objects array with specified object property */
export function findIndexInObjectsArray(objArray: Record<string, unknown>[], objProperty: string, searchVal: unknown): number {
    if (!isArray(objArray)) return -1;

    for (let i = 0; i < objArray.length; i++) {
        if (objArray[i][objProperty] === searchVal) return i;
    }

    return -1;
}

/** Search value in objects array by object property */
export function findObjectInArray(objArray: Record<string, unknown>[], objProperty: string, searchVal: unknown): Record<string, unknown> | undefined {
    if (!isArray(objArray)) return undefined;

    for (const item of objArray) {
        if (item[objProperty] === searchVal) return item;
    }

    return undefined;
}

/** Deep compare objects */
export function isObjectsEqual<TObject, TSource>(obj1: TObject, obj2: TSource): boolean {
    return isEqual(obj1, obj2);
}

/** Deep merge objects */
export function mergeObjects<TObject, TSource>(object: TObject, source: TSource): TObject & TSource {
    return merge(object, source);
}

/** Deep clone  objects */
export function cloneObject<TObject>(object: TObject, maxLevel?: number): TObject {
    if (typeof object !== 'object') return object;

    const objRecursion = (obj: Record<string, unknown> | null, level: number, cloneMaxLevel: number) => {
        if (!obj) return obj;
        const clonedObj: Record<string, unknown> = {};
        level++;
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
            const item = obj[key];
            if (typeof item !== 'object' || level >= cloneMaxLevel) clonedObj[key] = item;
            else
                clonedObj[key] = !isArray(item)
                    ? objRecursion(item as Record<string, unknown>, level, cloneMaxLevel)
                    : arraysRecursion(item as unknown[], level, cloneMaxLevel);
        }

        return clonedObj;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arraysRecursion = (arr: any, level: number, cloneMaxLevel: number) => {
        if (!arr) return arr;
        const clonedArr: unknown[] = [];
        level++;
        for (let i = 0; i < (arr as unknown[]).length; i++) {
            const item = arr[i];
            if (typeof item !== 'object' || level >= cloneMaxLevel) clonedArr[i] = item;
            else
                clonedArr[i] = !isArray(item)
                    ? objRecursion(item as Record<string, unknown>, level, cloneMaxLevel)
                    : arraysRecursion(item as unknown[], level, cloneMaxLevel);
        }

        return clonedArr;
    };

    return !isArray(object)
        ? (objRecursion(object as Record<string, unknown>, 0, maxLevel ?? 0) as TObject)
        : (arraysRecursion(object, 0, maxLevel ?? 0) as TObject);

    //return cloneDeep( object);
}

/** Get object content hash */
export function hashObjectContent(obj: Record<string, unknown> | null, options?: hash.NormalOption): string {
    return hash(obj, options);
}

/** Is object has own property */
export function isObjectHasOwnProperty(obj: Record<string, unknown>, propName: string) {
    return Object.prototype.hasOwnProperty.call(obj, propName);
}

/**
 * Splits the object and return two objects.
 * The first object contains only the properties that are in the propNames list
 *  The second object contains only the properties that are not in the propNames list
 * @param obj
 * @param propNames
 * @returns
 */
export function splitObject<TObject>(obj: TObject, propNames: (keyof TObject)[]): [TObject, TObject] {
    const obj1: TObject = {} as TObject;
    const obj2: TObject = {} as TObject;
    const propsObj: Record<string | symbol | number, boolean> = {};

    const keysLength = propNames.length;
    for (let i = 0; i < keysLength; i++) propsObj[propNames[i]] = true;

    for (const key in obj) {
        if (isObjectHasOwnProperty(propsObj, key)) obj1[key] = obj[key];
        else obj2[key] = obj[key];
    }

    return [obj1, obj2];
}
