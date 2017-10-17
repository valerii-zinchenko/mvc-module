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
 * @version 3.0.0
 */

'use strict';


/**
 * Abstract View.
 * It defines all required conpoments and methods for better and faster developing of specific views.
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
	 * Main view element.
	 *
	 * @type {DOMElement}
	 */
	$el: null,

	/**
	 * View destructor.
	 */
	destruct: function() {
		this.$el.remove();
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
	 * @returns {jQueryDOMElement}
	 *
	 * @abstract
	 *
	 * @see {@link update}
	 */
	render: function() {},

	/**
	 * Update view.
	 *
	 * @abstract
	 */
	update: function() {},

	/**
	 * Show view.
	 * Remove "hidden" class.
	 */
	show: function() {
		this.$el.removeClass('hidden');
	},

	/**
	 * Hide view.
	 * Add "hidden" class.
	 */
	hide: function() {
		this.$el.addClass('hidden');
	},

	/**
	 * Initialize required for view elements.
	 *
	 * @abstract
	 */
	_initElements: function() {},

	/**
	 * Attach event listeners.
	 *
	 * @abstract
	 */
	_attachEvents: function() {}
});
