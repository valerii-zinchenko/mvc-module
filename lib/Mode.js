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
 * @see {@link AFMode}
 * @see {@link AModeComponent}
 * @see {@link AView}
 * @see {@link AControl}
 * @see {@link ADecorator}
 *
 * @author Valerii Zinchenko
 *
 * @version 6.0.0
 */

'use strict';

/**
 * Mode for a model.
 *
 * @class
 *
 * @throws {Error} Incorrect type of the mode's properties. Expected: Object
 * @throws {Error} Incorrect type of the model. Expected: Object
 * @throws {Error} Incorrect type of a view's constructor. Expected: Function
 * @throws {Error} Incorrect type of a control's constructor. Expected: Function
 * @throws {Error} Incorrect type of map of decorators. Expected: Object. Where key is a decorator name, and value is a decorator constructor
 * @throws {Error} Incorrect type of a decorator's constructor "{name}". Expected: Function
 * @throws {Error} Control should be inherited from AControl
 *
 * @param {Object} properties - Mode's properties.
 * @param {Object} properties.model - Model.
 * @param {Function} properties.View - Constructor for the view component.
 * @param {Function} [properties.Control] - Constructor for the control component.
 * @param {Object} [properties.Decorators] - Map of decorators' names and decorators' construstors for a new mode.
 * @param {Object} [properties.config] - Configurations for control, view and decorator components.
 */
var Mode = Class(function(properties) {
	if (!utils.is(properties, 'Object')) {
		throw new Error('Incorrect type of the mode\'s properties. Expected: Object');
	}

	if (utils.is(properties.model, 'Object')) {
		this.model = properties.model;
	} else {
		throw new Error('Incorrect type of the model. Expected: Object');
	}

	if (utils.is(properties.View, 'Function')) {
		this.View = properties.View;
	} else {
		throw new Error('Incorrect type of a view\'s constructor. Expected: Function');
	}

	if (properties.Decorators) {
		if (!utils.is(properties.Decorators, 'Object')) {
			throw new Error('Incorrect type of map of decorators. Expected: Object. Where key is a decorator name, and value is a decorator constructor');
		}

		for (var key in properties.Decorators) {
			if (!utils.is(properties.Decorators[key], 'Function')) {
				throw new Error('Incorrect type of a decorator\'s constructor "' + key + '". Expected: Function');
			}
		}

		this.Decorators = properties.Decorators;
	}

	this.config = properties.config;

	if (properties.Control) {
		if (!utils.is(properties.Control, 'Function')) {
			throw new Error('Incorrect type of a control\'s constructor. Expected: Function');
		}

		var control = new properties.Control(this.config);
		if ( !(control instanceof AControl) ) {
			throw new Error('Control should be inherited from AControl');
		}

		this.control = control;
		this.control.setModel(this.model);
		this.control.connect();
	}
}, /** @lends Mode.prototype */{
	/**
	 * Reference to the model.
	 * @type {Objcet}
	 */
	model: null,

	/**
	 * View constructor
	 * @type {Function}
	 */
	View: null,

	/**
	 * Map of decorators' names and decorators' construstors for a new mode
	 * @type {Object}
	 */
	Decorators: {},

	/**
	 * Reference to the control.
	 * @type {AControl}
	 */
	control: null,

	/**
	 * Map of usages and created views for it
	 * @type {Object}
	 */
	_usages: {},

	/**
	 * Get an instance of the view for a specific usage.
	 *
	 * For each usage a new instance of the view will be created and, if needed, decorated also with new instances of decorators.
	 * This allows to use the same view in different places with or without different decorators.
	 *
	 * @throws {Error} View should be inherited from AView
	 * @throws {Error} Decorator "{name}" should be inherited from ADecorator
	 *
	 * @param {String} [usage = 'default'] - Define for how/where he view is going to be used. For different usages different instances of a view and decorators will be created.
	 * @param {String[] | String} [decorators] - An array of decorators name or a single decorator name. Decorators will be applied in the same order as they are defined.
	 */
	getView: function(usage, decorations) {
		if (!usage) {
			usage = 'default';
		}
		if (this._usages[usage]) {
			return this._usages[usage];
		}

		var view = new this.View(this.config);
		if (!(view instanceof AView)) {
			throw new Error('View should be inherited from AView');
		}

		view.setModel(this.model);
		if (this.control) {
			view.setControl(this.control);
		}
		view.connect();
		view.render();
		view = this.decorate(view, decorations);

		this._usages[usage] = view;

		return view;
	},

	/**
	 * Apply decorators to a view.
	 *
	 * @throws {Error} View should be inherited from AView
	 * @throws {Error} Constructor for decorator "{name}" is not defined
	 * @throws {Error} Decorator "{name}" should be inherited from ADecorator
	 *
	 * @param {AView} view - View, which should be decorated.
	 * @param {String[] | String} decorators - An array of decorators name or a single decorator name. Decorators will be applied in the same order as they are defined.
	 * @return {Aview}
	 */
	decorate: function(view, decorators){
		if (!(view instanceof AView)) {
			throw new Error('View should be inherited from AView');
		}

		if (this.Decorators.length === 0 || !decorators) {
			return view;
		}
		if (utils.is(decorators, 'String')){
			decorators = [decorators];
		}

		var v = view;
		var decorator;
		var Constructor;
		for (var n = 0, N = decorators.length; n < N; n++) {
			Constructor = this.Decorators[decorators[n]];
			if (!Constructor) {
				throw new Error('Constructor for decorator "' + decorators[n] + '" is not defined');
			}

			decorator = new Constructor(this.config);

			if ( !(decorator instanceof ADecorator) ) {
				throw new Error('Decorator "' + decorators[n] + '" should be inherited from ADecorator');
			}

			decorator.setComponent(v);
			decorator.setModel(this.model);
			decorator.render();

			v = decorator;
		}

		return v;
	}
});
