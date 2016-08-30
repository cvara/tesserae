
class Tesserae {

	constructor (opts) {
		this.options = opts;
		this.draw(opts);
		const lazyDraw = this._debounce(this.draw, 200).bind(this);
		this.resizehandler = (event) => {
			lazyDraw(opts);
		};
		window.addEventListener('resize', this.resizehandler);
	}

	destroy () {
		const containerEl = document.querySelector(this.options.container);
		this._emptyElement(containerEl);
		window.removeEventListener('resize', this.resizehandler);
	}

	draw ({
		container,
		tesseraWidth = 30,
		tesseraHeight = 30
	}) {
		const containerEl = document.querySelector(container);
		const canvas = this._createCanvas(containerEl);
		this._drawBackground(canvas, tesseraWidth, tesseraHeight);
	}

	_createCanvas (containerEl) {
		const canvas = document.createElement('canvas');
		canvas.id = 'tesserae';
		canvas.width = containerEl.offsetWidth;
		canvas.height = containerEl.offsetHeight;
		this._emptyElement(containerEl);
		containerEl.appendChild(canvas);
		return canvas;
	}

	_drawBackground (canvas, tesseraWidth, tesseraHeight) {
		let xMod = canvas.offsetWidth % tesseraWidth;
		let yMod = canvas.offsetHeight % tesseraHeight;

		let fullCols = Math.floor(canvas.offsetWidth / tesseraWidth);
		let allCols = xMod > 0 ? fullCols + 2 : fullCols;

		let fullRows = Math.floor(canvas.offsetHeight / tesseraHeight);
		let allRows = yMod > 0 ? fullRows + 2 : fullRows;

		let posY = 0;

		for (let r = 0; r < allRows; r++) {
			let posX = 0;
			let actualHeight = tesseraHeight;
			if (r === 0 && yMod > 0) {
				actualHeight = Math.floor(yMod / 2);
			}
			if (r === allRows - 1 && yMod > 0) {
				actualHeight = Math.ceil(yMod / 2);
			}

			for (let c = 0; c < allCols; c++) {
				let actualWidth = tesseraWidth;
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

	_drawTessera (canvas, x, y, width, height) {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = this.getRandomColor();
		ctx.fillRect(x, y, width, height);
	}

	getRandomColor () {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	}

	_emptyElement (el) {
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
