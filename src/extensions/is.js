
// Is/name extension
Bobo.Base.registerExtension({
  register () {
    if (!this.is) {
      let module = document.currentScript.parentNode;
      if (module.localName === 'bobo-element') {
        this.is = module.id||module.getAttribute('is')||module.getAttribute('name');
      }
    }
  }
});
