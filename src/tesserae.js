const Tessera = require('./tessera');
const Utils = require('./utils');

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
			color: '#000',
			opacity: 0.6
		},
		// gradual: false or object
		gradual = {
			enable: true,
			step: 10
		},
		// animate: false or object
		animate = {
			enable: true,
			step: 2
		},
		// periodically change color of random tiles
		live = {
			enable: true,
			minInterval: 50,
			maxInterval: 500
		}
	}) {

		// container is the only required parameter
		if (!container) {
			throw 'Tesserae Error: container option is missing.';
		}

		// properties
		this.containerEl = document.querySelector(container);

		// make sure container selector gives an existing dom element
		if (!this.containerEl) {
			throw `Tesserae Error: no container element found: ${container}`;
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
			let min = parseInt(live.minInterval, 10) || 50;
			let max = parseInt(live.maxInterval, 10) || 500;
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

	_init () {
		// know when windows loses focus
		this._initBlurMonitor();
		// lazy draw function (debounced)
		this.lazyDraw = Utils.debounce(this.draw, 200).bind(this);
		window.addEventListener('resize', this.lazyDraw);
		// draw for the first time
		this.draw();
	}

	_initBlurMonitor () {
		this.hasFocus = true;
		window.onblur = () => {
			this.hasFocus = false;
		};
		window.onfocus = () => {
			this.hasFocus = true;
		};
	}

	destroy () {
		this._emptyContainer();
		this._restoreContainer();
		clearTimeout(this.animateTimer);
		this.tesserae.length = 0;
		window.removeEventListener('resize', this.lazyDraw);
	}

	draw () {
		this.renderVersion++;

		this._editContainer();
		this._prepareCanvas();
		this._generateTesserae();
		this._addFilter();

		// gradually show tesserae in random order
		if (this.gradual && this.gradual.enable !== false) {
			const clone = Utils.cloneArrayShallow(this.tesserae);
			Utils.shuffle(clone);
			this._drawTesseraeGradually(clone, 0, this.gradual.step || 1, this.renderVersion);
		}
		// show all tesserae at once
		else {
			this._drawTesserae(this.tesserae);
		}

		// start animating random tesserae
		if (this.live && this.live.enable !== false) {
			// calculate batch size based on total number of tiles
			let batch = Math.max(1, Math.floor(this.tesserae.length / 200));
			this._animateRandomTessera(batch);
		}
	}

	_animateRandomTessera (batch) {
		let n = batch;
		const { getRandomColor, getRandomInt } = Utils;
		this.animateTimer = setTimeout(() => {
			// don't stack animations when window is not focused
			if (this.hasFocus) {
				while (n-- > 0) {
					const randomTessera = this._getRandomTessera();
					randomTessera.animateToColor(this.ctx, getRandomColor(this.randomcolor, 'hslArray'));
				}
			}
			this._animateRandomTessera(batch);
		}, getRandomInt(this.live.minInterval, this.live.maxInterval));
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
				let tessera = new Tessera({
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

	_drawTesserae (tesserae) {
		for (let i = 0, len = tesserae.length; i < len; i++) {
			tesserae[i].draw(this.ctx, this.animate);
		}
	}

	_drawTesseraeGradually (tesserae, i, step, renderVersion) {
		if (i in tesserae) {
			let s = step;
			while (s-- > 0 && tesserae[i]) {
				tesserae[i++].draw(this.ctx, this.animate);
			}
			requestAnimationFrame(() => {
				if (renderVersion === this.renderVersion) {
					this._drawTesseraeGradually(tesserae, i, step, renderVersion);
				}
			});
		}
	}

	_emptyContainer () {
		let el = this.containerEl;
		while (el.firstChild) {
		    el.removeChild(el.firstChild);
		}
	}

	_getRandomTessera () {
		return this.tesserae[Utils.getRandomInt(0, this.tesserae.length)];
	}
}

module.exports = Tesserae;
