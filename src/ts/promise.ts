module ho.promise {

    export class Promise {

        constructor(func?: (resolve, reject) => any) {
            if (typeof func === 'function')
                func.call(this, this.resolve, this.reject);
        }

        private data: any = undefined;
        private onResolve: Function = undefined;
        private onReject: Function = undefined;

        public resolved: boolean = false;
        public rejected: boolean = false;
        public done: boolean = false;

        private ret: Promise = undefined;

        private set(data?): void {
            if (this.done)
                throw "Promise is already resolved / rejected";
            this.data = data;
        }

        public resolve(data?): void {
            this.set(data);
            this.resolved = this.done = true;
            if (typeof this.onResolve === 'function') {
                this._resolve();
            }
        }

        private _resolve(): void {
            if (this.ret === undefined) {
                this.ret = new Promise();
            }

            var v: any = this.onResolve(this.data);

            if (v && v instanceof Promise) {
                v.then(this.ret.resolve, this.ret.reject);
            }
            else {
                this.ret.resolve(v);
            }
        }

        public reject(data?): void {
            this.set(data);
            this.rejected = this.done = true;

            if (typeof this.onReject === 'function') {
                this.onReject(this.data);
            }

            if (this.ret) {
                this.ret.reject(this.data);
            }
        }

        private _reject(): void {
            if (this.ret === undefined) {
                this.ret = new Promise();
            }

            this.onReject(this.data);
            this.ret.reject(this.data);
        }

        public then(res: Function, rej?: Function): Promise {
            if (this.ret === undefined) {
                this.ret = new Promise();
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

        public catch(cb: Function): void {
            this.onReject = cb;

            if (this.rejected)
                this._reject();
        }

        static all(arr: Array<Promise>): Promise {
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

        static chain(arr: Array<Promise>): Promise {
            var p: Promise = new Promise();
            var data: Array<any> = [];

            function next() {
                if (p.done)
                    return;

                var n: Promise = arr.length ? arr.shift() : p;
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

        static create(obj: any): Promise {
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
