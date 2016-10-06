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
 * @file It contains the implementation of [Static View class]{@link StaticView} creator.
 *
 * @see {@link AStateComponent}
 * @see {@link AView}
 * @see {@link DynamicView}
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Static view.
 * It implements parent's [render()]{@link render} method to initalize required elements and attach eventh.
 *
 * @type {Class}
 *
 * @constructor
 */
var StaticView = SingletonClass(AView, function() {
	this.$el = $(this.selector);
}, {
	selector: '',


	render: function() {
		this._initElements();
		this._attachEvents();

		return this.$el;
	}
});
