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
 * @file It contains the implementation of [Dynamic View class]{@link DynamicView} creator.
 *
 * @see {@link AStateComponent}
 * @see {@link AView}
 * @see {@link StaticView}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

'use strict';


/**
 * Dynamic view.
 * It implements parent's [render()]{@link render} method to dynamically process template, initalize required elements and attach eventh.
 *
 * @type {Class}
 *
 * @constructor
 */
var DynamicView = new Class(AView, {
	/**
	 * Main template.
	 *
	 * @type {string}
	 */
	template: '',

	/**
	 * Render the view.
	 *
	 * @throws {Error} Model is not connected
	 *
	 * @returns {jQueryDOMElement}
	 */
	render: function() {
		if (!this.model) {
			throw new Error('Model is not connected');
		}

		this._processTemplate();
		this._initElements();
		this._attachEvents();

		return this.$el;
	},

	/**
	 * Process view template and set the proceiing result to the [main view element]{@link $el}.
	 * The Model will be set to the template processor.
	 */
	_processTemplate: function() {
		this.$el = $(_.template(this.template)(this.model));
	}
});
