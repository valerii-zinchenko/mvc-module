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
 * @file It contains the implementation of an [abstract factory of MVC modules]{@link AFMVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract MVC module factory.
 * Result of a factory is a builder function.
 *
 * @throws {Error} Incorrect type of an input argument. Expected: Object MVCConstructors
 * @throws {Error} Model constructor should be a function
 * @throws {Error} Incorrect type for model's states
 * @throws {Error} Incorrect type of a state "{state}", Function expected
 *
 * @param {Object} MVCConstructors - Module's constructors
 * @param {Function} MVCConstructors.Model - Model's constructor
 * @param {Object} MVCConstructors.States - States' constructors, where key is a state name and vaule is a stste's constructor
 * @param {Function} [MVCConstructors.Module = MVCModule] - Module's constructor. In case when this is not a function constructor of MVCModule will be used.
 * @return {Function} Module builder
 */
function AFMVCModule(MVCConstructors) {
	if (!utils.is(MVCConstructors, 'Object')) {
		throw new Error('Incorrect type of an input argument. Expected: Object MVCConstructors');
	}

	if (!utils.is(MVCConstructors.Model, 'Function')) {
		throw new Error('Model constructor should be a function');
	}

	if (!utils.is(MVCConstructors.States, 'Object')) {
		throw new Error('Incorrect type for model\'s states');
	}

	for (var state in MVCConstructors.States) {
		if (!utils.is(MVCConstructors.States[state], 'Function')) {
			throw new Error('Incorrect type of a state "' + state + '", Function expected');
		}
	}

	if (!utils.is(MVCConstructors.Module, 'Function')) {
		MVCConstructors.Module = MVCModule;
	}

	/**
	 * Module builder.
	 *
	 * @param {Array} modelArgs - Input arguments for a Model.
	 * @param {Object} statesConfigs - Model's states' configurations, where a key should be a state name and a value should be a state configuration.
	 * @return {Object} New module
	 */
	return function(modelArgs, statesConfigs) {
		// Build model
		var model = new ( MVCConstructors.Model.bind.apply(MVCConstructors.Model, [null].concat(modelArgs)) )();

		// Build model's states
		var states = {};
		var config;
		for (state in MVCConstructors.States) {
			if (statesConfigs) {
				config = statesConfigs[state];
			}

			states[state] = new MVCConstructors.States[state](model, config);
		}

		return new MVCConstructors.Module(model, states);
	}
};
