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
 * @version 2.0.0
 */

'use strict';

/**
 * Abstract state.
 *
 * @type {Class}
 *
 * @throws {Error} Incorrect type of the model. Expected: Object
 * @throws {Error} View constructor should be inherited from AStateComponen
 *
 * @constructor
 * @param {Object} model - Model
 * @param {Object} view - State view
 * @param {Object} [control] - State control
 */
var State = new Class({
	/**
	 * Reference to the model.
	 *
	 * @type {Objcet}
	 */
	model: null,

	/**
	 * Reference to the view.
	 *
	 * @type {AStateComponent}
	 */
	view: null,

	/**
	 * Reference to the control.
	 *
	 * @type {AStateComponent}
	 */
	control: null,

	/**
	 * This indicates if a state components are already connected or not.
	 *
	 * @type {Boolean}
	 */
	_isConnected: false,

	initialize: function(model, view, control) {
		if (!utils.is(model, 'Object')) {
			throw new Error('Incorrect type of the model. Expected: Object');
		}
		if (!(view instanceof AStateComponent)) {
			throw new Error('View constructor should be inherited from AStateComponent');
		}
		if (control && control instanceof AStateComponent) {
			this.control = control;
		}

		this.model = model;
		this.view = view;

		this.connect();

		this.view.render();
	},

	/**
	 * Connect state components
	 */
	connect: function() {
		if (this._isConnected) {
			return;
		}

		this.view.setModel(this.model);
		if (this.control) {
			this.view.setControl(this.control);

			this.control.setModel(this.model);
			this.control.setView(this.view);

			this.control.connect();
		}
		this.view.connect();

		this._isConnected = true;
	}
});
