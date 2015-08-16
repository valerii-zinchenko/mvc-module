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
 * @file It contains the implementation of [MVC module builder]{@link MVCModule}
 *
 * @requires underscore.js
 *
 * @author Valerii Zinchenko
 *
 * @version 2.1.0
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
 * @property {AState} stateName - Object of constructors for state with name "stateName"
 */

/**
 * MVC module factory.
 *
 * @constructor
 * @param {Object} MVCConstructors - Object of constructors for each sub-module
 * @param {ClassConstructor} MVCConstructors.Model - Constructor for Model
 * @param {States} states - Define model states. Each state should be an object and have the constructor for view and control
 * @param {ClassConstructor} [MVCConstructors.View] - Constructor for View. Usefull for modules with single state (without defining "states")
 * @param {ClassConstructor} [MVCConstructors.Control] - Constructor for Control. Usefull for modules with single state (without defining "states")
 * @param {Function} [MVCConstructors.construct] - Module constructor function. It is called after preparing of sub-modules.
 * @return {ModuleConstructor}
 *
 * @throws {Error} Incorrect amount of input arguments
 * @throws {Error} Incorrect type of input argument
 * @throws {Error} Constructor for Model is not defined
 * @throws {Error} Model constructor should be a function
 * @throws {Error} No model states are defined
 * @throws {Error} Incorrect type for defined model states
 * @throws {Error} Incorrect type of state "{state}", Function expected
 */
function MVCModule(MVCConstructors) {
    if (arguments.length != 1) {
        throw new Error('Incorrect amount of input arguments');
    }
    if (Object.prototype.toString.call(MVCConstructors) != '[object Object]') {
        throw new Error('Incorrect type of input argument');
    }
    if (!MVCConstructors.Model) {
        throw new Error('Constructor for Model is not defined');
    }

    if (Object.prototype.toString.call(MVCConstructors.Model) != '[object Function]') {
        throw new Error('Model constructor should be a function');
    }

    if (!MVCConstructors.states && !MVCConstructors.View) {
        throw new Error('No model states are defined');
    }
    if (!MVCConstructors.states) {
        MVCConstructors.states = {
            _default: new AState(MVCConstructors.View, MVCConstructors.Control)
        };
    }
    if (Object.prototype.toString.call(MVCConstructors.states) != '[object Object]') {
        throw new Error('Incorrect type for defined model states');
    }

    for (var state in MVCConstructors.states) {
        if (Object.prototype.toString.call(MVCConstructors.states[state]) != '[object Function]') {
            throw new Error('Incorrect type of state "' + state + '", Function expected');
        }
    }


    /**
     * Module constructor.
     * This automates the creation of each sub-modules (Model, View, Control) and binding them for each other
     * to let know the each module about other sub-modules.
     *
     * @note This is just for documentation.
     *
     * @constructor
     * @param {[*]} [arguments] - Input arguments for Model.
     */
    var ModuleConstructor = function() {
        var args = Array.prototype.slice.call(arguments);

        // Build model
        this.model = new (_.bind.apply(null, [MVCConstructors.Model, null].concat(args)));

        // Build model states
        this.states = {};
		var state;
        for (var stateName in MVCConstructors.states) {
			this.states[stateName] = new MVCConstructors.states[stateName](this.model);
        }

        if (this.states._default) {
            return this.useState('_default');
        }
    }

	/**
	 * Specify which state will be used.
	 * this.view and this.control will point to the View and Control of specific model state.
	 *
	 * @param {string} stateName - State name.
	 * @return {AState}
	 */
	ModuleConstructor.prototype.useState = function(stateName) {
		if (arguments.length != 1) {
			throw new Error('Incorrect amount of input arguments');
		}
		if (typeof stateName != 'string') {
			throw new Error('Incorrect type of input argument');
		}

		var state = this.states[stateName];
		if (!state) {
			throw new Error('Undefined state "' + stateName + '"');
		}

		return state;
	};

	return ModuleConstructor;
}
