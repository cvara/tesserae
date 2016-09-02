Tesserae
=======================

**Animated mosaic backgrounds with HTML5 Canvas**

Tesserae is a small library that creates customizable and optionally animated mosaic patterns that can be used to replace dull/static/image backgrounds.

Tesserae uses HTML5 Canvas instead of (hundreds of) DOM elements to create its backgrounds and `requestAnimationFrame` to handle its animations.
The reasoning behind this lies in the performance gains of Immediate Mode (canvas) vs Retained Mode (DOM). You can read [here](https://www.kirupa.com/html5/dom_vs_canvas.htm) for more details.

Despite being faster and less memory taxing on modern desktop browsers, using canvas comes with its downsides:

* not all browsers support canvas
* canvas performance on some mobile browsers is poor

Both the above issues can be countered by gracefully degrading to a static/image background on mobile browsers or on browsers that do not support canvas.


Installation
------------

**Option 1: Browser**

Include the `/dist/tesserae.js` or `/dist/tesserae.min.js` preferably at the end of your `<body>`, i.e:


```html
<body>

  <!-- your code  -->

  <!-- include tesserae  -->
  <script src="tesserae.min.js"></script>
  <script>
    // use it
	new Tesserae({
		container: '#some-container'
	});
  </script>
</body>
```


**Option 2: CommonJS environment (i.e. webpack or browserify)**

Install via npm:

```sh
$ npm install tesserae
```

require it and use it like so:

```js
var Tesserae = require('tesserae');

new Tesserae({
  container: '#some-container'
});
```


Usage
------------

You can create a new Tesserae mosaic bacground inside a predefined html container by calling the constructor.


```js
var t = new Tesserae({
  container: '#some-container'
});
```

Keeping a reference to the returned instance is advised, so you may later invoke some of its methods, for instance in case you wish to destroy or re-draw the background.
