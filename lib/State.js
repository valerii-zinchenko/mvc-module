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
 * @file It contains the implementation of a [state]{@link State}
 *
 * @see {@link AStateComponent}
 * @see {@link AView}
 * @see {@link AControl}
 * @see {@link AFState}
 *
 * @author Valerii Zinchenko
 *
 * @version 3.0.0
 */

'use strict';

/**
 * Abstract state.
 *
 * @type {Class}
 *
 * @throws {Error} Incorrect type of the state's properties. Expected: Object
 * @throws {Error} Incorrect type of the model. Expected: Object
 * @throws {Error} View should be inherited from AView
 *
 * @constructor
 * @param {Object} properties - State's properties.
 * @param {Object} properties.model - Model.
 * @param {AView} properties.view - Main state's view.
 * @param {AControl} [properties.control] - State's control.
 * @param {Object} [properties.decorators] - Object of decorators for a view.
 */
var State = new Class({
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
	 * This indicates if a state components are already connected or not.
	 *
	 * @type {Boolean}
	 */
	_isConnected: false,

	initialize: function(properties) {
		if (!utils.is(properties, 'Object')) {
			throw new Error('Incorrect type of the state\'s properties. Expected: Object');
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
				if (properties.decorators[key] instanceof ADecorator) {
					this._decorators[key] = properties.decorators[key];
				} else {
					console.warn('Incompatible decorator\'s constructor: "' + key + '"! It should be inherited from an ADecorator');
				}
			}
		}

		if (properties.control && properties.control instanceof AControl) {
			this.control = properties.control;
		}

		this.view = this._view;

		this.connect();
	},

	/**
	 * Connect state components
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
	 * @param {[String] | String } decorators - An array of decorators name or a single decorator name. Decorators will be applied in the same order as they are defined.
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
