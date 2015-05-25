function get_match (child, store) {
  for (let k in store) {
    if (child.matches(k)) {
      return store[k];
    }
    return store.content;
  }
}

const API = {
  render () {
    if (this._template) {
      let template = document.importNode(this._template.content, true),
          store = this.__store,
          injections = __slice.call(template.querySelectorAll('content'));

      let matches = this._getmatches(injections);
      let content = this._getcontent(injections);

      for (let k in store) {
        let frag = document.createDocumentFragment();

        store[k].forEach( child => {
          frag.appendChild(child);
        });

        let sub = (k === 'content') ? content : matches[k];

        if (sub && sub.parentNode) {
          sub.parentNode.replaceChild(frag, sub);
        } else {
          template.appendChild(frag);

          if (sub) {
            template.removeChild(sub);
          }
        }
      }

      this.root.innerHTML = '';
      Bobo.Base.constructor.prototype.appendChild.call(this, template);

    }

  },
  _getmatches (injections) {

    let matches = {};
    injections.forEach(elm => {
      if (elm.getAttribute('select')) {
        matches[elm.getAttribute('select')] = elm;
      }
    });
    return matches;
  },

  _getcontent (injections) {
    let contents = injections.filter(elm => {
      return !!!elm.getAttribute('select');
    });

    if (contents.length) return contents[0];
    return null;
  },
  appendChild (child) {
    for (let k in this.__store) {
      if (child.matches(k)) {
        let c = this.__store[k];
        c.push(child);
        if (c.length === 1) {
          return this.render();
        } else {
          let elm = c[c.length - 2];
          return elm.parentNode.appendChild(child);
        }
      }
    }
    // TODO: Only rerender if it's the first.
    this.__store.content.push(child);
    this.render();
  },

  removeChild (child) {
    for (let k in this.__store) {

    }
  }
};

// Template
Bobo.Base.registerExtension({
  register () {
    let module = document.currentScript.parentNode;

    if (module.localName === 'bobo-element') {
      let template = module.querySelector('template');
      if (template) {
        this._template = template;
      }
      if (!this.useShadow) {
        utils.extend(this, API);
      }
    }
  },

  created () {
    if (this._template) {

      if (this.useShadow === true) {
        let template = document.importNode(this._template.content, true);
        this.root = this.createShadowRoot();
        this.root.appendChild(template);

      } else {

        let injections = __slice.call(this._template.content.querySelectorAll('content'));

        let matches = this._getmatches(injections);
        let content = this._getcontent(injections);

        let children = __slice.call(this.children);

        let store = {};
        __slice.call(this.children).forEach( (child) => {
          for (var k in matches) {
            if (child.matches(k)) {
              if (store[k] == null) store[k] = [];
              store[k].push(child);
              children.splice(children.indexOf(child),1);
            }
          }
        });
        if (content)
          store.content = children;

        this.__store = store;

        this.render();
      }
    }
  }
},{useShadow: true});
