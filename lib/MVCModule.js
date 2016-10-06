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
 * @file It contains the implementation of an [abstract MVC module]{@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 5.0.0
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
var MVCModule = Class(function(model, states, envStateMap) {
	if (!utils.is(model, 'Object') || !utils.is(states, 'Object')) {
		throw new Error('Incorrect types of input arguments. Expected: Object model, Object states');
	}

	this.model = model;
	this.states = states;

	if (utils.is(envStateMap, 'Object')) {
		this.envStateMap = envStateMap;
	}
}, {
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


	/**
	 * Get specific model's state.
	 *
	 * @param {String} stateName - State name.
	 * @param {String | String[]} [decorators] - State's decorators.
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
	 * @param {String | String[]} [decorators] - State's decorators.
	 * @return {State | Null}
	 */
	getStateFor: function(env, decorators){
		return this.getState(this.envStateMap[env], decorators);
	}
});
