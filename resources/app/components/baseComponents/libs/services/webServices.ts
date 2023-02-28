import axios, {AxiosError, AxiosResponse} from 'axios';
import {cloneObject, hashObjectContent} from 'helpers/helpersObjects';

import {CancelController} from './cancelController';
import {getUuid} from 'helpers/helpersString';

//region Types
export interface IFetchError {
    /** Result code (for example:200, 404, 401, etc)) */
    code: number;

    /** Error message*/
    message: string;
}

export interface IFetchResult extends IFetchError {
    /** Is fetch has no errors  */
    result: 'success' | 'cache' | 'error' | 'canceled';
    /** Axios response object*/
    data?: AxiosResponse['data'];
    /** Fetch callback */
    callbacks?: IFetchCallbacks;
}

export interface IFetchCallbacks {
    /** Callback, called on fetch success*/
    onSuccess?: (data: AxiosResponse['data'] | undefined) => void;
    /** Callback, called on fetch error*/
    onError?: (error: IFetchError) => void;
    /** Callback, called when fetch abort */
    onAbort?: () => void;
    /** Callback called when the fetch completes, regardless of the result */
    onComplete?: () => void;
}

export interface IFetchProps {
    /** Fetch Id for cache (used for the opportunity to partially flush cache ) and for fetch canceling */
    fetchId?: string;
    /** Request url*/
    url: string;
    /** request method */
    method: 'get' | 'post';
    /** Request parameters */
    parameters?: Record<string, unknown>;
    /** Fetch callback */
    callbacks?: IFetchCallbacks;
    /** Batch request mode: not fires onSuccess/onError callbacks after fetch and return promise for additional batch processing */
    batchMode?: boolean;
    /** Cache time to live in minutes */
    cacheTtl?: number;
    /** Force fetch not using cache */
    forceFetch?: boolean;
    /** CancelController to cancel request */
    cancelController?: CancelController;
}

interface IRequestCache {
    /** Cache time to live in minutes (undefined - unlimited) */
    ttl?: number;
    /** request parameters */
    parameters: Record<string, unknown> | undefined;
    /** Response data */
    data: AxiosResponse['data'];
}

//endregion

export class WebServices {
    protected _cacheTtl: number | undefined;
    private _cache: Record<string, Record<string, IRequestCache>>;
    private readonly _lastFetches: Record<string, {fetchPromise: Promise<IFetchResult>; cancelController: CancelController}>;
    private _lastFetchId: string;

    constructor() {
        this._cache = {};
        this._lastFetches = {};
        this._lastFetchId = '';
        this._cacheTtl = undefined; // 20; //20 min, undefined - unlimited
    }

    get lastFetchId() {
        return this._lastFetchId;
    }

    //region Cache methods
    public clearCache(cacheId?: string, parametersHash?: string) {
        if (!cacheId) {
            //clear all cache
            this._cache = {};
            return;
        }

        if (!parametersHash) {
            //clear all cache for exact URL
            delete this._cache[cacheId];
            return;
        }

        const cacheForId = this._cache[cacheId];
        if (cacheForId) delete cacheForId[parametersHash];
    }

    // noinspection JSUnusedGlobalSymbols
    public clearExpiredCache(cacheId?: string) {
        const allCache = !cacheId ? this._cache : {cacheId: this._cache[cacheId]};
        for (const id in allCache) {
            const cacheForId = allCache[id];
            for (const hash in cacheForId) {
                const cache = cacheForId[hash];
                if (typeof cache.ttl !== 'undefined' && cache.ttl <= Date.now()) delete cacheForId[hash];
            }
        }
    }

    private putInCache<T1 extends string, T2 extends Record<string, unknown>>(
        cacheId: T1,
        parameters: T2 | undefined,
        data: AxiosResponse['data'] | undefined,
        ttl?: number
    ) {
        const cacheHash = hashObjectContent(parameters || {});
        this.clearCache(cacheId, cacheHash);

        if (ttl === 0) return;

        let cacheTtl: number | undefined;
        if (typeof ttl !== 'undefined') cacheTtl = Date.now() + ttl * 1000 * 60;
        else if (typeof this._cacheTtl !== 'undefined') cacheTtl = Date.now() + this._cacheTtl * 1000 * 60;
        else cacheTtl = undefined;

        if (!this._cache[cacheId]) this._cache[cacheId] = {};
        this._cache[cacheId][cacheHash] = {ttl: cacheTtl, parameters: parameters || {}, data: data};
    }

    private getFromCache<T1 extends string, T2 extends Record<string, unknown>>(cacheId: T1, parameters: T2 | undefined): AxiosResponse['data'] | undefined {
        const cacheHash = hashObjectContent(parameters || {});

        const cacheForId = this._cache[cacheId];
        if (!cacheForId) return undefined;

        const cache = cacheForId[cacheHash];
        if (!cache) return undefined;
        if (typeof cache.ttl === 'undefined' || cache.ttl >= Date.now()) return cache.data; //cache is actual
        delete this._cache[cacheHash];
        return undefined; //cache is expired
    }

    //endregion

