const Utils = require('./utils');

class Tessera {

	constructor ({x, y, width, height, hsl, hslArray}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hsl = Utils.arrayToHsl(hslArray);
		this.hslArray = hslArray;
		// true during initial draw
		this.isDrawing = false;
	}

	draw (ctx, animate) {
		if (animate && animate.enable !== false) {
			this.drawAnimated(ctx, animate.step);
		} else {
			ctx.fillStyle = this.hsl;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	drawAnimated (ctx, animateStep = 2) {
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
		requestAnimationFrame(() => {
			this.drawAnimated(ctx);
		});
	}

	animateToColor (ctx, newHslArray) {

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
			let frames = 40;
			// animation step array
			this._stepHsl = [];
			// hue step
			let hueDiff = this.hslArray[0] - this._curAnimateHslArray[0];
			let hueDiffAbs = Math.abs(hueDiff);
			let hueDiffSign = Utils.sign(this.hslArray[0] - this._curAnimateHslArray[0]);
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
		let stepH = this._curAnimateHslArray[0] + this._stepHsl[0];
		stepH = stepH > 360 ? stepH % 360 : (stepH < 0 ? 360 + stepH : stepH);
		let stepS = this._curAnimateHslArray[1] + this._stepHsl[1];
		let stepL = this._curAnimateHslArray[2] + this._stepHsl[2];
		this._curAnimateHslArray = [stepH, stepS, stepL];
		// next animation step
		requestAnimationFrame(() => {
			this.animateToColor(ctx, newHslArray);
		});
	}
}

module.exports = Tessera;
