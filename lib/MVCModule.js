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
 * @version 4.1.0
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
 * @param {Object} [envStateMap] - Map of environt name to a model's state name.
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

	/**
	 * Map of target environment name to a model's state name.
	 *
	 * @type {Object}
	 */
	envStateMap: {},

	// constructor
	initialize: function(model, states, envStateMap) {
		if (!utils.is(model, 'Object') || !utils.is(states, 'Object')) {
			throw new Error('Incorrect types of input arguments. Expected: Object model, Object states');
		}

		this.model = model;
		this.states = states;

		if (utils.is(envStateMap, 'Object')) {
			this.envStateMap = envStateMap;
		}
	},

	/**
	 * Get specific model's state.
	 *
	 * @param {String} stateName - State name.
	 * @param {String | [String]} [decorators] - State's decorators.
	 * @return {State | Null}
	 */
	getState: function(stateName, decorators) {
		var state = this.states[stateName];

		if (state && decorators) {
			state.decorateWith(decorators);
		}

		return state || null;
	},

	/**
	 * Get model's state based on a target environment.
	 *
	 * @param {String} env - Target environment.
	 * @param {String | [String]} [decorators] - State's decorators.
	 * @return {State | Null}
	 */
	getStateFor: function(env, decorators){
		return this.getState(this.envStateMap[env], decorators);
	}
});
