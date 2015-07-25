/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var Promise = (function () {
	    function Promise(func) {
	        this.data = undefined;
	        this.onResolve = undefined;
	        this.onReject = undefined;
	        this.resolved = false;
	        this.rejected = false;
	        this.done = false;
	        this.ret = undefined;
	        if (typeof func === 'function')
	            func.call(this, this.resolve, this.reject);
	    }
	    Promise.prototype.set = function (data) {
	        if (this.done)
	            throw "Promise is already resolved / rejected";
	        this.data = data;
	    };
	    Promise.prototype.resolve = function (data) {
	        this.set(data);
	        this.resolved = this.done = true;
	        if (typeof this.onResolve === 'function') {
	            this._resolve();
	        }
	    };
	    Promise.prototype._resolve = function () {
	        if (this.ret === undefined) {
	            this.ret = new Promise();
	        }
	        var v = this.onResolve(this.data);
	        if (v && v instanceof Promise) {
	            v.then(this.ret.resolve, this.ret.reject);
	        }
	        else {
	            this.ret.resolve(v);
	        }
	    };
	    Promise.prototype.reject = function (data) {
	        this.set(data);
	        this.rejected = this.done = true;
	        if (typeof this.onReject === 'function') {
	            this.onReject(this.data);
	        }
	        if (this.ret) {
	            this.ret.reject(this.data);
	        }
	    };
	    Promise.prototype._reject = function () {
	        if (this.ret === undefined) {
	            this.ret = new Promise();
	        }
	        this.onReject(this.data);
	        this.ret.reject(this.data);
	    };
	    Promise.prototype.then = function (res, rej) {
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
	    };
	    Promise.prototype.catch = function (cb) {
	        this.onReject = cb;
	        if (this.rejected)
	            this._reject();
	    };
	    Promise.all = function (arr) {
	        var p = new Promise();
	        var data = [];
	        if (arr.length === 0) {
	            p.resolve();
	        }
	        else {
	            arr.forEach(function (prom, index) {
	                prom
	                    .then(function (d) {
	                    if (p.done)
	                        return;
	                    data[index] = d;
	                    var allResolved = arr.reduce(function (state, p1) {
	                        return state && p1.resolved;
	                    }, true);
	                    if (allResolved) {
	                        p.resolve(data);
	                    }
	                })
	                    .catch(function (err) {
	                    p.reject(err);
	                });
	            });
	        }
	        return p;
	    };
	    Promise.chain = function (arr) {
	        var p = new Promise();
	        var data = [];
	        function next() {
	            if (p.done)
	                return;
	            var n = arr.length ? arr.shift() : p;
	            n.then(function (result) {
	                data.push(result);
	                next();
	            }, function (err) {
	                p.reject(err);
	            });
	        }
	        next();
	        return p;
	    };
	    Promise.create = function (obj) {
	        if (obj instanceof Promise)
	            return obj;
	        else {
	            var p = new Promise();
	            p.resolve(obj);
	            return p;
	        }
	    };
	    return Promise;
	})();
	module.exports = Promise;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL3Byb21pc2UudHMiXSwibmFtZXMiOlsiUHJvbWlzZSIsIlByb21pc2UuY29uc3RydWN0b3IiLCJQcm9taXNlLnNldCIsIlByb21pc2UucmVzb2x2ZSIsIlByb21pc2UuX3Jlc29sdmUiLCJQcm9taXNlLnJlamVjdCIsIlByb21pc2UuX3JlamVjdCIsIlByb21pc2UudGhlbiIsIlByb21pc2UuY2F0Y2giLCJQcm9taXNlLmFsbCIsIlByb21pc2UuY2hhaW4iLCJQcm9taXNlLmNoYWluLm5leHQiLCJQcm9taXNlLmNyZWF0ZSJdLCJtYXBwaW5ncyI6IkFBQUE7SUFFSUEsaUJBQVlBLElBQStCQTtRQUtuQ0MsU0FBSUEsR0FBUUEsU0FBU0EsQ0FBQ0E7UUFDdEJBLGNBQVNBLEdBQWFBLFNBQVNBLENBQUNBO1FBQ2hDQSxhQUFRQSxHQUFhQSxTQUFTQSxDQUFDQTtRQUVoQ0EsYUFBUUEsR0FBWUEsS0FBS0EsQ0FBQ0E7UUFDMUJBLGFBQVFBLEdBQVlBLEtBQUtBLENBQUNBO1FBQzFCQSxTQUFJQSxHQUFZQSxLQUFLQSxDQUFDQTtRQUVyQkEsUUFBR0EsR0FBWUEsU0FBU0EsQ0FBQ0E7UUFaN0JBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLEtBQUtBLFVBQVVBLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUNuREEsQ0FBQ0E7SUFZT0QscUJBQUdBLEdBQVhBLFVBQVlBLElBQUtBO1FBQ2JFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO1lBQ1ZBLE1BQU1BLHdDQUF3Q0EsQ0FBQ0E7UUFDbkRBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO0lBQ3JCQSxDQUFDQTtJQUVNRix5QkFBT0EsR0FBZEEsVUFBZUEsSUFBS0E7UUFDaEJHLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ2ZBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxTQUFTQSxLQUFLQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFDcEJBLENBQUNBO0lBQ0xBLENBQUNBO0lBRU9ILDBCQUFRQSxHQUFoQkE7UUFDSUksRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLE9BQU9BLEVBQUVBLENBQUNBO1FBQzdCQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxHQUFRQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUV2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDNUJBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzlDQSxDQUFDQTtRQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNGQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFTUosd0JBQU1BLEdBQWJBLFVBQWNBLElBQUtBO1FBQ2ZLLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ2ZB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

/***/ }
/******/ ]);