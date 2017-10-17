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
 * @file It contains the implementation of an [abstract MVC module]{@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 5.0.0
 */

'use strict';


/**
 * Abstract MVC module.
 * It combines and control model and its modes.
 *
 * @class
 * @param {Object} model - Model.
 * @param {Object} modes - Object of model's modes, where the key is a mode name and value is a mode object.
 * @param {Object} [envModeMap] - Map of environt name to a model's mode name.
 *
 * @throws {Error} Incorrect types of input arguments. Expected: Object model, Object modes
 */
var MVCModule = Class(function(model, modes, envModeMap) {
	if (!utils.is(model, 'Object') || !utils.is(modes, 'Object')) {
		throw new Error('Incorrect types of input arguments. Expected: Object model, Object modes');
	}

	this.model = model;
	this.modes = modes;

	if (utils.is(envModeMap, 'Object')) {
		this.envModeMap = envModeMap;
	}
}, /** @lends MVCModule.prototype */{
	/**
	 * Module's model
	 *
	 * @type {Object}
	 */
	model: null,

	/**
	 * Collection of model's modes
	 *
	 * @type {Object}
	 */
	modes: null,

	/**
	 * Map of target environment name to a model's mode name.
	 *
	 * @type {Object}
	 */
	envModeMap: {},


	/**
	 * Get specific model's mode.
	 *
	 * @param {String} modeName - Mode name.
	 * @param {String | String[]} [decorators] - Mode's decorators.
	 * @return {Mode | Null}
	 */
	getMode: function(modeName, decorators) {
		var mode = this.modes[modeName];

		if (mode && decorators) {
			mode.decorateWith(decorators);
		}

		return mode || null;
	},

	/**
	 * Get model's mode based on a target environment.
	 *
	 * @param {String} env - Target environment.
	 * @param {String | String[]} [decorators] - Mode's decorators.
	 * @return {Mode | Null}
	 */
	getModeFor: function(env, decorators){
		return this.getMode(this.envModeMap[env], decorators);
	}
});
