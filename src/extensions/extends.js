

Bobo.Base.registerExtension({
  register () {
    if (this.extends) {
      this.__proto__ = get_extension(this.extends);
    }
  }

});

function get_extension (extend) {
  let proto = Object.getPrototypeOf(Document.createElement(extend));
  return this.extend(Object.create(proto), Bobo.Base);
}
