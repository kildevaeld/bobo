

// Template
Bobo.Base.registerExtension({
  register () {
    let module = document.currentScript.parentNode;

    if (module.localName === 'bobo-element') {
      let template = module.querySelector('template');
      if (template) {
        this._template = template;
      }
    }
  },

  created () {
    if (this._template) {

      let template = document.importNode(this._template.content, true);
      this.root = this.createShadowRoot();
      this.root.appendChild(template);

    }
  }
});
