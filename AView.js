/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/

/**
 * @file It contains the implementation of [Abstract View class]{@link AView} creator.
 *
 * @see {@link AStateComponent}
 * @see {@link StaticView}
 * @see {@link DynamicView}
 * @see {@link Class}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';


/**
 * Abstract View.
 * It defines all required conpoments and methods for better and faster developing of specific views.
 *
 * @type {Class}
 *
 * @constructor
 */
var AView = new Class(AStateComponent, {
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

		AStateComponent.prototype.destruct.call(this);
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
