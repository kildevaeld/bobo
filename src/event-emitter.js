
const EventEmitter = (function () {
  var _check = function (event) {
    if (!this._listeners) this._listeners = {};
    if (event)
      if (!this._listeners[event]) this._listeners[event] = [];
  };

  return {
    on (event, fn, ctx, once=false) {
      _check.call(this, event);
      this._listeners[event].push({
        fn: fn,
        ctx: ctx||this,
        once: once,
        ev: event
      });
      return this;
    },
    once (event, fn, ctx) {
      return this.on(event, fn, ctx, true);
    },
    off (event, fn) {
      if (arguments.length === 0) {
        this._listeners = {};
      } else if (arguments.length === 1) {
        this._listeners[event] = [];
      } else if (arguments.length === 3) {
        _check.call(this, event);
        let len = this._listeners[event].length, e;
        while (--len >= 0) {
          e = this._listeners[events][len];
          if (e.fn === fn) {
            this._listeners.splice(len, 1);
          }
        }
      }
      return this;
    },
    emit (event, ...args) {
      _check.call(this);
      if (this._listeners.hasOwnProperty(event)) {
        let i = 0, e, a,
            lst = this._listeners[event].concat(this._listeners['all']||[]);
        for (i=0;i<lst.length;i++) {
          e = lst[i];
          a = e.ev === 'all' ? [event].concat(args) : args;
          if (e.once) this._listeners[event].splice(i,1);
          utils.callFunction(e.fn, e.ctx, a);
        }
      }
      return this;
    }
  };
})();