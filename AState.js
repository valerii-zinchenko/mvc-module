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
 * @file It contains the implementation of [abstract state]{@link FState}
 *
 * @see {@link AStateComponent}
 * @see {@link AView}
 * @see {@link AControl}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

'use strict';

/**
 * Abstract state factory.
 * It builds specified state depending on input state component.
 *
 * @param {AStateComponent} ViewConstructor - Constructor for the view component.
 * @param {AStateComponent} [ControlConstructor] - Constructor for the control component.
 *
 * @throws {Error} Incorrect input arguments. Expected AStateComponent ViewConstructor, [AStateComponent ControlConstructor]
 * @throws {Error} View constructor should be inherited from AStateComponent
 * @throws {Error} Control constructor should be inherited from AStateComponent
 */
function AState(ViewConstructor, ControlConstructor) {
	if (!ViewConstructor) {
		throw new Error('Incorrect input arguments. Expected AStateComponent ViewConstructor, [AStateComponent ControlConstructor]');
	}
	if (!(ViewConstructor.prototype instanceof AStateComponent)) {
		throw new Error('View constructor should be inherited from AStateComponent');
	}
	if (ControlConstructor && !(ControlConstructor.prototype instanceof AStateComponent)) {
		throw new Error('Control constructor should be inherited from AStateComponent');
	}

	/**
	 * Abstract state.
	 *
	 * @type {Class}
	 *
	 * @constructor
	 */
	return new Class({
		/**
		 * Reference to the model.
		 *
		 * @type {Class}
		 */
		model: null,

		/**
		 * Reference to the view.
		 *
		 * @type {Class}
		 */
		view: null,

		/**
		 * Reference to the control.
		 *
		 * @type {Class}
		 */
		control: null,

		/**
		 * This indicates if state component is already connected or not.
		 *
		 * @type {Boolean}
		 */
		_isConnected: false,

		initialize: function() {
			this.view = new ViewConstructor();

			if (ControlConstructor) {
				this.control = new ControlConstructor();
			}
		},

		/**
		 * Set model to the state.
		 *
		 * @param {Class|Function} model - MVC model.
		 */
		setModel: function(model) {
			this.model = model;

			this.view.setModel(this.model);

			if (this.control) {
				this.control.setModel(this.model);
			}
		},

		/**
		 * Connect all MVC components in current state of the model.
		 *
		 * @throws {Error} Model is not set for the state
		 */
		connect: function() {
			if (!this.model) {
				throw new Error('Model is not set for the state');
			}
			if (this._isConnected) {
				return;
			}

			if (this.control) {
				this.view.setControl(this.control);
				this.control.setView(this.view);

				this.control.connect();
			}
			this.view.connect();

			this._isConnected = true;
		}
	});
}
