import { TimeoutError } from './timeout-error';

function timeoutPromise<T>({
    promise,
    timeout,
    errorMessage,
    abortController,
}: {
    promise: Promise<T>;
    timeout: number;
    errorMessage?: string;
    abortController?: AbortController;
}): Promise<T> {
    let timer: NodeJS.Timeout;

    return Promise.race([
        new Promise((_, reject) => {
            timer = setTimeout(() => {
                abortController && abortController.abort();
                reject(new TimeoutError(errorMessage ?? 'Timeout in timeoutPromise fn'));
            }, timeout);
            return timer;
        }),
        promise.then((value: T) => {
            clearTimeout(timer);
            return value;
        }),
    ]) as Promise<T>;
}

export { timeoutPromise };
