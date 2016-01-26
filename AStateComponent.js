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
 * @file It contains the implementation of [abstract state component]{@link AStateComponent} creator.
 *
 * @see {@link AState}
 * @see {@link AView}
 * @see {@link AControl}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract state component.
 * This class defines general properties and methods which will be used in each state component, like AView and AControl.
 *
 * @type {Class}
 *
 * @throws {Error} Model for the state is not defined
 *
 * @constructor
 * @param {Object} model - Model
 * @param {Object} [config] - Component's state's configurations.
 */
var AStateComponent = new Class({
	/**
	 * Reference to the model.
	 *
	 * @type {Objcet}
	 */
	model: null,

	/**
	 * Component's configurations.
	 *
	 * @type {Object}
	 */
	config: null,

	// constructor
	initialize: function(model, config) {
		if (!utils.is(model, 'Object')) {
			throw new Error('Model for the state is not defined');
		}

		this.model = model;

		if (config && utils.is(config, 'Object')) {
			this.config = config;
		}
	},

	/**
	 * Destructor.
	 */
	destruct: function() {
		this.model = null;
		this.config = null;
	},

	/**
	 * Connect view component to the module.
	 * This is called after constructor and setting of the model and control components.
	 *
	 * @abstract
	 */
	connect: function() {}
});
