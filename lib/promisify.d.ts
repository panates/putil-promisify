export as namespace promisify;

export = promisify;

declare function promisify<T = any>(fn: () => any): Promise<T>;

declare type Callback<T> = (error?: Error, value?: T) => void;

declare namespace promisify {

    export function fromCallback<T = any>(cb: (error, value: T) => void): Promise<T>;

    export function isPromise(x: any): boolean;

    export function deepResolve<T = any>(o: T): Promise<T>;

    export function await<T = any>(x: any, callback?: Callback<T>): Promise<void> | void;

    export function wait(ms): Promise<void>;

}
