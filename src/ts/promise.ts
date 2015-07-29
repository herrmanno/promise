module ho.promise {

    export class Promise<T, E> {

        constructor(func?: (resolve, reject) => any) {
            if (typeof func === 'function')
                func.call(
                    arguments.callee,
                    function(arg: T){
                        this.resolve(arg)
                    }.bind(this),
                    function(arg:E){
                        this.reject(arg);
                    }.bind(this)
                );
        }

        private data: T|E = undefined;
        private onResolve: (arg1:T) => any = undefined;
        private onReject: (arg1:E) => any = undefined;

        public resolved: boolean = false;
        public rejected: boolean = false;
        public done: boolean = false;

        private ret: Promise<T, E> = undefined;

        private set(data?: T|E): void {
            if (this.done)
                throw "Promise is already resolved / rejected";
            this.data = data;
        }

        public resolve(data?: T): void {
            this.set(data);
            this.resolved = this.done = true;
            if (typeof this.onResolve === 'function') {
                this._resolve();
            }
        }

        private _resolve(): void {
            if (this.ret === undefined) {
                this.ret = new Promise<T,E>();
            }

            var v: any = this.onResolve(<T>this.data);

            if (v && v instanceof Promise) {
                v.then(this.ret.resolve, this.ret.reject);
            }
            else {
                this.ret.resolve(v);
            }
        }

        public reject(data?: E): void {
            this.set(data);
            this.rejected = this.done = true;

            if (typeof this.onReject === 'function') {
                this.onReject(<E>this.data);
            }

            if (this.ret) {
                this.ret.reject(<E>this.data);
            }
        }

        private _reject(): void {
            if (this.ret === undefined) {
                this.ret = new Promise<T,E>();
            }

            this.onReject(<E>this.data);
            this.ret.reject(<E>this.data);
        }

        public then(res: (arg1:T)=>any, rej?: (arg1:E)=>any): Promise<T,E> {
            if (this.ret === undefined) {
                this.ret = new Promise<T,E>();
            }

            if (res && typeof res === 'function')
                this.onResolve = res;

            if (rej && typeof rej === 'function')
                this.onReject = rej;

            if (this.resolved) {
                this._resolve();
            }

            if (this.rejected) {
                this._reject();
            }

            return this.ret;
        }

        public catch(cb: (arg1:E)=>any): void {
            this.onReject = cb;

            if (this.rejected)
                this._reject();
        }

        static all(arr: Array<Promise<any, any>>): Promise<any, any> {
            var p = new Promise();

            var data = [];

            if (arr.length === 0) {
                p.resolve();
            } else {
                arr.forEach((prom, index) => {
                    prom
                        .then(function(d) {
                        if (p.done)
                            return;

                        data[index] = d;
                        var allResolved = arr.reduce(function(state, p1) {
                            return state && p1.resolved;
                        }, true);
                        if (allResolved) {
                            p.resolve(data);
                        }

                    })
                        .catch(function(err) {
                        p.reject(err);
                    });
                });
            }

            return p;
        }

        static chain(arr: Array<Promise<any, any>>): Promise<any, any> {
            var p: Promise<any, any> = new Promise();
            var data: Array<any> = [];

            function next() {
                if (p.done)
                    return;

                var n: Promise<any, any> = arr.length ? arr.shift() : p;
                n.then(
                    (result) => {
                        data.push(result);
                        next();
                    },
                    (err) => {
                        p.reject(err);
                    }
                    );
            }

            next();

            return p;
        }

        static create(obj: any): Promise<any, any> {
            if (obj instanceof Promise)
                return obj;
            else {
                var p = new Promise();
                p.resolve(obj);
                return p;
            }
        }
    }

}
