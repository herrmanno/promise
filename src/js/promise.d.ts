declare module ho.promise {
    class Promise<T, E> {
        constructor(func?: (resolve, reject) => any);
        private data;
        private onResolve;
        private onReject;
        resolved: boolean;
        rejected: boolean;
        done: boolean;
        private ret;
        private set(data?);
        resolve(data?: T): void;
        private _resolve();
        reject(data?: E): void;
        private _reject();
        then(res: (arg1: T) => any, rej?: (arg1: E) => any): Promise<T, E>;
        catch(cb: (arg1: E) => any): void;
        static all(arr: Array<Promise<any, any>>): Promise<any, any>;
        static chain(arr: Array<Promise<any, any>>): Promise<any, any>;
        static create(obj: any): Promise<any, any>;
    }
}