    public webFetchData(props: IFetchProps): Promise<IFetchResult> {
        const _props = cloneObject(props);
        const fetchId = _props.fetchId || getUuid();
        this._lastFetchId = fetchId;

        if (fetchId in this._lastFetches) {
            this._lastFetches[fetchId].cancelController.cancel();
            delete this._lastFetches[fetchId];
        }

        const cacheId = _props.fetchId || 'common';
        if (!_props.forceFetch) {
            const data = this.getFromCache(cacheId, _props.parameters);
            if (data) return Promise.resolve(this.onRequestSuccess(_props, data, 200, 'cache'));
        }

        const abortController = new AbortController();
        let cancelController: CancelController;
        if (!_props.cancelController) {
            cancelController = new CancelController((cancelRequest) => {
                if (cancelRequest) abortController.abort();
            });
        } else {
            cancelController = _props.cancelController;
            cancelController.appendOnCancelCallback((cancelRequest) => {
                if (cancelRequest) abortController.abort();
            });
        }
        _props.cancelController = cancelController;

        this._lastFetches[fetchId] = {
            fetchPromise: axios({
                url: _props.url,
                method: _props.method,
                data: _props.parameters,
                signal: abortController.signal,
            })
                .then((response) => this.onRequestSuccess(_props, response.data, response.status, response.statusText))
                .catch((error) => this.onRequestError(_props, error)),
            cancelController: cancelController,
        };

        return this._lastFetches[fetchId].fetchPromise;
    }

    private onRequestSuccess(
        {parameters, callbacks, batchMode, cacheTtl, fetchId, cancelController}: IFetchProps,
        data: AxiosResponse['data'],
        status: AxiosResponse['status'],
        statusText: AxiosResponse['statusText']
    ): IFetchResult {
        callbacks = callbacks || {};

        const cacheId = fetchId || 'common';
        const parametersHash = hashObjectContent(parameters || {});

        if (cancelController?.isCanceled) {
            if (status === 200 && cacheTtl !== 0) this.putInCache(cacheId, parameters, data, cacheTtl);
            if (!batchMode) {
                callbacks?.onAbort?.();
                callbacks?.onComplete?.();
            }
            return {result: 'canceled', code: 0, message: 'canceled', callbacks: callbacks};
        }

        if (status === 200) {
            if (cacheTtl !== 0) this.putInCache(cacheId, parameters, data, cacheTtl);

            if (!batchMode) {
                callbacks?.onSuccess?.(data);
                callbacks?.onComplete?.();
            }
            return {result: 'success', code: 200, message: '', data: data, callbacks: callbacks};
        }

        this.clearCache(cacheId, parametersHash);
        if (!batchMode) {
            callbacks?.onError?.({code: status, message: statusText});
            callbacks?.onComplete?.();
        }
        console.log(statusText);

        return {result: 'error', code: status, message: statusText, callbacks: callbacks};
    }

    private onRequestError({parameters, callbacks, batchMode, fetchId, cancelController}: IFetchProps, error: AxiosError): IFetchResult {
        callbacks = callbacks || {};

        const parametersHash = hashObjectContent(parameters || {});
        const cacheId = fetchId || 'common';
        this.clearCache(cacheId, parametersHash);

        let errorCode = error.code ? +error.code : 400;
        let errorMessage = error.message || 'Неизвестная ошибка';
        if (error.response) {
            errorCode = error.response.status;
            errorMessage = error.response.statusText;
        }

        if (cancelController?.isCanceled) {
            if (!batchMode) {
                callbacks?.onAbort?.();
                callbacks?.onComplete?.();
            }
            return {result: 'canceled', code: 0, message: 'canceled', callbacks: callbacks};
        }

        if (!batchMode) {
            callbacks?.onError?.({code: errorCode, message: errorMessage});
            callbacks?.onComplete?.();
        }

        return {result: 'error', code: errorCode, message: errorMessage, callbacks: callbacks};
    }

    /**
     * Executes all asynchronous requests synchronously
     * After all asynchronous requests are completed causes a simultaneous update of the data
     */
    public webBatchFetchSync({
        promises,
        onAllSuccess,
        onHasErrors,
        onComplete,
    }: {
        promises: (Promise<IFetchResult | null> | undefined)[];
        onAllSuccess?: () => void;
        onHasErrors?: (errors: IFetchError[]) => void;
        onComplete?: () => void;
    }) {
        if (!promises || promises.length === 0) {
            onComplete?.();
            return;
        }

        Promise.all(promises).then((fetchResults) => {
            const errors: IFetchError[] = [];
            for (const fetchResult of fetchResults) {
                if (!fetchResult) continue;
                if (fetchResult.result === 'error') {
                    errors.push({code: fetchResult.code, message: fetchResult.message});
                    fetchResult.callbacks?.onError?.({code: fetchResult.code, message: fetchResult.message});
                }

                if (fetchResult.result === 'success' || fetchResult.result === 'cache') fetchResult.callbacks?.onSuccess?.(fetchResult.data);
                if (fetchResult.result === 'canceled') fetchResult.callbacks?.onAbort?.();
                fetchResult.callbacks?.onComplete?.();
            }

            if (errors.length > 0) onHasErrors?.(errors);
            else onAllSuccess?.();

            onComplete?.();
        });
    }

    cancelFetch(fetchId: string, cancelRequest?: boolean) {
        if (!this._lastFetches) return;
        if (this._lastFetches[fetchId]) this._lastFetches[fetchId].cancelController.cancel(cancelRequest);
    }

    cancelAllFetches(cancelRequest?: boolean) {
        if (!this._lastFetches) return;
        for (const key in this._lastFetches) {
            const request = this._lastFetches[key];
            request.cancelController.cancel(cancelRequest);
        }
    }
}
