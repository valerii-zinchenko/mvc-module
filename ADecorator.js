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
 * @file It contains the implementation of an [abstract view decorator]{@link ADecorator}.
 *
 * @see {@link DynamicView}
 * @see {@link Class}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

'use strict';


/**
 * Abstract view decorator.
 * Decorator works with built views.
 * The template of a decorator should contain an element with class "component-container" where the decorated object will be injected.
 *
 * @type {Class}
 *
 * @constructor
 */
var ADecorator = new Class(DynamicView, {
	/**
	 * Decorated component.
	 *
	 * @type {AView}
	 */
	_component: null,

	/**
	 * Component's container.
	 *
	 * @returns {jQueryDOMElement}
	 */
	$component: null,

	/**
	 * Set component that is going to be decorated.
	 *
	 * @throws {Error} Incorrect type of the "component" argument. Expected AView
	 *
	 * @params {AView} component - View that is going to be decorated.
	 */
	setComponent: function(component) {
		if (!(component instanceof AView)) {
			throw new Error('Incorrect type of the "component" argument. Expected AView');
		}

		this._component = component;
	},

	destruct: function() {
		if (this._component) {
			this._component.destruct();
		}

		DynamicView.prototype.destruct.call(this);
	},

	/**
	 * Render the decorator.
	 * Note that the decorated component is assumed to be already rendered and the component's render() method is not going to be executed.
	 *
	 * @returns {jQueryDOMElement}
	 */
	render: function() {
		DynamicView.prototype.render.call(this);

		if (this._component) {
			this.$component.append(this._component.$el);
		}

		return this.$el;
	},

	update: function() {
		if (this._component) {
			this._component.update();
		}

		DynamicView.prototype.update.call(this);
	},

	_processTemplate: function(){
		this.$el = $(_.template(this.template)({
			model: this.model,
			config: this.config
		}));

		this.$component = this.$el.find('.component-container');
	}
});
