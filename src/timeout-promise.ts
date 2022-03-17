function timeoutPromise<T>({
    promise,
    timeout,
    errorMessage,
}: {
    promise: Promise<T>;
    timeout: number;
    errorMessage?: string;
}): Promise<T> {
    let timer: NodeJS.Timeout;

    return Promise.race([
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(errorMessage ?? 'Timeout in timeoutPromise fn')), timeout);
            return timer;
        }),
        promise.then((value: T) => {
            clearTimeout(timer);
            return value;
        }),
    ]) as Promise<T>;
}

export { timeoutPromise };
