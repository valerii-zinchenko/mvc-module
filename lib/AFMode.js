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
 * @file It contains the implementation of [abstract mode factory]{@link AFMode} that returns [mode builder]{@link FMode}.
 *
 * @see {@link FMode}
 * @see {@link Mode}
 *
 * @author Valerii Zinchenko
 *
 * @version 4.0.0
 */

'use strict';

/**
 * Abstract mode factory.
 * It builds specified mode depending on input mode component.
 *
 * @throws {Error} Incorrect type of the constructors. Object expected.
 *
 * @param {Object} Constructors - Collection of constructors for a mode.
 * @param {Function} Constructors.View - Constructor for the view component.
 * @param {Function} [Constructors.Control] - Constructor for the control component.
 * @param {Object} [Constructors.Decorators] - Map of decorators' names and decorators' constructors for a new mode. If some constructor is not a function, then it will be skipped in order to avoid NPE
 * @return {FMode} Mode factory.
 */
function AFMode(Constructors) {
	if (!utils.is(Constructors, 'Object')) {
		throw new Error('Incorrect type of the constructors. Object expected.');
	}

	/**
	 * Mode factory.
	 *
	 * @name FMode
	 * @type {Function}
	 *
	 * @param {Object} model - Model object.
	 * @param {Object} [config] - Mode's configurations. These configuration will be set to the mode's view and control components.
	 * @return {Mode}
	 */
	return function(model, config) {
		return new Mode({
			model: model,
			View: Constructors.View,
			Control: Constructors.Control,
			Decorators: Constructors.Decorators,
			config: config
		});
	}
}
