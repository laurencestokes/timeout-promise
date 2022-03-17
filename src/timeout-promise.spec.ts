import { timeoutPromise } from './timeout-promise';

describe('Timeout promise utility', () => {
    describe('racing a single promise', () => {
        it('should succesfully invoke the (default) error if the promise being raced against does not resolve (or reject) within the timeout gestation', async () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 3000));
            await expect(timeoutPromise({ promise, timeout: 2000 })).rejects.toThrowError(
                'Timeout in timeoutPromise fn'
            );
        });

        it('should succesfully invoke the passed error if the promise being raced against does not resolve (or reject) within the timeout gestation', async () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 3000));
            await expect(
                timeoutPromise({
                    promise,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).rejects.toThrowError('test error');
        });

        it('should succesfully invoke the reject error from the promise being raced if it rejects within the timeout gestation', async () => {
            const promise = new Promise((_, reject) => setTimeout(() => reject(new Error('will be called!')), 1));
            await expect(
                timeoutPromise({
                    promise,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).rejects.toThrowError('will be called!');
        });

        it('should succesfully invoke the resolve from the promise being raced if it resolves within the timeout gestation', async () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve('lemon'), 1));
            await expect(
                timeoutPromise({
                    promise,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).resolves.toBe('lemon');
        });
    });

    describe('racing promise.all', () => {
        it('should succesfully invoke the (default) error if the promise.all being raced against does not resolve (or reject) within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) => new Promise((resolve) => setTimeout(() => resolve('resolved'), value * 1000))
            );
            const promiseAll = Promise.all(promises);
            await expect(timeoutPromise({ promise: promiseAll, timeout: 2500 })).rejects.toThrowError(
                'Timeout in timeoutPromise fn'
            );
        });

        it('should succesfully invoke the passed error if the promise.all being raced against does not resolve (or reject) within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) => new Promise((resolve) => setTimeout(() => resolve('resolved'), value * 1000))
            );
            const promiseAll = Promise.all(promises);
            await expect(
                timeoutPromise({
                    promise: promiseAll,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).rejects.toThrowError('test error');
        });

        it('should succesfully resolve if all the promise.all promises resolve within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) => new Promise((resolve) => setTimeout(() => resolve(Math.pow(value, 2)), value))
            );
            const promiseAll = Promise.all(promises);
            await expect(
                timeoutPromise({
                    promise: promiseAll,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).resolves.toStrictEqual([1, 4, 9]);
        });

        it('should succesfully reject if one the promise.all promises rejects within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) =>
                    new Promise((resolve, reject) =>
                        setTimeout(() => (value === 3 ? reject(new Error('rejected!!!!')) : resolve('resolved')), value)
                    )
            );
            const promiseAll = Promise.all(promises);
            await expect(
                timeoutPromise({
                    promise: promiseAll,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).rejects.toThrowError('rejected!!!!');
        });
    });

    describe('racing promise.allSettled', () => {
        it('should succesfully invoke the (default) error if the promise.allSettled being raced against does not resolve (or reject) within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) => new Promise((resolve) => setTimeout(() => resolve('resolved'), value * 1000))
            );
            const promiseAllSettled = Promise.allSettled(promises);
            await expect(timeoutPromise({ promise: promiseAllSettled, timeout: 2500 })).rejects.toThrowError(
                'Timeout in timeoutPromise fn'
            );
        });

        it('should succesfully invoke the passed error if the promise.allSettled being raced against does not resolve (or reject) within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) => new Promise((resolve) => setTimeout(() => resolve('resolved'), value * 1000))
            );
            const promiseAllSettled = Promise.allSettled(promises);
            await expect(
                timeoutPromise({
                    promise: promiseAllSettled,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).rejects.toThrowError('test error');
        });

        it('should succesfully resolve if the promise.allSettled being raced against resolves within the timeout gestation', async () => {
            const promises = [1, 2, 3].map(
                (value) => new Promise((resolve) => setTimeout(() => resolve(Math.pow(value, 2)), value))
            );
            const promiseAllSettled = Promise.allSettled(promises);

            const expectedResult = [
                {
                    status: 'fulfilled',
                    value: 1,
                },
                {
                    status: 'fulfilled',
                    value: 4,
                },
                {
                    status: 'fulfilled',
                    value: 9,
                },
            ];

            await expect(
                timeoutPromise({
                    promise: promiseAllSettled,
                    timeout: 2500,
                    errorMessage: 'test error',
                })
            ).resolves.toStrictEqual(expectedResult);
        });
    });

    describe('combining promised.allSettled with timeoutPromise utility', () => {
        it('should succesfully resolve (and reject!) if the promise.allSettled being raced against resolves within the timeout gestation', async () => {
            const promises = [1, 2, 3, 4, 5].map(
                (value) =>
                    new Promise((resolve, reject) =>
                        setTimeout(
                            () => (value === 3 ? reject(new Error('rejected!')) : resolve(Math.pow(value, 2))),
                            value === 4 ? 3000 : 1
                        )
                    )
            );

            const promisesWithIndividualTimers = promises.map((promise) => timeoutPromise({ promise, timeout: 2500 }));

            const promiseAllSettledWithTimeout = Promise.allSettled(promisesWithIndividualTimers);

            const expectedResult = [
                {
                    status: 'fulfilled',
                    value: 1,
                },
                {
                    status: 'fulfilled',
                    value: 4,
                },
                {
                    status: 'rejected',
                    reason: new Error('rejected!'),
                },
                {
                    status: 'rejected',
                    reason: new Error('Timeout in timeoutPromise fn'),
                },
                {
                    status: 'fulfilled',
                    value: 25,
                },
            ];

            await expect(promiseAllSettledWithTimeout).resolves.toStrictEqual(expectedResult);
        });
    });
});
