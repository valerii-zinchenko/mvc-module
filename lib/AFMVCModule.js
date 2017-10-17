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
 * @file It contains the implementation of an [abstract factory of MVC modules]{@link AFMVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.1.0
 */

'use strict';

/**
 * Abstract MVC module factory.
 * Result of a factory is a builder function.
 *
 * @throws {Error} Incorrect type of an input argument. Expected: Object MVCConstructors
 * @throws {Error} Model constructor should be a function
 * @throws {Error} Incorrect type for model's modes
 * @throws {Error} Incorrect type of a mode "{mode}", Function expected
 *
 * @param {Object} MVCConstructors - Module's constructors
 * @param {Function} MVCConstructors.Model - Model's constructor
 * @param {Object} MVCConstructors.Modes - Modes' constructors, where key is a mode name and vaule is a stste's constructor
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

	if (!utils.is(MVCConstructors.Modes, 'Object')) {
		throw new Error('Incorrect type for model\'s modes');
	}

	for (var item in MVCConstructors.Modes) {
		if (!utils.is(MVCConstructors.Modes[item], 'Function')) {
			throw new Error('Incorrect type of a mode "' + item + '", Function expected');
		}
	}

	if (!utils.is(MVCConstructors.Module, 'Function')) {
		MVCConstructors.Module = MVCModule;
	}

	/**
	 * Module builder.
	 *
	 * @param {Array} modelArgs - Input arguments for a Model.
	 * @param {Object} [envModeMap] - Map of environment name to a model's mode name.
	 * @param {Object} [configs] - Model's modes' configurations, where a key should be a mode name and a value should be a mode configuration.
	 * @return {Object} New module.
	 */
	return function(modelArgs, envModeMap, configs) {
		// Build model
		var model = new ( MVCConstructors.Model.bind.apply(MVCConstructors.Model, [null].concat(modelArgs)) )();

		// Build model's modes
		var modes = {};
		var config;
		for (var item in MVCConstructors.Mode) {
			if (configs) {
				config = configs[item];
			}

			modes[mode] = new MVCConstructors.Modes[mode](model, config);
		}

		return new MVCConstructors.Module(model, modes, envModeMap);
	}
};
