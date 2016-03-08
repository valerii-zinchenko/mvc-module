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
 * @file It contains the implementation of [abstract state factory]{@link AFState} that returns [state builder]{@link BState}.
 *
 * @see {@link BState}
 * @see {@link State}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract state factory.
 * It builds specified state depending on input state component.
 *
 * @throws {Error} Incorrect type of the constructors. Object expected.
 * @throws {Error} Incorrect type of a view\'s constructor. Expected: Function
 * @throws {Error} Incorrect type of a control\'s constructor. Expected: Function
 *
 * @param {Object} Constructors - Collection of constructors for a state.
 * @param {Function} Constructors.View - Constructor for the view component.
 * @param {Function} [Constructors.Control] - Constructor for the control component.
 * @param {Object} [Constructors.Decorators] - Map of decorators' names and decorators' construstors for a new state. If some constructor is not a function, then it will be skipped in order to avoid NPE
 * @return {BState} State builder.
 */
function AFState(Constructors) {
	if (!utils.is(Constructors, 'Object')) {
		throw new Error('Incorrect type of the constructors. Object expected.');
	}
	if (!utils.is(Constructors.View, 'Function')) {
		throw new Error('Incorrect type of a view\'s constructor. Expected: Function');
	}
	if (Constructors.Control && !utils.is(Constructors.Control, 'Function')) {
		throw new Error('Incorrect type of a control\'s constructor. Expected: Function');
	}

	/**
	 * State builder.
	 *
	 * @name BState
	 * @type {Function}
	 *
	 * @param {Object} model - Model object.
	 * @param {Object} [config] - State's configurations. These configuration will be set to the state's view and control components.
	 * @return {State}
	 */
	return function(model, config) {
		var view = new Constructors.View(config);

		var decorators;
		if (Constructors.Decorators && utils.is(Constructors.Decorators, 'Object')) {
			decorators = {};
			for (var key in Constructors.Decorators) {
				if (utils.is(Constructors.Decorators[key], 'Function')) {
					decorators[key] = new Constructors.Decorators[key](config);
				} else {
					console.warn('Incompatible decorator\'s constructor: "' + key + '"! It should be inherited from an ADecorator');
				}
			}
		}

		var control;
		if (Constructors.Control) {
			control = new Constructors.Control(config);
		}

		return new State({
			model: model,
			view: view,
			decorators: decorators,
			control: control,
			config: config
		});
	}
}
