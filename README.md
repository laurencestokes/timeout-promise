<div align="center">
    <h1>⚡ Timeout Promise </h1>
</div>

<br/>
<p align="center">
    <img src="readme-gif.gif" alt="The flash gif">
</p>

<br />

## 🚀 How to use

<hr />

You can race single promises, promise.all, promise.allSettled with the utility. You can combine it with promise.allSettled
if you don't want to reject the promise.allSettled array of promises but be aware the failure was a timeout in the given promise in the future
array of promises. Some examples are presented below:

### Typing the returned promise using Typescript generics

```ts
const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 3000)) as Promise<string>;
await timeoutPromise<number>({ promise, timeout: 2000, message: 'foo' })); // compile time error (Promise<number> cannot be assigned to type Promise<string>)
```

### Single Promise

```ts
const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 3000));
await timeoutPromise({ promise, timeout: 2000, message: 'foo' })); // rejects with 'foo'

const promise = new Promise((resolve) => setTimeout(() => resolve('resolved'), 3000));
await timeoutPromise({ promise, timeout: 10000, message: 'foo' })); // resolves with 'resolved'
```

### Promise.all

```ts
const promises = [1, 2, 3].map(
    (value) => new Promise((resolve) => setTimeout(() => resolve(Math.pow(value, 2)), value))
);
const promiseAll = Promise.all(promises);
await timeoutPromise({
    promise: promiseAll,
    timeout: 2500,
    errorMessage: 'test error',
}); // [1,4,9]

// Note, you could also achieve this by simply having one of the promises in the promise.all array of promises
// be a setTimeout that rejects after the desired gestation, but this is arguably an easier to read solution.
const promises = [1, 2, 3].map(
    (value) => new Promise((resolve) => setTimeout(() => resolve(Math.pow(value, 2)), value * 1000))
);
const promiseAll = Promise.all(promises);
await timeoutPromise({
    promise: promiseAll,
    timeout: 2500,
    errorMessage: 'test error',
}); // rejects 'test error'
```

### Promise.allSettled

```ts
const promises = [1, 2, 3].map(
    (value) => new Promise((resolve) => setTimeout(() => resolve('resolved'), value * 1000))
);
const promiseAllSettled = Promise.allSettled(promises);
await timeoutPromise({
    promise: promiseAllSettled,
    timeout: 2500,
    errorMessage: 'test error',
}); // rejects 'test error'

const promises = [1, 2, 3].map(
    (value) => new Promise((resolve) => setTimeout(() => resolve(Math.pow(value, 2)), value))
);
const promiseAllSettled = Promise.allSettled(promises);
const foo = await timeoutPromise({
    promise: promiseAllSettled,
    timeout: 2500,
    errorMessage: 'test error',
});

// foo =
// [
//     {
//         status: 'fulfilled',
//         value: 1,
//     },
//     {
//         status: 'fulfilled',
//         value: 4,
//     },
//     {
//         status: 'fulfilled',
//         value: 9,
//     },
// ];
```

### Combining timeoutPromise with Promise.allSettled

```ts
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

const foo = await promiseAllSettledWithTimeout;

// foo =
// [
//     {
//         status: 'fulfilled',
//         value: 1,
//     },
//     {
//         status: 'fulfilled',
//         value: 4,
//     },
//     {
//         status: 'rejected',
//         reason: new Error('rejected!'),
//     },
//     {
//         status: 'rejected',
//         reason: new Error('Timeout in timeoutPromise fn'),
//     },
//     {
//         status: 'fulfilled',
//         value: 25,
//     },
// ];
```

<br />

## 📝 Contributing Code

<hr />

### How to contribute summary

-   Create a branch from the `develop` branch and submit a Pull Request (PR)
    -   Explain what the PR fixes or improves
-   Use sensible commit messages which follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification.
-   Use a sensible number of commit messages

### Version Bumping

Our versioning uses [SemVer](https://semver.org/) and our commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/about/) specification.

1. Make changes
2. Commit those changes
3. Pull all the tags
4. Run `npm version [patch|minor|major]`
5. Stage the `CHANGELOG.md`, `package-lock.json` and `package.json` changes
6. Commit those changes with `git commit -m "chore(): bumped version to $version"`
7. Push your changes with `git push` and push the tag with `git push origin $tagname` where `$tagname` will be `v$version` e.g. `v1.0.4`

<br />

## ✅ Testing

<hr />

![Coverage lines](./badges/badge-lines.svg)
![Coverage functions](./badges/badge-functions.svg)
![Coverage branches](./badges/badge-branches.svg)
![Coverage statements](./badges/badge-statements.svg)

1. Clone the repository

2. Install dependencies: `npm ci`

3. Test: `npm test`

<br />

## 📘 Changelog

<hr />

See [CHANGELOG.md](CHANGELOG.md)

<br />
