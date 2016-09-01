import Utils from 'utils';


class Tessera {

	constructor ({x, y, width, height, hsl, hslArray}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hsl = Utils.arrayToHsl(hslArray);
		this.hslArray = hslArray;
	}

	draw (ctx, animate) {
		if (animate && animate.enable) {
			this.drawAnimated(ctx, animate.step);
		} else {
			ctx.fillStyle = this.hsl;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	drawAnimated (ctx, animateStep = 2) {
		// initial animation step
		if (!this._hslStepArray) {
			this._hslStepArray = [this.hslArray[0], this.hslArray[1], 100];
		}

		// convert current step color to hsl string
		ctx.fillStyle = Utils.arrayToHsl(this._hslStepArray);
		// draw rectangle
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// stop condition
		if (this._hslStepArray[2] === this.hslArray[2]) {
			delete this._hslStepArray;
			return;
		}

		// calculate color for next step
		this._hslStepArray[2] = Math.max(this._hslStepArray[2] - animateStep, this.hslArray[2]);
		requestAnimationFrame(() => {
			this.drawAnimated(ctx);
		});
	}
}

export default Tessera;
