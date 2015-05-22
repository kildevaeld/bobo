

Bobo.Base.registerExtension({
  register () {
    if (this.properties) {
      Object.defineProperties(this,this.properties);
    }
  }
});
