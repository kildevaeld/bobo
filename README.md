# Bobo

Small Polymer-like declarative custom HTML elements you can extend

Define it:

```html

<bobo-element name="my-thing">
  <template>
    <h3 ui="title"></h3>
    <textarea></textarea>
    <content></content>
  </template>
  <script>
    Bobo({
      onCreated: function () {
        var title = this.getAttribute('title');
        if (title) {
          this.title = title;
        }
      },
      properties: {
        title: {
          get: function () {
            return this.ui.title.innerText;
          },
          set: function (title) {
            this.ui.title.innerText = title;
          }
        }
      }
    });
  </script>
</bobo-element>

```



And use it:

```html
<my-thing title="Title for my thing">
  <button>Ok</button>
</my-thing>
```
or from javascript:

```javascript

var myThing = document.createElement('my-thing');
myThing.title = "Title";

document.body.appendChild(myThing);

```


Extend it:

```javascript

Bobo.Base.registerExtension({
  created: function () {

  },
  register: function () {

  }
});


```
