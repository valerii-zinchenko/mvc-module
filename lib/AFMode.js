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
 * @file It contains the implementation of [abstract mode factory]{@link AFMode} that returns [mode builder]{@link BMode}.
 *
 * @see {@link BMode}
 * @see {@link Mode}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract mode factory.
 * It builds specified mode depending on input mode component.
 *
 * @throws {Error} Incorrect type of the constructors. Object expected.
 * @throws {Error} Incorrect type of a view\'s constructor. Expected: Function
 * @throws {Error} Incorrect type of a control\'s constructor. Expected: Function
 *
 * @param {Object} Constructors - Collection of constructors for a mode.
 * @param {Function} Constructors.View - Constructor for the view component.
 * @param {Function} [Constructors.Control] - Constructor for the control component.
 * @param {Object} [Constructors.Decorators] - Map of decorators' names and decorators' construstors for a new mode. If some constructor is not a function, then it will be skipped in order to avoid NPE
 * @return {BMode} Mode builder.
 */
function AFMode(Constructors) {
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
	 * Mode builder.
	 *
	 * @name BMode
	 * @type {Function}
	 *
	 * @param {Object} model - Model object.
	 * @param {Object} [config] - Mode's configurations. These configuration will be set to the mode's view and control components.
	 * @return {Mode}
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

		return new Mode({
			model: model,
			view: view,
			decorators: decorators,
			control: control,
			config: config
		});
	}
}
