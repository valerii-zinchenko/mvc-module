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
 * @file It contains the implementation of [Abstract View class]{@link AView} creator.
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
 * Abstract View.
 * It defines all required conpoments and methods for better and faster developing of specific views.
 *
 * @type {Class}
 *
 * @constructor
 */
var AView = new Class({
    /**
     * Reference to the model.
     */
    model: null,

    /**
     * Reference to the control.
     */
    control: null,

    /**
     * Main view element.
     *
     * @type {DOMElement}
     */
    $el: null,

    /**
     * Main template.
     *
     * @type {string}
     */
    template: '',

	/**
	 * Flag that indicates if the view is fully rendered.
	 * It is used in [render()]{@link render} and [postRender()]{@link postRender}
	 */
	_isRendered: false,

    /**
     * View constructor.
     */
    construct: function() {},

    /**
     * View destructor.
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
	 * Set control
	 *
	 * @param {Object} control - Control
	 */
	setControl: function(control) {
		if (!(control instanceof AControl)) {
			throw new Error('Incorrect type of control component');
		}

		this.control = control;
	},

	/**
	 * Connect view component to the module.
	 * This is called after constructor and setting of the model and control components.
	 *
	 * @abstract
	 */
	connect: function() {},

	/**
	 * Process view template and set the proceiing result to the [main view element]{@link $el}.
	 * The Model will be set to the template processor.
	 */
	processTemplate: function() {
        this.$el = $(_.template(this.template, this.model));
	},

	/**
	 * Post template processing routine.
	 *
	 * @abstract
	 */
	_postProcessTemplate: function() {},

    /**
     * Render the view.
     * This creates the new DOM Element from template and connected Model.
	 * It process the view template and [render sub-modules]{@link renderSubModules}.
     *
     * @throws {Error} Model is not connected
     *
     * @returns {DOMElement}
     *
     * @see {@link update}
     */
    render: function() {
		if (this._isRendered) {
			return this.$el;
		}

        if (!this.model) {
            throw new Error('Model is not connected');
        }

		this.processTemplate();
		this._postProcessTemplate();

		this.renderSubModules();

        return this.$el;
    },

	/**
	 * Render sub-modules.
	 *
	 * @abstract
	 */
	renderSubModules: function() {},

    /**
     * Update view.
     *
     * @abstract
     */
    update: function() {},
	
	/**
	 * Update sub-modules.
	 *
	 * @abstract
	 */
	updateSubModules: function() {},

	/**
	 * Main post rendering routine.
	 * It defines the call order of abstract methods:
	 * 	1: [_postRendering method]{@link _postRender}
	 * 	2: [_attachEvents]{@link _attachEvents}
	 * 	3: [_postRenderModules]{@link _postRenderModules}
	 *
	 * It also sets the property [_isRendered]{@link _isRendered} to false.
	 *
	 * Do not overwrite it, implement better [abstract _postRender method]{@link _postRender}.
	 */
	postRender: function() {
		if (this._isRendered) {
			return;
		}

		this._postRender();

		this._attachEvents();

		this._isRendered = true;

		this._postRenderModules();
	},

	/**
	 * Abstract post rendering routine.
	 * Mainly this method is called from [postRender]{@link postRender}
	 *
	 * @abstract
	 */
    _postRender: function() {},

	/**
	 * Abstract routine for calling of [postRender]{@link postRender} method for each sub-module.
	 * Mainly this method is called from [postRender]{@link postRender}
	 *
	 * @abstract
	 */
	_postRenderModules: function(){},

    /**
     * Attach event listeners.
     *
     * @abstract
     */
    _attachEvents: function() {}
});
