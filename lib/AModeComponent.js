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
 * @version 3.1.0
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

	// Automatically bind all defined function to "this" and store them into "this" under the same name
	Object.keys(this._bind2this).forEach(function(name) {
		this[name] = this._bind2this[name].bind(this);
	}, this);
}, /** @lends AModeComponent.prototype */{
	/**
	 * Reference to the model.
	 *
	 * @type {Object}
	 */
	model: null,

	/**
	 * Component's configurations.
	 *
	 * @type {Object}
	 */
	config: null,

	/**
	 * Set of function, which will be bound automatically to "this" by constructing an instance.
	 * This is most useful for event handlers, which in most cases should have the context of current class.
	 * Be careful, as that can overwrite other properties/methods defined in the class.
	 *
	 * @type {Object}
	 */
	_bind2this: {},

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
