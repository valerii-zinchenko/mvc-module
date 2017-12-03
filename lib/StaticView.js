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
 * @file It contains the implementation of [Static View class]{@link StaticView} creator.
 *
 * @see {@link AModeComponent}
 * @see {@link AView}
 * @see {@link DynamicView}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.1.0
 */

'use strict';

/**
 * Static view.
 * It implements parent's [render()]{@link render} method to initalize required elements and attach eventh.
 *
 * @class
 * @extends AView
 */
var StaticView = SingletonClass(AView, function() {
	this.element = document.querySelector(this.selector);
}, /** @lends StaticView.prototype */{
	/**
	 * Selector of a static element from a DOM
	 * @type {String}
	 */
	selector: 'div',

	/**
	 * Main view element.
	 *
	 * @type {HTMLElement}
	 */
	element: null,

	destruct: function() {
		this.element.remove();

		AView.prototype.destruct.call(this);
	},

	/**
	 * Show view.
	 * Remove "hidden" class.
	 */
	show: function() {
		this.element.classList.remove('hidden');
	},

	/**
	 * Hide view.
	 * Add "hidden" class.
	 */
	hide: function() {
		this.element.classList.add('hidden');
	},


	render: function() {
		this._initElements();
		this._attachEvents();

		return this.element;
	}
});
