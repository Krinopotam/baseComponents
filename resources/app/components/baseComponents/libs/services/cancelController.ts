export class CancelController {
    private _isCanceled: boolean;
    private _onCancelCallback: ((cancelRequest?: boolean) => void) | undefined;

    constructor(onCancelCallback?: (cancelRequest?: boolean) => void) {
        this._isCanceled = false;
        this._onCancelCallback = onCancelCallback;
    }

    get isCanceled() {
        return this._isCanceled;
    }
    cancel(cancelRequest?: boolean) {
        this._isCanceled = true;
        this._onCancelCallback?.(cancelRequest);
    }

    appendOnCancelCallback(onCancelCallback: (cancelRequest?: boolean) => void) {
        const prevCallback = this._onCancelCallback;
        this._onCancelCallback = (cancelFetch) => {
            prevCallback?.(cancelFetch);
            onCancelCallback?.(cancelFetch);
        };
    }
}
