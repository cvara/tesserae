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
			color: 'red',
			opacity: 0.2
		}
	}) {
		// properties
		this.containerEl = document.querySelector(container);
		this.tesseraWidth = tesseraWidth;
		this.tesseraHeight = tesseraHeight;
		this.randomcolor = randomcolor;
		this.filter = filter;
		this.containerStyle = window.getComputedStyle(this.containerEl, null);
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
		this.restoreContainer();
		window.removeEventListener('resize', this.lazyDraw);
	}

	draw () {
		this._editContainer();
		this.canvas = this._createCanvas();
		this._drawBackground();
		this._addFilter();
	}

	_editContainer () {
		// if parent has a non-static position, make it relative
		if (this.containerStyle.getPropertyValue('position') === 'static') {
			this.containerEl.style.position = 'relative';
		}
		this.containerEl.style.boxSizing = 'border-box';
	}

	restoreContainer () {

	}

	_addFilter () {
		if (!this.filter) {
			return;
		}

		// prepare element
		let filterEl = document.createElement('div');
		filterEl.style.width = '100%';
		filterEl.style.height = '100%';
		filterEl.style.backgroundColor = this.filter.color;
		filterEl.style.opacity = this.filter.opacity;
		filterEl.style.position = 'absolute';
		filterEl.style.zIndex = 1;
		filterEl.style.top = 0;

		this.containerEl.appendChild(filterEl);
	}

	_createCanvas () {
		let cs = getComputedStyle(this.containerEl);

		let elementHeight = this.containerEl.clientHeight;  // height with padding
		let elementWidth = this.containerEl.clientWidth;   // width with padding

		elementHeight -= parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
		elementWidth -= parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

		console.log(cs.getPropertyValue('width'));
		const canvas = document.createElement('canvas');
		canvas.id = 'tesserae';
		canvas.width = elementWidth;
		canvas.height = elementHeight;
		this._emptyContainer();
		this.containerEl.appendChild(canvas);
		return canvas;
	}

	_drawBackground () {
		let xMod = this.canvas.offsetWidth % this.tesseraWidth;
		let yMod = this.canvas.offsetHeight % this.tesseraHeight;

		let fullCols = Math.floor(this.canvas.offsetWidth / this.tesseraWidth);
		let allCols = xMod > 0 ? fullCols + 2 : fullCols;

		let fullRows = Math.floor(this.canvas.offsetHeight / this.tesseraHeight);
		let allRows = yMod > 0 ? fullRows + 2 : fullRows;

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
				this._drawTessera(this.canvas, posX, posY, actualWidth, actualHeight);
				posX = posX + actualWidth;
			}
			posY = posY + actualHeight;
		}
	}

	_drawTessera (canvas, x, y, width, height) {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = this.getRandomColor();
		ctx.fillRect(x, y, width, height);
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

	_debounce (func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
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
}

export default Tesserae;
