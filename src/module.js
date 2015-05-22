

Bobo.Module = (function () {
  const Modules = {};

  let BoboModule = {
    onCreated () {
      this.id = this.getAttribute('name') || this.getAttribute('is');
      Modules[this.id] = this;
    }
  };

  BoboModule = utils.chainObject(BoboModule, Bobo.Base);

  return document.registerElement('bobo-element', {
    prototype: BoboModule
  });

})();
