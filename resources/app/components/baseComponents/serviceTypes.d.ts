
/** Type for promise with typed Resolve and Reject. F.e. TPromise<{data: Record<string, unknown>}, {message: string; code: number}>; */
export type TPromise<T, F = unknown> = {
    catch<TResult = never>(onrejected?: ((reason: F) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
} & Promise<T>;
