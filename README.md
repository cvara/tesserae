Tesserae
=======================

> Animated mosaic backgrounds with HTML5 Canvas ([**demo**](https://thet0dd.github.io/tesserae/))

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

Include the `/bundle/tesserae.js` or `/bundle/tesserae.min.js` preferably at the end of your `<body>`, i.e:


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

You can create a new Tesserae mosaic background inside a predefined html container by calling the constructor.


```js
var t = new Tesserae({
  container: '#some-container'
});
```

Keeping a reference to the returned instance is advised, so you may later invoke some of its methods, for instance in case you wish to destroy or re-draw the background.


Options
------------

You invoke the Tesserae constructor passing an options object. While the only required option is the `container` selector, you should really play around with different values for the other options to get the result you desire.

Here is the list of all the available options:


### container

`string`: The selector of the element inside which you wish Tesserae to draw the background.

```js
var t = new Tesserae({
  container: '#some-container'
});
```

**NOTE:** Tesserae respects the `container` size. In fact, it expects `container` to be **visible** and of **non-zero width/height**. So for example, trying to initialize Tesserae on an empty `<div>` whose dimensions are not explicitly set would yield no result.  

### tesseraWidth

`number`: The width of each mosaic tile in pixels. `default: 30`

### tesseraHeight

`number`: The height of each mosaic tile in pixels. `default: 30`

```js
var t = new Tesserae({
  container: '#some-container',
  tesseraWidth: 40,
  tesseraHeight: 40
});
```

### randomcolor

`object`: Options to be forwarded to the random color generator.
`default`:
```js
randomcolor = {
  hue: 'monochrome',
  luminosity: 'light'
}
```

Tesserae uses the [Random Color](https://randomcolor.llllll.li/) generator by David Merfield to generate random colors for each mosaic tile. For more info on all the available options you can check the [project's github page](https://github.com/davidmerfield/randomColor#options).

```js
// example 1: bright variations of purple-based colors
var t1 = new Tesserae({
  container: '#some-container',
  randomcolor = {
	hue: 'purple',
	luminosity: 'bright'
  }
});
```

Omitting the `randomcolor.hue` option will generate a truly random color:

```js
// example 2: dark variations of truly random colors
var t2 = new Tesserae({
  container: '#some-other-container',
  randomcolor = {
	luminosity: 'dark'
  }
});
```

### filter

`object` or `false`: Controls the appearance of a filter (overlay) above the mosaic. When `false` disables the filter entirely.
`default`:
```js
filter = {
  color: '#000',
  opacity: 0.6
}
```

Filter is best used when bright colors are chosen and/or when text is to be displayed on top of the generated background.

```js
// example: turquise filter with 80% opacity
var t = new Tesserae({
  container: '#some-container',
  filter = {
	color: '#16a085',
	opacity: 0.8
  }
});
```

### gradual

`object` or `false`: Controls the draw behavior of the mosaic. When set to `false` all tiles will be drawn at once. When set to `object`, tiles will be gradually drawn in batches. Batch size is controlled by the `step` property. Each batch is drawn in a new animation frame. `default`:
```js
gradual = {
  enable: true,
  step: 10
}
```

```js
// example: gradually draw mosaic in batches of 4
var t = new Tesserae({
  container: '#some-container',
  gradual = {
    enable: true,
    step: 4
  }
});
```

### animate

`object` or `false`: Controls the draw behavior of individual tiles. When set to `false` each tile will draw itself immediately, without animation. When set to `object`, each tile will animate-show itself. The speed of the animation is controlled by the `step` property. `default`:
```js
animate = {
  enable: true,
  step: 2
}
```

```js
// example: animate tiles a little faster on show
var t = new Tesserae({
  container: '#some-container',
  animate = {
    enable: true,
    step: 4
  }
});
```

Methods
------------

By keeping a reference to the created Tesserae instance you may invoke the following methods:


### destroy()

Destroys the canvas and unregisters all listeners.

```js
// create a Tesserae instance
var t = new Tesserae({
  container: '#some-container'
});
// destroy it
t.destroy();
```

### draw()

Draws the mosaic. It is automatically called upon the creation of a new instance. Manually calling it again will re-draw the mosaic. It is a good idea to manually call `draw` anytime the container size changes.

**NOTE:** Tesserae listens for window resize events and re-draws automatically, so you need only worry about programatical size changes of the container (i.e. when you manually update its size)

```js
// create a Tesserae instance
var t = new Tesserae({
  container: '#some-container'
});
// re-draw
t.draw();
```
