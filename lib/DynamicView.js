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
 * @file It contains the implementation of [Dynamic View class]{@link DynamicView} creator.
 *
 * @see {@link AModeComponent}
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
	template: '<div></div>',

	/**
	 * Render the view.
	 *
	 * @returns {DOMElement}
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
		var _tmpel = document.createElement('div');
		_tmpel.innerHTML = _.template(this.template)(this.model);

		this.$el = _tmpel.firstChild;
	}
});
