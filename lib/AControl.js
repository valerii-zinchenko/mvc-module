/*
 * MVCModule
 *
 * Copyright (c) 2016  Valerii Zinchenko
 *
 * See the file LICENSE.txt for copying permission (https://github.com/valerii-zinchenko/mvc-module/blob/master/LICENSE.txt).
 *
 * All source files are available at: http://github.com/valerii-zinchenko/mvc-module
 */

/**
 * @file It contains the implementation of [Abstract Control class]{@link AControl} creator.
 *
 * @see {@link AStateComponent}
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
 * @type {Class}
 *
 * @constructor
 */
var AControl = Class(AStateComponent, {
	/**
	 * Reference to the view.
	 */
	view: null,

	/**
	 * Control destructor.
	 */
	destruct: function() {
		this.view = null;
		AStateComponent.prototype.destruct.call(this);
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
