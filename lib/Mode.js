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
 * @file It contains the implementation of a [mode]{@link Mode}
 *
 * @see {@link AModeComponent}
 * @see {@link AView}
 * @see {@link AControl}
 * @see {@link AFMode}
 *
 * @author Valerii Zinchenko
 *
 * @version 5.0.0
 */

'use strict';

/**
 * Mode for a model.
 *
 * @class
 * @param {Object} properties - Mode's properties.
 * @param {Object} properties.model - Model.
 * @param {AView} properties.view - Main mode's view.
 * @param {AControl} [properties.control] - Mode's control.
 * @param {Object} [properties.decorators] - Object of decorators for a view, where the key is a decorator name and value is a decorator.
 *
 * @throws {Error} Incorrect type of the mode's properties. Expected: Object
 * @throws {Error} Incorrect type of the model. Expected: Object
 * @throws {Error} View should be inherited from AView
 * @throws {Error} Decorator "{name}" should be inherited from ADecorator
 * @throws {Error} Control should be inherited from AControl
 */
var Mode = Class(function(properties) {
	if (!utils.is(properties, 'Object')) {
		throw new Error('Incorrect type of the mode\'s properties. Expected: Object');
	}
	if (!utils.is(properties.model, 'Object')) {
		throw new Error('Incorrect type of the model. Expected: Object');
	}
	if (!(properties.view instanceof AView)) {
		throw new Error('View should be inherited from AView');
	}

	this.model = properties.model;
	this._view = properties.view;

	if (properties.decorators && utils.is(properties.decorators, 'Object')) {
		for (var key in properties.decorators) {
			if ( !(properties.decorators[key] instanceof ADecorator) ) {
				throw new Error('Decorator "' + key + '" should be inherited from ADecorator');
			}

			this._decorators[key] = properties.decorators[key];
		}
	}

	if (properties.control) {
		if ( !(properties.control instanceof AControl) ) {
			throw new Error('Control should be inherited from AControl');
		}

		this.control = properties.control;
	}

	this.view = this._view;

	this.connect();
}, /** @lends Mode.prototype */{
	/**
	 * Reference to the model.
	 *
	 * @type {Objcet}
	 */
	model: null,

	/**
	 * Reference to the main view.
	 *
	 * @type {AView}
	 */
	_view: null,

	/**
	 * Current view. This can be an original or decorated view.
	 *
	 * @type {DynamicView}
	 */
	view: null,

	/**
	 * Reference to the control.
	 *
	 * @type {AControl}
	 */
	control: null,

	/**
	 * Object of decorators, where the key is a name of a deocorator and value is a decorator object.
	 *
	 * @type {Object}
	 */
	_decorators: {},

	/**
	 * This indicates if a mode components are already connected or not.
	 *
	 * @type {Boolean}
	 */
	_isConnected: false,

	/**
	 * Connect mode components
	 */
	connect: function() {
		if (this._isConnected) {
			return;
		}

		this._view.setModel(this.model);
		if (this.control) {
			this._view.setControl(this.control);

			this.control.setModel(this.model);
			this.control.setView(this._view);

			this.control.connect();
		}
		this._view.connect();
		this._view.render();

		var decorator;
		for (var key in this._decorators) {
			decorator = this._decorators[key];
			decorator.setModel(this.model);
			decorator.render();
		}

		this._isConnected = true;
	},

	/**
	 * Apply decorators to the original view.
	 *
	 * @param {String[] | String } decorators - An array of decorators name or a single decorator name. Decorators will be applied in the same order as they are defined.
	 */
	decorateWith: function(decorators){
		if (!decorators) {
			return;
		}
		if (utils.is(decorators, 'String')){
			this.decorateWith([decorators]);
			return;
		}

		var v = this._view;

		if (this._decorators && decorators.length > 0) {
			var decorator;
			for (var n = 0, N = decorators.length; n < N; n++) {
				decorator = this._decorators[decorators[n]];
				if (decorator) {
					decorator.setComponent(v);

					v = decorator;
				}
			}
		}

		this.view = v;
	}
});
