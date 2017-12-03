// polifill is from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs   = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP    = function() {},
			fBound  = function() {
				return fToBind.apply(this instanceof fNOP
					? this
					: oThis,
				aArgs.concat(Array.prototype.slice.call(arguments)));
			};

			if (this.prototype) {
				// native functions don't have a prototype
				fNOP.prototype = this.prototype;
			}
			fBound.prototype = new fNOP();

			return fBound;
	};
}


// Old PhantomJS (1.9.8) does not have the implementation for Element.prtotype.remove, so just define a dummy function for it, to be able to run tests from command line
Element.prototype.remove = Element.prototype.remove || function() {};
