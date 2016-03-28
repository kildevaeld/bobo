
function create (prototype) {
  prototype = utils.inherits(prototype, Bobo.Base);
  prototype.registerCallback();
  return prototype;
}

const Bobo = function (prototype) {

  prototype = create(prototype);

  let options = {
    prototype: prototype
  };

  if (prototype.extends) {
    options.extends = prototype.extends;
  }
  document.registerElement(prototype.is||prototype.name, options);

  return prototype.constructor;
};

