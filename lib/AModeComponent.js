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
 * @file It contains the implementation of [abstract mode component]{@link AModeComponent} creator.
 *
 * @see {@link Mode}
 * @see {@link AView}
 * @see {@link AControl}
 *
 * @author Valerii Zinchenko
 *
 * @version 3.0.0
 */

'use strict';

/**
 * Abstract mode component.
 * This class defines general properties and methods which will be used in each mode component, like AView and AControl.
 *
 * @class
 *
 * @param {Object} [config] - Component's mode's configurations.
 */
var AModeComponent = Class(function(config) {
	if (config && utils.is(config, 'Object')) {
		this.config = config;
	}
}, /** @lends AModeComponent.prototype */{
	/**
	 * Reference to the model.
	 *
	 * @type {Objcet}
	 */
	model: null,

	/**
	 * Component's configurations.
	 *
	 * @type {Object}
	 */
	config: null,

	/**
	 * Connect view component to the module.
	 * This is called after constructor and setting of the model and control components.
	 *
	 * @abstract
	 */
	connect: function() {},

	/**
	 * Destructor.
	 */
	destruct: function() {
		this.model = null;
		this.config = null;
	},

	/**
	 * Set model for the mode component.
	 *
	 * @throws {Error} Model for the mode is not defined
	 *
	 * @param {Object} model - Model
	 */
	setModel: function(model) {
		if (!utils.is(model, 'Object')) {
			throw new Error('Model for the mode is not defined');
		}

		this.model = model;
	}
});
