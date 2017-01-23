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
 * @version 2.0.0
 */

'use strict';


/**
 * Abstract view decorator.
 * Decorator works with built views.
 * The template of a decorator should contain an element with class "component-container" where the decorated object will be injected.
 *
 * @class
 * @extends DynamicView
 */
var ADecorator = Class(DynamicView, null, /** @lends ADecorator.prototype */{
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
