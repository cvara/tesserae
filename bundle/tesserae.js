var Tesserae =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tessera = __webpack_require__(1);
	var Utils = __webpack_require__(2);

	var Tesserae = function () {
		function Tesserae(_ref) {
			var container = _ref.container;
			var _ref$tesseraWidth = _ref.tesseraWidth;
			var tesseraWidth = _ref$tesseraWidth === undefined ? 30 : _ref$tesseraWidth;
			var _ref$tesseraHeight = _ref.tesseraHeight;
			var tesseraHeight = _ref$tesseraHeight === undefined ? 30 : _ref$tesseraHeight;
			var _ref$randomcolor = _ref.randomcolor;
			var randomcolor = _ref$randomcolor === undefined ? {
				hue: 'monochrome',
				luminosity: 'light'
			} : _ref$randomcolor;
			var _ref$filter = _ref.filter;
			var filter = _ref$filter === undefined ? {
				color: '#000',
				opacity: 0.6
			} : _ref$filter;
			var _ref$gradual = _ref.gradual;
			var gradual = _ref$gradual === undefined ? {
				enable: true,
				step: 10
			} : _ref$gradual;
			var _ref$animate = _ref.animate;
			var animate = _ref$animate === undefined ? {
				enable: true,
				step: 2
			} : _ref$animate;
			var _ref$live = _ref.live;
			var live = _ref$live === undefined ? {
				enable: true,
				minInterval: 50,
				maxInterval: 500
			} : _ref$live;

			_classCallCheck(this, Tesserae);

			// container is the only required parameter
			if (!container) {
				throw 'Tesserae Error: container option is missing.';
			}

			// properties
			this.containerEl = document.querySelector(container);

			// make sure container selector gives an existing dom element
			if (!this.containerEl) {
				throw 'Tesserae Error: no container element found: ' + container;
			}

			// settings
			this.tesseraWidth = parseInt(tesseraWidth, 10);
			this.tesseraHeight = parseInt(tesseraHeight, 10);
			this.randomcolor = randomcolor;
			this.filter = filter;
			this.gradual = gradual;
			this.animate = animate;
			this.live = live;
			if (this.live && this.live.enable !== false) {
				var min = parseInt(live.minInterval, 10) || 50;
				var max = parseInt(live.maxInterval, 10) || 500;
				this.live.minInterval = min;
				this.live.maxInterval = Math.max(min, max);
			}

			// cache computed style for convenience
			this.containerStyle = window.getComputedStyle(this.containerEl, null);

			// all drawn tessera shapes are stored here
			this.tesserae = [];

			// render version
			// NOTE: this is used to avoid issues with re-renders
			// while current animation has not finished yet
			this.renderVersion = 0;

			// init
			this._init();
		}

		_createClass(Tesserae, [{
			key: '_init',
			value: function _init() {
				// lazy draw function (debounced)
				this.lazyDraw = Utils.debounce(this.draw, 200).bind(this);
				window.addEventListener('resize', this.lazyDraw);
				// draw for the first time
				this.draw();
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				this._emptyContainer();
				this._restoreContainer();
				clearTimeout(this.animateTimer);
				this.tesserae.length = 0;
				window.removeEventListener('resize', this.lazyDraw);
			}
		}, {
			key: 'draw',
			value: function draw() {
				this.renderVersion++;

				this._editContainer();
				this._prepareCanvas();
				this._generateTesserae();
				this._addFilter();

				// gradually show tesserae in random order
				if (this.gradual && this.gradual.enable !== false) {
					var clone = Utils.cloneArrayShallow(this.tesserae);
					Utils.shuffle(clone);
					this._drawTesseraeGradually(clone, 0, this.gradual.step || 1, this.renderVersion);
				}
				// show all tesserae at once
				else {
						this._drawTesserae(this.tesserae);
					}

				// start animating random tesserae
				if (this.live && this.live.enable !== false) {
					this._animateRandomTessera(this.live);
				}
			}
		}, {
			key: '_animateRandomTessera',
			value: function _animateRandomTessera() {
				var _this = this;

				this.animateTimer = setTimeout(function () {
					var randomTessera = _this._getRandomTessera();
					randomTessera.animateToColor(_this.ctx, Utils.getRandomColor(_this.randomcolor, 'hslArray'));
					_this._animateRandomTessera();
				}, Utils.getRandomInt(this.live.minInterval, this.live.maxInterval));
			}
		}, {
			key: '_editContainer',
			value: function _editContainer() {
				// if parent has a non-static position, make it relative
				if (this.containerStyle.getPropertyValue('position') === 'static') {
					this.containerEl.style.position = 'relative';
				}
				this.containerEl.style.boxSizing = 'border-box';
			}
		}, {
			key: '_restoreContainer',
			value: function _restoreContainer() {
				// TODO: restore original position & box-sizing of container
			}
		}, {
			key: '_addFilter',
			value: function _addFilter() {
				if (!this.filter || this.filterEl) {
					return;
				}

				// prepare element
				var filterEl = this.filterEl = document.createElement('div');
				filterEl.style.width = '100%';
				filterEl.style.height = '100%';
				filterEl.style.backgroundColor = this.filter.color;
				filterEl.style.opacity = this.filter.opacity;
				filterEl.style.position = 'absolute';
				filterEl.style.zIndex = 1;
				filterEl.style.top = 0;

				this.containerEl.appendChild(filterEl);
			}
		}, {
			key: '_prepareCanvas',
			value: function _prepareCanvas() {
				var cs = this.containerStyle;

				var elementHeight = this.containerEl.clientHeight; // height with padding
				var elementWidth = this.containerEl.clientWidth; // width with padding

				elementHeight -= parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
				elementWidth -= parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

				// canvas exists
				if (this.ctx && this.canvas) {
					this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				}
				// canvas not created yet
				else {
						// create new canvas
						this.canvas = document.createElement('canvas');
						this.canvas.id = 'tesserae';
						this._emptyContainer();
						this.containerEl.appendChild(this.canvas);
						this.ctx = this.canvas.getContext('2d');
					}

				// set canvas width in any case
				this.canvas.width = elementWidth;
				this.canvas.height = elementHeight;
			}
		}, {
			key: '_generateTesserae',
			value: function _generateTesserae() {
				var xMod = this.canvas.offsetWidth % this.tesseraWidth;
				var yMod = this.canvas.offsetHeight % this.tesseraHeight;

				var fullCols = Math.floor(this.canvas.offsetWidth / this.tesseraWidth);
				var allCols = xMod > 0 ? fullCols + 2 : fullCols;

				var fullRows = Math.floor(this.canvas.offsetHeight / this.tesseraHeight);
				var allRows = yMod > 0 ? fullRows + 2 : fullRows;

				// empty tesserae array
				this.tesserae.length = 0;

				var posY = 0;

				for (var r = 0; r < allRows; r++) {
					var posX = 0;
					var actualHeight = this.tesseraHeight;
					if (r === 0 && yMod > 0) {
						actualHeight = Math.floor(yMod / 2);
					}
					if (r === allRows - 1 && yMod > 0) {
						actualHeight = Math.ceil(yMod / 2);
					}

					for (var c = 0; c < allCols; c++) {
						var actualWidth = this.tesseraWidth;
						if (c === 0 && xMod > 0) {
							actualWidth = Math.floor(xMod / 2);
						}
						if (c === allCols - 1 && xMod > 0) {
							actualWidth = Math.ceil(xMod / 2);
						}
						var tessera = new Tessera({
							x: posX,
							y: posY,
							width: actualWidth,
							height: actualHeight,
							hslArray: Utils.getRandomColor(this.randomcolor, 'hslArray')
						});
						this.tesserae.push(tessera);
						posX = posX + actualWidth;
					}
					posY = posY + actualHeight;
				}
			}
		}, {
			key: '_drawTesserae',
			value: function _drawTesserae(tesserae) {
				for (var i = 0, len = tesserae.length; i < len; i++) {
					tesserae[i].draw(this.ctx, this.animate);
				}
			}
		}, {
			key: '_drawTesseraeGradually',
			value: function _drawTesseraeGradually(tesserae, i, step, renderVersion) {
				var _this2 = this;

				if (i in tesserae) {
					var s = step;
					while (s-- > 0 && tesserae[i]) {
						tesserae[i++].draw(this.ctx, this.animate);
					}
					requestAnimationFrame(function () {
						if (renderVersion === _this2.renderVersion) {
							_this2._drawTesseraeGradually(tesserae, i, step, renderVersion);
						}
					});
				}
			}
		}, {
			key: '_emptyContainer',
			value: function _emptyContainer() {
				var el = this.containerEl;
				while (el.firstChild) {
					el.removeChild(el.firstChild);
				}
			}
		}, {
			key: '_getRandomTessera',
			value: function _getRandomTessera() {
				return this.tesserae[Utils.getRandomInt(0, this.tesserae.length)];
			}
		}]);

		return Tesserae;
	}();

		module.exports = Tesserae;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Utils = __webpack_require__(2);

	var Tessera = function () {
		function Tessera(_ref) {
			var x = _ref.x;
			var y = _ref.y;
			var width = _ref.width;
			var height = _ref.height;
			var hsl = _ref.hsl;
			var hslArray = _ref.hslArray;

			_classCallCheck(this, Tessera);

			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.hsl = Utils.arrayToHsl(hslArray);
			this.hslArray = hslArray;
			// true during initial draw
			this.isDrawing = false;
		}

		_createClass(Tessera, [{
			key: 'draw',
			value: function draw(ctx, animate) {
				if (animate && animate.enable !== false) {
					this.drawAnimated(ctx, animate.step);
				} else {
					ctx.fillStyle = this.hsl;
					ctx.fillRect(this.x, this.y, this.width, this.height);
				}
			}
		}, {
			key: 'drawAnimated',
			value: function drawAnimated(ctx) {
				var _this = this;

				var animateStep = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

				// initial animation step
				if (!this._curDrawHslArray) {
					this.isDrawing = true;
					this._curDrawHslArray = [this.hslArray[0], this.hslArray[1], 100];
				}

				// convert current step color to hsl string
				ctx.fillStyle = Utils.arrayToHsl(this._curDrawHslArray);
				// draw rectangle
				ctx.fillRect(this.x, this.y, this.width, this.height);

				// stop condition
				if (Utils.equalHslArrays(this._curDrawHslArray, this.hslArray)) {
					delete this._curDrawHslArray;
					this.isDrawing = false;
					return;
				}

				// calculate color for next step
				this._curDrawHslArray[2] = Math.max(this._curDrawHslArray[2] - animateStep, this.hslArray[2]);
				// next animation step
				requestAnimationFrame(function () {
					_this.drawAnimated(ctx);
				});
			}
		}, {
			key: 'animateToColor',
			value: function animateToColor(ctx, newHslArray) {
				var _this2 = this;

				// initial animation step
				if (!this._curAnimateHslArray) {

					// don't change color if initial draw not finished yet
					if (this.isDrawing) {
						return;
					}

					// start from old color
					this._curAnimateHslArray = Utils.cloneArrayShallow(this.hslArray);
					// target new color
					this.hslArray = newHslArray;
					// how many frames the animation will take to finish
					var frames = 40;
					// animation step array
					this._stepHsl = [];
					// hue step
					var hueDiff = this.hslArray[0] - this._curAnimateHslArray[0];
					var hueDiffAbs = Math.abs(hueDiff);
					var hueDiffSign = Utils.sign(this.hslArray[0] - this._curAnimateHslArray[0]);
					// take the shortest angle when animating hue
					if (hueDiffAbs > 180) {
						this._stepHsl[0] = (hueDiffAbs - 360) / frames * hueDiffSign;
					} else {
						this._stepHsl[0] = hueDiffAbs / frames * hueDiffSign;
					}
					// saturation step
					this._stepHsl[1] = (this.hslArray[1] - this._curAnimateHslArray[1]) / frames;
					// lightness step
					this._stepHsl[2] = (this.hslArray[2] - this._curAnimateHslArray[2]) / frames;
				}

				// convert current step color to hsl string
				ctx.fillStyle = Utils.arrayToHsl(this._curAnimateHslArray);
				// draw rectangle
				ctx.fillRect(this.x, this.y, this.width, this.height);

				// stop condition
				if (Utils.equalHslArrays(this._curAnimateHslArray, this.hslArray, true)) {
					delete this._curAnimateHslArray;
					return;
				}

				// calculate color for next step
				var stepH = this._curAnimateHslArray[0] + this._stepHsl[0];
				stepH = stepH > 360 ? stepH % 360 : stepH < 0 ? 360 + stepH : stepH;
				var stepS = this._curAnimateHslArray[1] + this._stepHsl[1];
				var stepL = this._curAnimateHslArray[2] + this._stepHsl[2];
				this._curAnimateHslArray = [stepH, stepS, stepL];
				// next animation step
				requestAnimationFrame(function () {
					_this2.animateToColor(ctx, newHslArray);
				});
			}
		}]);

		return Tessera;
	}();

		module.exports = Tessera;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var randomcolor = __webpack_require__(3);

	var Utils = {};

	// Returns debounced version of function
	// Code borrowed from underscore:
	// http://underscorejs.org/docs/underscore.html#section-83
	Utils.debounce = function (func, wait, immediate) {
					var timeout = void 0;
					return function () {
									var context = this,
									    args = arguments;
									var later = function later() {
													timeout = null;
													if (!immediate) {
																	func.apply(context, args);
													}
									};
									var callNow = immediate && !timeout;
									clearTimeout(timeout);
									timeout = setTimeout(later, wait);
									if (callNow) {
													func.apply(context, args);
									}
					};
	};

	// Returns random int between min (inclusive) and max (exclusive)
	Utils.getRandomInt = function (min, max) {
					min = Math.ceil(min);
					max = Math.floor(max);
					return Math.floor(Math.random() * (max - min)) + min;
	};

	// Returns random color using a random color generator
	// see: https://github.com/davidmerfield/randomColor
	Utils.getRandomColor = function (opts, format) {
					opts.format = format;
					var color = [];
					do {
									color = randomcolor(opts);
					} while (isNaN(color[0]) || isNaN(color[1]) || isNaN(color[2]));
					return color;
	};

	// Fisher-Yates shuffle
	Utils.shuffle = function (array) {
					var m = array.length,
					    t = void 0,
					    i = void 0;

					// While there remain elements to shuffle…
					while (m) {

									// Pick a remaining element…
									i = Math.floor(Math.random() * m--);

									// And swap it with the current element.
									t = array[m];
									array[m] = array[i];
									array[i] = t;
					}

					return array;
	};

	// Returns shallow clone of array
	Utils.cloneArrayShallow = function (array) {
					var clone = [];
					for (var i = 0, len = array.length; i < len; i++) {
									clone[i] = array[i];
					}
					return clone;
	};

	// Returns rgb representation of a hex color code
	Utils.hexToRgb = function (hex) {
					var rgb = [];
					var fail = false;
					var original = hex;

					hex = hex.replace(/#/, '');

					if (hex.length === 3) {
									hex = hex + hex;
					}

					for (var i = 0; i < 6; i += 2) {
									rgb.push(parseInt(hex.substr(i, 2), 16));
									fail = fail || rgb[rgb.length - 1].toString() === 'NaN';
					}

					return !fail && rgb;
	};

	// Returns hsl representation of an rgb color code
	Utils.rgbToHsl = function (r, g, b) {

					r /= 255;
					g /= 255;
					b /= 255;

					var max = Math.max(r, g, b),
					    min = Math.min(r, g, b);
					var h = void 0,
					    s = void 0,
					    l = (max + min) / 2;

					if (max === min) {
									h = s = 0;
					} else {
									var d = max - min;
									s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

									switch (max) {
													case r:
																	h = (g - b) / d + (g < b ? 6 : 0);
																	break;
													case g:
																	h = (b - r) / d + 2;
																	break;
													case b:
																	h = (r - g) / d + 4;
																	break;
									}

									h /= 6;
					}

					return [h * 100 + 0.5 | 0, (s * 100 + 0.5 | 0) + '%', (l * 100 + 0.5 | 0) + '%'];
	};

	// Returns hsl representation of a hex color code
	Utils.hexToHsl = function (hex) {
					return Utils.rgbToHsl.apply(Utils, _toConsumableArray(Utils.hexToRgb(hex)));
	};

	// Returns array representation of an hsl color string
	Utils.arrayToHsl = function (array) {
					return 'hsl(' + array[0] + ',' + array[1] + '%,' + array[2] + '%)';
	};

	// Compares two hsl arrays and returns true when colors are equal
	Utils.equalHslArrays = function (array1, array2, loose) {
					if (loose) {
									return Math.abs(array1[0] - array2[0]) < 1 && Math.abs(array1[1] - array2[1] < 1) && Math.abs(array1[2] - array2[2] < 1);
					}
					return array1[0] === array2[0] && array1[1] === array2[1] && array1[2] === array2[2];
	};

	Utils.sign = function (n) {
					return n === 0 ? 0 : n / Math.abs(n);
	};

	module.exports = Utils;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// randomColor by David Merfield under the CC0 license
	// https://github.com/davidmerfield/randomColor/

	;(function(root, factory) {

	  // Support AMD
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	  // Support CommonJS
	  } else if (typeof exports === 'object') {
	    var randomColor = factory();

	    // Support NodeJS & Component, which allow module.exports to be a function
	    if (typeof module === 'object' && module && module.exports) {
	      exports = module.exports = randomColor;
	    }

	    // Support CommonJS 1.1.1 spec
	    exports.randomColor = randomColor;

	  // Support vanilla script loading
	  } else {
	    root.randomColor = factory();
	  }

	}(this, function() {

	  // Seed to get repeatable colors
	  var seed = null;

	  // Shared color dictionary
	  var colorDictionary = {};

	  // Populate the color dictionary
	  loadColorBounds();

	  var randomColor = function (options) {

	    options = options || {};

	    // Check if there is a seed and ensure it's an
	    // integer. Otherwise, reset the seed value.
	    if (options.seed && options.seed === parseInt(options.seed, 10)) {
	      seed = options.seed;

	    // A string was passed as a seed
	    } else if (typeof options.seed === 'string') {
	      seed = stringToInteger(options.seed);

	    // Something was passed as a seed but it wasn't an integer or string
	    } else if (options.seed !== undefined && options.seed !== null) {
	      throw new TypeError('The seed value must be an integer or string');

	    // No seed, reset the value outside.
	    } else {
	      seed = null;
	    }

	    var H,S,B;

	    // Check if we need to generate multiple colors
	    if (options.count !== null && options.count !== undefined) {

	      var totalColors = options.count,
	          colors = [];

	      options.count = null;

	      while (totalColors > colors.length) {

	        // Since we're generating multiple colors,
	        // incremement the seed. Otherwise we'd just
	        // generate the same color each time...
	        if (seed && options.seed) options.seed += 1;

	        colors.push(randomColor(options));
	      }

	      options.count = totalColors;

	      return colors;
	    }

	    // First we pick a hue (H)
	    H = pickHue(options);

	    // Then use H to determine saturation (S)
	    S = pickSaturation(H, options);

	    // Then use S and H to determine brightness (B).
	    B = pickBrightness(H, S, options);

	    // Then we return the HSB color in the desired format
	    return setFormat([H,S,B], options);
	  };

	  function pickHue (options) {

	    var hueRange = getHueRange(options.hue),
	        hue = randomWithin(hueRange);

	    // Instead of storing red as two seperate ranges,
	    // we group them, using negative numbers
	    if (hue < 0) {hue = 360 + hue;}

	    return hue;

	  }

	  function pickSaturation (hue, options) {

	    if (options.luminosity === 'random') {
	      return randomWithin([0,100]);
	    }

	    if (options.hue === 'monochrome') {
	      return 0;
	    }

	    var saturationRange = getSaturationRange(hue);

	    var sMin = saturationRange[0],
	        sMax = saturationRange[1];

	    switch (options.luminosity) {

	      case 'bright':
	        sMin = 55;
	        break;

	      case 'dark':
	        sMin = sMax - 10;
	        break;

	      case 'light':
	        sMax = 55;
	        break;
	   }

	    return randomWithin([sMin, sMax]);

	  }

	  function pickBrightness (H, S, options) {

	    var bMin = getMinimumBrightness(H, S),
	        bMax = 100;

	    switch (options.luminosity) {

	      case 'dark':
	        bMax = bMin + 20;
	        break;

	      case 'light':
	        bMin = (bMax + bMin)/2;
	        break;

	      case 'random':
	        bMin = 0;
	        bMax = 100;
	        break;
	    }

	    return randomWithin([bMin, bMax]);
	  }

	  function setFormat (hsv, options) {

	    switch (options.format) {

	      case 'hsvArray':
	        return hsv;

	      case 'hslArray':
	        return HSVtoHSL(hsv);

	      case 'hsl':
	        var hsl = HSVtoHSL(hsv);
	        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

	      case 'hsla':
	        var hslColor = HSVtoHSL(hsv);
	        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + Math.random() + ')';

	      case 'rgbArray':
	        return HSVtoRGB(hsv);

	      case 'rgb':
	        var rgb = HSVtoRGB(hsv);
	        return 'rgb(' + rgb.join(', ') + ')';

	      case 'rgba':
	        var rgbColor = HSVtoRGB(hsv);
	        return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';

	      default:
	        return HSVtoHex(hsv);
	    }

	  }

	  function getMinimumBrightness(H, S) {

	    var lowerBounds = getColorInfo(H).lowerBounds;

	    for (var i = 0; i < lowerBounds.length - 1; i++) {

	      var s1 = lowerBounds[i][0],
	          v1 = lowerBounds[i][1];

	      var s2 = lowerBounds[i+1][0],
	          v2 = lowerBounds[i+1][1];

	      if (S >= s1 && S <= s2) {

	         var m = (v2 - v1)/(s2 - s1),
	             b = v1 - m*s1;

	         return m*S + b;
	      }

	    }

	    return 0;
	  }

	  function getHueRange (colorInput) {

	    if (typeof parseInt(colorInput) === 'number') {

	      var number = parseInt(colorInput);

	      if (number < 360 && number > 0) {
	        return [number, number];
	      }

	    }

	    if (typeof colorInput === 'string') {

	      if (colorDictionary[colorInput]) {
	        var color = colorDictionary[colorInput];
	        if (color.hueRange) {return color.hueRange;}
	      }
	    }

	    return [0,360];

	  }

	  function getSaturationRange (hue) {
	    return getColorInfo(hue).saturationRange;
	  }

	  function getColorInfo (hue) {

	    // Maps red colors to make picking hue easier
	    if (hue >= 334 && hue <= 360) {
	      hue-= 360;
	    }

	    for (var colorName in colorDictionary) {
	       var color = colorDictionary[colorName];
	       if (color.hueRange &&
	           hue >= color.hueRange[0] &&
	           hue <= color.hueRange[1]) {
	          return colorDictionary[colorName];
	       }
	    } return 'Color not found';
	  }

	  function randomWithin (range) {
	    if (seed === null) {
	      return Math.floor(range[0] + Math.random()*(range[1] + 1 - range[0]));
	    } else {
	      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
	      var max = range[1] || 1;
	      var min = range[0] || 0;
	      seed = (seed * 9301 + 49297) % 233280;
	      var rnd = seed / 233280.0;
	      return Math.floor(min + rnd * (max - min));
	    }
	  }

	  function HSVtoHex (hsv){

	    var rgb = HSVtoRGB(hsv);

	    function componentToHex(c) {
	        var hex = c.toString(16);
	        return hex.length == 1 ? '0' + hex : hex;
	    }

	    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

	    return hex;

	  }

	  function defineColor (name, hueRange, lowerBounds) {

	    var sMin = lowerBounds[0][0],
	        sMax = lowerBounds[lowerBounds.length - 1][0],

	        bMin = lowerBounds[lowerBounds.length - 1][1],
	        bMax = lowerBounds[0][1];

	    colorDictionary[name] = {
	      hueRange: hueRange,
	      lowerBounds: lowerBounds,
	      saturationRange: [sMin, sMax],
	      brightnessRange: [bMin, bMax]
	    };

	  }

	  function loadColorBounds () {

	    defineColor(
	      'monochrome',
	      null,
	      [[0,0],[100,0]]
	    );

	    defineColor(
	      'red',
	      [-26,18],
	      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
	    );

	    defineColor(
	      'orange',
	      [19,46],
	      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
	    );

	    defineColor(
	      'yellow',
	      [47,62],
	      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
	    );

	    defineColor(
	      'green',
	      [63,178],
	      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
	    );

	    defineColor(
	      'blue',
	      [179, 257],
	      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
	    );

	    defineColor(
	      'purple',
	      [258, 282],
	      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
	    );

	    defineColor(
	      'pink',
	      [283, 334],
	      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
	    );

	  }

	  function HSVtoRGB (hsv) {

	    // this doesn't work for the values of 0 and 360
	    // here's the hacky fix
	    var h = hsv[0];
	    if (h === 0) {h = 1;}
	    if (h === 360) {h = 359;}

	    // Rebase the h,s,v values
	    h = h/360;
	    var s = hsv[1]/100,
	        v = hsv[2]/100;

	    var h_i = Math.floor(h*6),
	      f = h * 6 - h_i,
	      p = v * (1 - s),
	      q = v * (1 - f*s),
	      t = v * (1 - (1 - f)*s),
	      r = 256,
	      g = 256,
	      b = 256;

	    switch(h_i) {
	      case 0: r = v; g = t; b = p;  break;
	      case 1: r = q; g = v; b = p;  break;
	      case 2: r = p; g = v; b = t;  break;
	      case 3: r = p; g = q; b = v;  break;
	      case 4: r = t; g = p; b = v;  break;
	      case 5: r = v; g = p; b = q;  break;
	    }

	    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
	    return result;
	  }

	  function HSVtoHSL (hsv) {
	    var h = hsv[0],
	      s = hsv[1]/100,
	      v = hsv[2]/100,
	      k = (2-s)*v;

	    return [
	      h,
	      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
	      k/2 * 100
	    ];
	  }

	  function stringToInteger (string) {
	    var total = 0
	    for (var i = 0; i !== string.length; i++) {
	      if (total >= Number.MAX_SAFE_INTEGER) break;
	      total += string.charCodeAt(i)
	    }
	    return total
	  }

	  return randomColor;
	}));


/***/ }
/******/ ]);
//# sourceMappingURL=tesserae.js.map