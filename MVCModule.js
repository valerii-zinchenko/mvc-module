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
 * @file It contains the implementation of an [abstract MVC module]{@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 4.0.0
 */

'use strict';


/**
 * Abstract MVC module.
 * It combines and control model and its states.
 *
 * @type {Class}
 *
 * @throws {Error} Incorrect types of input arguments. Expected: Object model, Object states
 *
 * @constructor
 * @param {Object} model - Model.
 * @param {Object} states - Object of model's states, where the key is a state name and value is a state object.
 */
var MVCModule = new Class({
	/**
	 * Module's model
	 *
	 * @type {Object}
	 */
	model: null,

	/**
	 * Collection of model's states
	 *
	 * @type {Object}
	 */
	states: null,

	// constructor
	initialize: function(model, states) {
		if (!utils.is(model, 'Object') || !utils.is(states, 'Object')) {
			throw new Error('Incorrect types of input arguments. Expected: Object model, Object states');
		}

		this.model = model;
		this.states = states;
	},

	/**
	 * Get specific model's state.
	 *
	 * @throws {Error} Incorrect type of the input argument. Expected: String stateName
	 * @throws {Error} Undefined state "{stateName}"
	 *
	 * @param {String} stateName - State name
	 * @return {State}
	 */
	getState: function(stateName) {
		if (!utils.is(stateName, 'String')) {
			throw new Error('Incorrect type of the input argument. Expected: String stateName');
		}

		var state = this.states[stateName];
		if (!state) {
			throw new Error('Undefined state "' + stateName + '"');
		}

		return state;
	}
});
