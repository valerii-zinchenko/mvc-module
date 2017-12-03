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
 * @file It contains the implementation of [Abstract View class]{@link AView} creator.
 *
 * @see {@link AModeComponent}
 * @see {@link StaticView}
 * @see {@link DynamicView}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 3.1.0
 */

'use strict';


/**
 * Abstract View.
 * It defines all required components and methods for better and faster developing of specific views.
 *
 * @class
 * @extends AModeComponent
 */
var AView = Class(AModeComponent, null, /** @lends AView.prototype */{
	/**
	 * Reference to the control.
	 */
	control: null,

	/**
	 * View destructor.
	 */
	destruct: function() {
		this.control = null;

		AModeComponent.prototype.destruct.call(this);
	},

	/**
	 * Set control
	 *
	 * @param {Object} control - Control
	 *
	 * @throws {Error} Incorrect type of control component
	 */
	setControl: function(control) {
		if (!(control instanceof AControl)) {
			throw new Error('Incorrect type of control component');
		}

		this.control = control;
	},

	/**
	 * Render the view.
	 *
	 * @abstract
	 *
	 * @returns {HTMLElement | HTMLElement[]}
	 */
	render: function() {},

	/**
	 * Update view.
	 */
	update: function() {},

	/**
	 * Initialize required for view elements.
	 */
	_initElements: function() {},

	/**
	 * Attach event listeners.
	 */
	_attachEvents: function() {}
});
