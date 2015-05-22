
function create (prototype) {
  prototype = utils.extend(Object.create(Bobo.Base), prototype);
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
