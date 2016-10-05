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
