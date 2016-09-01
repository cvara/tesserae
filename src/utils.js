import randomcolor from 'randomcolor';

const Utils = window.Utils = {};


// Returns debounced version of function
// Code borrowed from underscore:
// http://underscorejs.org/docs/underscore.html#section-83
Utils.debounce = function(func, wait, immediate) {
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
};


// Returns random int between min (inclusive) and max (exclusive)
Utils.getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};


// Returns random color using a random color generator
// see: https://github.com/davidmerfield/randomColor
Utils.getRandomColor = function(opts) {
	return randomcolor(opts);
};


// Fisher-Yates shuffle
Utils.shuffle = function(array) {
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
};


// Returns shallow clone of array
Utils.cloneArrayShallow = function(array) {
    let clone = [];
    for (let i = 0, len = array.length; i < len; i++) {
        clone[i] = array[i];
    }
    return clone;
};


// Returns rgb representation of a hex color code
Utils.hexToRgb = function(hex) {
    let rgb = [];
    let fail = false;
    const original = hex;

    hex = hex.replace(/#/, '');

    if (hex.length === 3) {
        hex = hex + hex;
    }

    for (let i = 0; i < 6; i += 2) {
        rgb.push(parseInt(hex.substr(i, 2), 16));
        fail = fail || rgb[rgb.length - 1].toString() === 'NaN';
    }

	return !fail && rgb;
};


// Returns hsl representation of an rgb color code
Utils.rgbToHsl = function(r, g, b) {

    r /= 255;
	g /= 255;
	b /= 255;

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
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

    return [(h * 100 + 0.5) | 0, ((s * 100 + 0.5) | 0) + '%', ((l * 100 + 0.5) | 0) + '%'];
};


// Returns hsl representation of a hex color code
Utils.hexToHsl = function(hex) {
	return Utils.rgbToHsl(...Utils.hexToRgb(hex));
};

// Returns array representation of an hsl color string
Utils.arrayToHsl = function(array) {
	return `hsl(${array[0]},${array[1]}%,${array[2]}%)`;
};



export default Utils;
