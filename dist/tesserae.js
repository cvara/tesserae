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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tesserae = function () {
		function Tesserae(opts) {
			_classCallCheck(this, Tesserae);

			this.options = opts;
			this.draw(opts);
			var lazyDraw = this._debounce(this.draw, 200).bind(this);
			this.resizehandler = function (event) {
				lazyDraw(opts);
			};
			window.addEventListener('resize', this.resizehandler);
		}

		_createClass(Tesserae, [{
			key: 'destroy',
			value: function destroy() {
				var containerEl = document.querySelector(this.options.container);
				this._emptyElement(containerEl);
				window.removeEventListener('resize', this.resizehandler);
			}
		}, {
			key: 'draw',
			value: function draw(_ref) {
				var container = _ref.container;
				var _ref$tesseraWidth = _ref.tesseraWidth;
				var tesseraWidth = _ref$tesseraWidth === undefined ? 30 : _ref$tesseraWidth;
				var _ref$tesseraHeight = _ref.tesseraHeight;
				var tesseraHeight = _ref$tesseraHeight === undefined ? 30 : _ref$tesseraHeight;

				var containerEl = document.querySelector(container);
				var canvas = this._createCanvas(containerEl);
				this._drawBackground(canvas, tesseraWidth, tesseraHeight);
			}
		}, {
			key: '_createCanvas',
			value: function _createCanvas(containerEl) {
				var canvas = document.createElement('canvas');
				canvas.id = 'tesserae';
				canvas.width = containerEl.offsetWidth;
				canvas.height = containerEl.offsetHeight;
				this._emptyElement(containerEl);
				containerEl.appendChild(canvas);
				return canvas;
			}
		}, {
			key: '_drawBackground',
			value: function _drawBackground(canvas, tesseraWidth, tesseraHeight) {
				var xMod = canvas.offsetWidth % tesseraWidth;
				var yMod = canvas.offsetHeight % tesseraHeight;

				var fullCols = Math.floor(canvas.offsetWidth / tesseraWidth);
				var allCols = xMod > 0 ? fullCols + 2 : fullCols;

				var fullRows = Math.floor(canvas.offsetHeight / tesseraHeight);
				var allRows = yMod > 0 ? fullRows + 2 : fullRows;

				var posY = 0;

				for (var r = 0; r < allRows; r++) {
					var posX = 0;
					var actualHeight = tesseraHeight;
					if (r === 0 && yMod > 0) {
						actualHeight = Math.floor(yMod / 2);
					}
					if (r === allRows - 1 && yMod > 0) {
						actualHeight = Math.ceil(yMod / 2);
					}

					for (var c = 0; c < allCols; c++) {
						var actualWidth = tesseraWidth;
						if (c === 0 && xMod > 0) {
							actualWidth = Math.floor(xMod / 2);
						}
						if (c === allCols - 1 && xMod > 0) {
							actualWidth = Math.ceil(xMod / 2);
						}
						this._drawTessera(canvas, posX, posY, actualWidth, actualHeight);
						posX = posX + actualWidth;
					}
					posY = posY + actualHeight;
				}
			}
		}, {
			key: '_drawTessera',
			value: function _drawTessera(canvas, x, y, width, height) {
				var ctx = canvas.getContext('2d');
				ctx.fillStyle = this.getRandomColor();
				ctx.fillRect(x, y, width, height);
			}
		}, {
			key: 'getRandomColor',
			value: function getRandomColor() {
				return '#' + Math.floor(Math.random() * 16777215).toString(16);
			}
		}, {
			key: '_emptyElement',
			value: function _emptyElement(el) {
				while (el.firstChild) {
					el.removeChild(el.firstChild);
				}
			}
		}, {
			key: '_debounce',
			value: function _debounce(func, wait, immediate) {
				var timeout;
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
			}
		}]);

		return Tesserae;
	}();

		exports.default = Tesserae;

/***/ }
/******/ ]);
//# sourceMappingURL=tesserae.js.map