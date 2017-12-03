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
 * @file It contains the implementation of an [abstract view decorator]{@link ADecorator}.
 *
 * @see {@link DynamicView}
 *
 * @author Valerii Zinchenko
 *
 * @version 3.0.0
 */

'use strict';


/**
 * Abstract view decorator.
 * Decorator works with rendered views.
 * The template of a decorator should contain an element with an empty data attribute "data-mvc-container" where the decorated object will be injected.
 *
 * @class
 * @extends DynamicView
 */
var ADecorator = Class(DynamicView, null, /** @lends ADecorator.prototype */{
	template: '<div data-mvc-container></div>',

	/**
	 * Decorated component.
	 *
	 * @type {AView}
	 */
	_component: null,

	/**
	 * Component's container.
	 *
	 * @returns {HTMLElement}
	 */
	container: null,

	/**
	 * Set component that is going to be decorated.
	 *
	 * @throws {Error} Incorrect type of the "component" argument. Expected AView
	 *
	 * @param {AView} component - View that is going to be decorated.
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
	 * @returns {HTMLElement[]}
	 */
	render: function() {
		DynamicView.prototype.render.call(this);

		if (this._component) {
			this._component.elements.forEach(function(element) {
				this.container.appendChild(element);
			}, this);
		}

		return this.elements;
	},

	update: function() {
		if (this._component) {
			this._component.update();
		}

		DynamicView.prototype.update.call(this);
	},

	_processTemplate: function(){
		DynamicView.prototype._processTemplate.call(this);

		this.container = this.element.querySelector('[data-mvc-container]');
	}
});
