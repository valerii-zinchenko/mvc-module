/*
 * mvc-pack
 *
 * Copyright (c) 2016-2017 Valerii Zinchenko
 *
 * Licensed under MIT (http://valerii-zinchenko.github.io/mvc-pack/blob/master/LICENSE.txt)
 *
 * All source files are available at: http://github.com/valerii-zinchenko/mvc-pack
 */

/**
 * @file It contains the implementation of [Abstract Control class]{@link AControl} creator.
 *
 * @see {@link AModeComponent}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract Control.
 * It defines all required conpoments and methods for better and faster developing of specific control.
 *
 * @class
 * @extends AModeComponent
 */
var AControl = Class(AModeComponent, null, /** @lends AControl.prototype */{
	/**
	 * Reference to the view.
	 */
	view: null,

	/**
	 * Control destructor.
	 */
	destruct: function() {
		this.view = null;
		AModeComponent.prototype.destruct.call(this);
	},

	/**
	 * Set view
	 *
	 * @param {Object} view - View
	 *
	 * @throws {Error} Incorrect type of view component
	 */
	setView: function(view) {
		if (!(view instanceof AView)) {
			throw new Error('Incorrect type of view component');
		}

		this.view = view;
	}
});
