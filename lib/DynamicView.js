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
 * @file It contains the implementation of [Dynamic View class]{@link DynamicView} creator.
 *
 * @see {@link AStateComponent}
 * @see {@link AView}
 * @see {@link StaticView}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';


/**
 * Dynamic view.
 * It implements parent's [render()]{@link render} method to dynamically process template, initalize required elements and attach eventh.
 *
 * @class
 * @extends AView
 */
var DynamicView = Class(AView, null, /** @lends DynamicView.prototype */{
	/**
	 * Main template.
	 *
	 * @type {string}
	 */
	template: '',

	/**
	 * Render the view.
	 *
	 * @returns {jQueryDOMElement}
	 */
	render: function() {
		this._processTemplate();
		this._initElements();
		this._attachEvents();

		return this.$el;
	},

	/**
	 * Process view template and set the proceiing result to the [main view element]{@link $el}.
	 * The Model will be set to the template processor.
	 */
	_processTemplate: function() {
		this.$el = $(_.template(this.template)(this.model));
	}
});
