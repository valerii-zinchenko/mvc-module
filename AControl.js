/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014  Valerii Zinchenko

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
 * @file It contains the implementation of [Abstract Control class]{@link AControl} creator.
 *
 * @see {@link Class}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

'use strict';

/**
 * Abstract Control.
 * It defines all required conpoments and methods for better and faster developing of specific control.
 *
 * @type {Class}
 *
 * @constructor
 */
var AControl = new Class({
    /**
     * Reference to the model.
     */
    model: null,

    /**
     * Reference to the view.
     */
    view: null,

    /**
     * Control constructor.
     */
    construct: function() {},

    /**
     * Control destructor.
     */
    destruct: function() {
        this.model = null;
        this.view = null;
    },

	/**
	 * Set model
	 *
	 * @param {Object} model - Model
	 */
	setModel: function(model) {
		this.model = model;
	},

	/**
	 * Set view
	 *
	 * @param {Object} view - View
	 */
	setView: function(view) {
		this.view = view;
	},

	/**
	 * Connect control component to the module.
	 * This is called after constructor and setting of the model and view components.
	 *
	 * @abstract
	 */
	connect: function() {}
});
