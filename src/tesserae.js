import randomcolor from 'randomcolor';

class Tesserae {

	constructor ({
		// container selector
		container,
		// tessera width
		tesseraWidth = 30,
		// tessera height
		tesseraHeight = 30,
		// randomcolor lib options
		randomcolor = {
			hue: 'monochrome',
			luminosity: 'light'
		},
		// filter: false or object
		filter = {
			color: '#333',
			opacity: 0.6
		},
		// whether to animate the mosaic on show
		animate = false
	}) {

		// properties
		this.containerEl = document.querySelector(container);
		this.tesseraWidth = tesseraWidth;
		this.tesseraHeight = tesseraHeight;
		this.randomcolor = randomcolor;
		this.filter = filter;
		this.animate = animate;
		this.containerStyle = window.getComputedStyle(this.containerEl, null);

		// all drawn tessera shapes are stored here
		this.tesserae = [];

		// render version
		// NOTE: this is used to avoid issues with re-renders
		// while current animation has not finished yet
		this.renderVersion = 0;

		// init
		this.init();
	}

	init () {
		// lazy draw function (debounced)
		this.lazyDraw = this._debounce(this.draw, 200).bind(this);
		window.addEventListener('resize', this.lazyDraw);
		// draw for the first time
		this.draw();
	}

	destroy () {
		this._emptyContainer();
		this._restoreContainer();
		window.removeEventListener('resize', this.lazyDraw);
	}

	draw () {
		this.renderVersion++;

		this._editContainer();
		this._prepareCanvas();
		this._generateTesserae();
		this._addFilter();

		// gradually show tesserae in random order
		if (this.animate) {
			const clone = this._cloneShallow(this.tesserae);
			this._shuffle(clone);
			this._drawTesseraeAnimated(clone, 0, this.animate.step || 1, this.renderVersion);
		}
		// show all resserae at once
		else {
			this._drawTesserae(this.tesserae);
		}
	}

	_editContainer () {
		// if parent has a non-static position, make it relative
		if (this.containerStyle.getPropertyValue('position') === 'static') {
			this.containerEl.style.position = 'relative';
		}
		this.containerEl.style.boxSizing = 'border-box';
	}

	_restoreContainer () {
		// TODO: restore original position & box-sizing of container
	}

	_addFilter () {
		if (!this.filter || this.filterEl) {
			return;
		}

		// prepare element
		let filterEl = this.filterEl = document.createElement('div');
		filterEl.style.width = '100%';
		filterEl.style.height = '100%';
		filterEl.style.backgroundColor = this.filter.color;
		filterEl.style.opacity = this.filter.opacity;
		filterEl.style.position = 'absolute';
		filterEl.style.zIndex = 1;
		filterEl.style.top = 0;

		this.containerEl.appendChild(filterEl);
	}

	_prepareCanvas () {
		let cs = this.containerStyle;

		let elementHeight = this.containerEl.clientHeight;  // height with padding
		let elementWidth = this.containerEl.clientWidth;   // width with padding

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

	_generateTesserae () {
		let xMod = this.canvas.offsetWidth % this.tesseraWidth;
		let yMod = this.canvas.offsetHeight % this.tesseraHeight;

		let fullCols = Math.floor(this.canvas.offsetWidth / this.tesseraWidth);
		let allCols = xMod > 0 ? fullCols + 2 : fullCols;

		let fullRows = Math.floor(this.canvas.offsetHeight / this.tesseraHeight);
		let allRows = yMod > 0 ? fullRows + 2 : fullRows;

		// empty tesserae array
		this.tesserae.length = 0;

		let posY = 0;

		for (let r = 0; r < allRows; r++) {
			let posX = 0;
			let actualHeight = this.tesseraHeight;
			if (r === 0 && yMod > 0) {
				actualHeight = Math.floor(yMod / 2);
			}
			if (r === allRows - 1 && yMod > 0) {
				actualHeight = Math.ceil(yMod / 2);
			}

			for (let c = 0; c < allCols; c++) {
				let actualWidth = this.tesseraWidth;
				if (c === 0 && xMod > 0) {
					actualWidth = Math.floor(xMod / 2);
				}
				if (c === allCols - 1 && xMod > 0) {
					actualWidth = Math.ceil(xMod / 2);
				}
				let tessera = {
					x: posX,
					y: posY,
					width: actualWidth,
					height: actualHeight,
					color: this.getRandomColor()
				};
				this.tesserae.push(tessera);
				posX = posX + actualWidth;
			}
			posY = posY + actualHeight;
		}
	}

	_drawTesserae (tesserae) {
		for (let i = 0, len = tesserae.length; i < len; i++) {
			this._drawRect(tesserae[i]);
		}
	}

	_drawTesseraeAnimated (tesserae, i, step, renderVersion) {
		if (i in tesserae) {
			let s = step;
			while (s-- > 0) {
				this._drawRect(tesserae[i++]);
			}
			requestAnimationFrame(() => {
				if (renderVersion === this.renderVersion) {
					this._drawTesseraeAnimated(tesserae, i, step, renderVersion);
				}
			});
		}
	}

	_cloneShallow (array) {
		let clone = [];
		for (let i = 0, len = array.length; i < len; i++) {
			clone[i] = array[i];
		}
		return clone;
	}

	// Fisher-Yates shuffle
	_shuffle (array) {
	    let m = array.length,
	        t, i;

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
	}

	_drawRect (rect) {
		this.ctx.fillStyle = rect.color;
		this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
	}

	getRandomColor () {
		return randomcolor(this.randomcolor);
	}

	_emptyContainer () {
		let el = this.containerEl;
		while (el.firstChild) {
		    el.removeChild(el.firstChild);
		}
	}

	_getRandomInt (min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	_getRandomTessera () {
		return this.tesserae[this._getRandomInt(0, this.tesserae.length)];
	}

	_debounce (func, wait, immediate) {
		let timeout;
		return function() {
			let context = this, args = arguments;
			let later = function() {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			let callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	}
}

export default Tesserae;
