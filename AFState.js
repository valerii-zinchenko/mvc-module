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
 * @version 1.0.0
 */

'use strict';

/**
 * Abstract state factory.
 * It builds specified state depending on input state component.
 *
 * @throws {Error} Incorrect input arguments. Expected Function ViewConstructor, [Function ControlConstructor]
 *
 * @param {Function} ViewConstructor - Constructor for the view component.
 * @param {Function} [ControlConstructor] - Constructor for the control component.
 * @return {BState} State builder.
 */
function AFState(ViewConstructor, ControlConstructor) {
	if (!utils.is(ViewConstructor, 'Function') || (ControlConstructor && !utils.is(ControlConstructor, 'Function')) ) {
		throw new Error('Incorrect input arguments. Expected Function ViewConstructor, [Function ControlConstructor]');
	}

	/**
	 * State builder.
	 *
	 * @name BState
	 * @type {Function}
	 *
	 * @param {Object} model - Model object.
	 * @param {Object} [config] - State's configurations. These configuration will be set to the state\'s view and control components.
	 * @return {State}
	 */
	return function(model, config) {
		var view = new ViewConstructor(config);

		var control;
		if (ControlConstructor) {
			control = new ControlConstructor(config);
		}

		return new State(model, view, control);
	}
}
