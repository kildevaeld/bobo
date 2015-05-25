(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Bobo = factory();
  }
}(this, function (require, exports, module) {

  'use strict';

  var __camelCase = function __camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
      return group1.toUpperCase();
    });
  };

  var __slice = [].slice;

  var utils = {
    extend: function extend(prototype) {
      var i = undefined,
          api = undefined;
      for (i = 1; i < arguments.length; i++) {
        api = arguments[i];
        Object.getOwnPropertyNames(api).forEach(function (name) {
          var pd = Object.getOwnPropertyDescriptor(api, name);
          if (pd) Object.defineProperty(prototype, name, pd);
        });
      }

      return prototype;
    },

    inherits: function inherits(object, inherited) {
      if (object !== inherited) {
        return utils.extend(Object.create(inherited), object);
      }

      return object;
    },

    triggerMethod: function triggerMethod(event) {
      var e = __camelCase('on-' + event.replace(/:/g, '-')),
          m = utils.getOption.call(this, e),
          args = __slice.call(arguments, 1);

      if (typeof m === 'function') {
        utils.callFunction(m, this, args);
      }
    },

    triggerMethodOn: function triggerMethodOn(o) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      utils.callFunction(utils.triggerMethod, o, args);
    },

    getOption: function getOption(option) {
      var obj = arguments[1] === undefined ? {} : arguments[1];

      var options = this.options || {};
      return obj[option] || options[option] || this[option];
    },

    callFunction: function callFunction(fn, ctx, args) {
      switch (args.length) {
      case 0:
        return fn.call(ctx);
      case 1:
        return fn.call(ctx, args[0]);
      case 2:
        return fn.call(ctx, args[0], args[1]);
      case 3:
        return fn.call(ctx, args[0], args[1], args[2]);
      case 4:
        return fn.call(ctx, args[0], args[1], args[2], args[3]);
      default:
        return fn.apply(ctx, args);
      }
    }

  };

  function create(prototype) {
    prototype = utils.inherits(prototype, Bobo.Base);
    prototype.registerCallback();
    return prototype;
  }

  var Bobo = function Bobo(prototype) {

    prototype = create(prototype);

    var options = {
      prototype: prototype
    };

    if (prototype['extends']) {
      options['extends'] = prototype['extends'];
    }
    document.registerElement(prototype.is || prototype.name, options);

    return prototype.constructor;
  };

  Bobo.Base = (function () {
    var Extenstions = [];
    var Base = {
      registerExtension: function registerExtension(ext, proto) {
        Extenstions.push(ext);
        if (proto) utils.extend(Base, proto);
      },
      registerCallback: function registerCallback() {
        this.triggerMethod('register');
      },

      createdCallback: function createdCallback() {
        this.root = this;

        this.triggerMethod('created');
      },

      attachedCallback: function attachedCallback() {
        this.triggerMethod('attached');
      },

      detachedCallback: function detachedCallback() {
        this.triggerMethod('detached');
      },

      attributeChangedCallback: function attributeChangedCallback() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        this.triggerMethod.apply(this, ['attribute:change'].concat(args));
      },

      triggerMethod: function triggerMethod(method) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        this._call_exension.apply(this, [method].concat(args));
        utils.triggerMethodOn.apply(utils, [this, method].concat(args));
      },

      _call_exension: function _call_exension(method) {
        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        var i = undefined,
            ext = undefined;
        for (i = 0; i < Extenstions.length; i++) {
          ext = Extenstions[i];
          if (typeof ext[method] === 'function') {
            utils.callFunction(ext[method], this, args);
          }
        }
      }
    };

    //utils.extend(Base, EventEmitter);
    Base = utils.inherits(Base, HTMLElement.prototype);

    Object.defineProperty(Base, 'isBobo', {
      value: true
    });

    return Base;
  })();

  Bobo.Module = (function () {
    var Modules = {};

    var BoboModule = {
      onCreated: function onCreated() {
        this.id = this.getAttribute('name') || this.getAttribute('is');
        Modules[this.id] = this;
      }
    };

    BoboModule = utils.inherits(BoboModule, Bobo.Base);

    return document.registerElement('bobo-element', {
      prototype: BoboModule
    });
  })();

  Bobo.Base.registerExtension({
    register: function register() {
      if (this['extends']) {
        this.__proto__ = get_extension(this['extends']);
      }
    }

  });

  function get_extension(extend) {
    var proto = Object.getPrototypeOf(document.createElement(extend));
    return utils.extend(Object.create(proto), Bobo.Base);
  }

  // Is/name extension
  Bobo.Base.registerExtension({
    register: function register() {
      if (!this.is) {
        var _module2 = document.currentScript.parentNode;
        if (_module2.localName === 'bobo-element') {
          this.is = _module2.id || _module2.getAttribute('is') || _module2.getAttribute('name');
        }
      }
    }
  });

  // Template
  Bobo.Base.registerExtension({
    register: function register() {
      var module = document.currentScript.parentNode;

      if (module.localName === 'bobo-element') {
        var template = module.querySelector('template');
        if (template) {
          this._template = template;
        }
      }
    },

    created: function created() {
      if (this._template) {

        var template = document.importNode(this._template.content, true);
        this.root = this.createShadowRoot();
        this.root.appendChild(template);
      }
    }
  });

  Bobo.Base.registerExtension({
    register: function register() {
      if (this.properties) {
        Object.defineProperties(this, this.properties);
      }
    }
  });

  Bobo.Base.registerExtension({

    created: function created() {
      var _this = this;

      var names = __slice.call(this.root.querySelectorAll('[name]'));

      names.forEach(function (n) {
        _this.ui[n.getAttribute('name')] = n;
      });
    }

  }, {
    ui: {}
  });

  Bobo.Base.registerExtension({
    register: function register() {
      if (this['extends']) {
        this.__proto__ = get_extension(this['extends']);
      }
    }

  });

  function get_extension(extend) {
    var proto = Object.getPrototypeOf(document.createElement(extend));
    return utils.extend(Object.create(proto), Bobo.Base);
  }
  return Bobo;

}));