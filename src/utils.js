import randomcolor from 'randomcolor';

const Utils = {};


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



export default Utils;
