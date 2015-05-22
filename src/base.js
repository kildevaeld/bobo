

Bobo.Base = (function () {
  var Extenstions = []
  var Base = {
    registerExtension (ext, proto) {
      Extenstions.push(ext);
      if (proto)
        utils.extend(Base, proto);
    },
    registerCallback: function () {
      this.triggerMethod('register');
    },

    createdCallback () {
      this.root = this;

      this.triggerMethod('created');
    },

    attachedCallback () {
      this.triggerMethod('attached');
    },

    detachedCallback () {
      this.triggerMethod('detached');
    },

    attributeChangedCallback (...args) {
      this.triggerMethod('attribute:change', ...args);
    },

    triggerMethod (method, ...args) {
      this._call_exension(method, ...args);
      utils.triggerMethodOn(this, method, ...args);
    },

    _call_exension (method, ...args) {
      let i, ext;
      for (i=0;i<Extenstions.length;i++) {
        ext = Extenstions[i];
        if (typeof ext[method] === 'function') {
          utils.callFunction(ext[method], this, args);
        }
      }
    }
  };

  //utils.extend(Base, EventEmitter);
  Base = utils.chainObject(Base, HTMLElement.prototype);

  Object.defineProperty(Base, 'isBobo', {value:true});

  return Base;

})();
