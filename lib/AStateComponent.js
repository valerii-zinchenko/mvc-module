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
 * @file It contains the implementation of [abstract state component]{@link AStateComponent} creator.
 *
 * @see {@link State}
 * @see {@link AView}
 * @see {@link AControl}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract state component.
 * This class defines general properties and methods which will be used in each state component, like AView and AControl.
 *
 * @type {Class}
 *
 * @constructor
 * @param {Object} [config] - Component's state's configurations.
 */
var AStateComponent = new Class({
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

	// constructor
	initialize: function(config) {
		if (config && utils.is(config, 'Object')) {
			this.config = config;
		}
	},

	/**
	 * Destructor.
	 */
	destruct: function() {
		this.model = null;
		this.config = null;
	},

	/**
	 * Set model for the state component.
	 *
	 * @throws {Error} Model for the state is not defined
	 *
	 * @param {Object} model - Model
	 */
	setModel: function(model) {
		if (!utils.is(model, 'Object')) {
			throw new Error('Model for the state is not defined');
		}

		this.model = model;
	}
});
