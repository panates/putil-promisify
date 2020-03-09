export as namespace promisify;

export = promisify;

declare function promisify(fn: () => any);

declare namespace promisify {

    export function fromCallback(cb: (error, value) => void);

    export function isPromise(x: any): boolean;

    export function deepResolve<T = any>(o: T): Promise<T>;
    
}
