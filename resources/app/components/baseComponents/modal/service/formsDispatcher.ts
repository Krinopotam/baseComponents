/**
 * @FormsDispatcher
 * @description The form dispatcher stores information about open forms and their order
 * @version 0.0.28.35
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

export class FormsDispatcher {
    private static _instance: FormsDispatcher; //singleton instance
    private readonly _formsStack: string[];
    private _activeFormId: string;

    constructor() {
        this._formsStack = [];
        this._activeFormId = '';
    }

    /** singleton implementation  */
    public static get Instance() {
        return this._instance || (this._instance = new this()); // Do you need arguments? Make it a regular static method instead.
    }

    pushToStack(id: string) {
        if (this._activeFormId === id) return;
        this._formsStack.push(id);
        this._activeFormId = id;
    }

    removeFromStack(id: string) {
        const index = this._formsStack.indexOf(id);
        if (index > -1) {
            this._formsStack.splice(index, 1);
        }

        this._activeFormId = this._formsStack.length ? this._formsStack[this._formsStack.length - 1] : '';
    }

    getActive() {
        return this._activeFormId;
    }

    isActive(id: string) {
        return this._activeFormId === id;
    }
}

const dispatcher = FormsDispatcher.Instance;
export default dispatcher;
