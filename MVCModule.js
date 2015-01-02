/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

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
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * State.
 *
 * @note This is for documentation only.
 *
 * @name State
 * @type {Object}
 * @property {Function} View - View constructor
 * @property {Function} Control - Control constructor
 */

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
 * @throws {Error} Incorrect type of state "{state}"
 * @throws {Error} View constructor for state "{state}" is not defined
 * @throws {Error} Control constructor for state "{state}" is not defined
 * @throws {Error} construct property should be a function
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

    if (!MVCConstructors.states && !MVCConstructors.View && !MVCConstructors.Control) {
        throw new Error('No model states are defined');
    }
    if (!MVCConstructors.states) {
        MVCConstructors.states = {
            _default: {
                View: MVCConstructors.View,
                Control: MVCConstructors.Control
            }
        };
    }
    if (Object.prototype.toString.call(MVCConstructors.states) != '[object Object]') {
        throw new Error('Incorrect type for defined model states');
    }

    for (var state in MVCConstructors.states) {
        if (Object.prototype.toString.call(MVCConstructors.states[state]) != '[object Object]') {
            throw new Error('Incorrect type of state "' + state + '"');
        }

        ['View', 'Control'].forEach(function(component) {
            if (!MVCConstructors.states[state][component]) {
                throw new Error(component + ' constructor for state "' + state + '" is not defined');
            }
            if (Object.prototype.toString.call(MVCConstructors.states[state][component]) != '[object Function]') {
                throw new Error(component + ' constructor for state "' + state + '" should be a function');
            }
        });
    }

    if (MVCConstructors.construct && Object.prototype.toString.call(MVCConstructors.construct) != '[object Function]') {
        throw new Error('construct property should be a function');
    }


    /**
     * Module constructor.
     * This automates the creation of each sub-modules (Model, View, Control) and binding them for each other
     * to let know the each module about other sub-modules.
     *
     * @note This is just for documentation.
     *
     * @name ModuleConstructor
     * @constructor
     * @param {Object} [moduleArgs = {}] - Object of input arguments for each sub-module.
     * @param {*} [moduleArgs.model] - Input argument for Model sub-module.
     * @param {*} [moduleArgs.construct] - Input argument for module's construct().
     */
    return function(moduleArgs) {
        moduleArgs = moduleArgs || {};

        // Build each sub-module
        this.model = new MVCConstructors.Model(moduleArgs);
        this.states = {};
        for (var stateName in MVCConstructors.states) {
            var state = {
                view: new MVCConstructors.states[stateName].View(),
                control: new MVCConstructors.states[stateName].Control()
            };

            state.view.model = this.model;
            state.view.control = state.control;
            state.control.model = this.model;
            state.control.view = state.view;

            this.states[stateName] = state;
        }
        this.view = null;
        this.control = null;

        /**
         * Specify which state will be used.
         * this.view and this.control will point to the View and Control of specific model state.
         *
         * @param {string} stateName - State name.
         */
        this.useState = function(stateName) {
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

            this.view = state.view;
            this.control = state.control;
        };

        if (MVCConstructors.construct) {
            this.constructor.prototype.construct = MVCConstructors.construct;
            this.constructor.prototype.construct.apply(this, moduleArgs.construct);
        }

        if (this.states._default) {
            this.useState('_default');
        }
    }
}
