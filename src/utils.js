


var __camelCase = function(input) {
  return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
};

var __slice = [].slice;

const utils = {
  extend (prototype) {
    let i, api;
    for (i=1;i<arguments.length;i++) {
      api = arguments[i];
      Object.getOwnPropertyNames(api)
     .forEach(function(name) {
        var pd = Object.getOwnPropertyDescriptor(api, name);
        if (pd)
          Object.defineProperty(prototype, name, pd);
      });
    }


   return prototype;

  },

  inherits (object, inherited) {
    if (object  !== inherited) {
      return utils.extend(Object.create(inherited), object);
    }

    return object;
  },

  triggerMethod (event) {
    let e = __camelCase('on-' + event.replace(/:/g, '-')),
      m = utils.getOption.call(this, e),
      args = __slice.call(arguments, 1);

    if (typeof m === 'function') {
      utils.callFunction(m, this, args);
    }
  },

  triggerMethodOn (o, ...args) {
    utils.callFunction(utils.triggerMethod, o, args);
  },

  getOption (option, obj={}) {
    let options = this.options || {};
    return obj[option] || options[option] || this[option];
  },

  callFunction: function(fn, ctx, args) {
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
