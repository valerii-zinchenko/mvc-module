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
 * @version 1.0.0
 */

'use strict';

/**
 * States.
 * Array-like object of model states.
 *
 * @note This is for documentation only.
 *
 * @name States
 * @type {Object}
 * @property {State} stateName - Object of constructors for state with name "stateName"
 */


/**
 * MVC module abstract factory.
 *
 * @throws {Error} Incorrect type of input argumen. Expected: Object MVCConstructors
 * @throws {Error} Model constructor should be a function
 * @throws {Error} No model states are defined
 * @throws {Error} Incorrect type for defined model states
 * @throws {Error} Incorrect type of a state "{state}", Function expected
 *
 * @param {Object} MVCConstructors - Object of constructors for each sub-module
 * @param {ClassConstructor} MVCConstructors.Model - Constructor for Model
 * @param {Object} MVCConstructors.states - Model states, where key is a state name and vaule is a state factory. See [AFState]{@link AFState}
 * @param {ClassConstructor} [MVCConstructors.View] - Constructor for View. Usefull for modules with single state (without defining "states")
 * @param {ClassConstructor} [MVCConstructors.Control] - Constructor for Control. Usefull for modules with single state (without defining "states")
 * @return {BMVCModule}
 */
function AFMVCModule(MVCConstructors) {
	if (!utils.is(MVCConstructors, 'Object')) {
		throw new Error('Incorrect type of an input argument. Expected: Object MVCConstructors');
	}

	if (!utils.is(MVCConstructors.Model, 'Function')) {
		throw new Error('Model constructor should be a function');
	}

	if (!MVCConstructors.states && !MVCConstructors.View) {
		throw new Error('No model states are defined');
	}
	if (!MVCConstructors.states) {
		MVCConstructors.states = {
			_implicit: AFState(MVCConstructors.View, MVCConstructors.Control)
		};
	}
	if (!utils.is(MVCConstructors.states, 'Object')) {
		throw new Error('Incorrect type for defined model states');
	}

	for (var state in MVCConstructors.states) {
		if (!utils.is(MVCConstructors.states[state], 'Function')) {
			throw new Error('Incorrect type of a state "' + state + '", Function expected');
		}
	}


	/**
	 * Module builder.
	 * This automates the creation of each sub-modules (Model, View, Control) and binding them for each other
	 * to let know the each module about other sub-modules.
	 *
	 * @name BMVCModule
	 * @type {Function}
	 *
	 * @param {Array} modelArgs - Input arguments for a Model.
	 * @param {Object} statesConfigs - Model's states' configurations, where a key should be a state name and a value should be a state configuration.
	 */
	return function(modelArgs, statesConfigs) {
		// Build model
		var model = new ( MVCConstructors.Model.bind.apply(MVCConstructors.Model, [null].concat(modelArgs)) );
		var states = {};

		// Build model states
		var config;
		for (var stateName in MVCConstructors.states) {
			config = statesConfigs ? statesConfigs[stateName] : undefined;
			states[stateName] = new MVCConstructors.states[stateName](model, config);
		}

		return new MVCModule(model, states);
	};
}
