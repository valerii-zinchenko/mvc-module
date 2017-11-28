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
 * @version 3.0.0
 */

'use strict';


/**
 * Dynamic view.
 * It implements parent's [render()]{@link render} method to dynamically process template, initialize required elements and attach events.
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
	 * Here are stored all separate elements which rendered from a template
	 * @type{HTMLCollection}
	 */
	elements: [],

	/**
	 * Container where the template elements will be created as real HTMLElements
	 * @type {String}
	 */
	_tmpContainer: 'div',

	/**
	 * Render the view.
	 *
	 * @returns {DOMElement}
	 */
	render: function() {
		this._processTemplate();
		this._initElements();
		this._attachEvents();

		return this.elements;
	},

	/**
	 * Process view template and set the processing result to the [main view element]{@link elements}.
	 * The Model will be set to the template processor.
	 */
	_processTemplate: function() {
		this.element = document.createElement(this._tmpContainer);
		this.element.innerHTML = _.template(this.template)(this);

		this.elements = this.element.children;
	}
});
