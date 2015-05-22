


Bobo.Base.registerExtension({

  created () {

    let names = __slice.call(this.root.querySelectorAll('[name]'));

    names.forEach(n => {
      this.ui[n.getAttribute('name')] = n;
    });
  }

},{ui:{}});
