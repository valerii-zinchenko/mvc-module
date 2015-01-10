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
     * Render the view.
     * This creates the new DOM Element from template and connected Model.
     * It executes abstract _postRender(){@link _postRender} and _attachEvents(){@link _attachEvents} methods for view specific post rendering ruotine and for attaching the event handlers.
     *
     * @throws {Error} Model is not connected
     *
     * @returns {DOMElement}
     *
     * @see {@link update}
     */
    render: function() {
        if (!this.model) {
            throw new Error('Model is not connected');
        }

        this.$el = $(_.template(this.template, this.model));
        this.$el.trigger('create');

        this._postRender();

        this._attachEvents();

        return this.$el;
    },

    /**
     * Update view.
     *
     * @abstract
     */
    update: function() {},

    /**
     * Post rendering routine.
     *
     * @abstract
     */
    _postRender: function() {},

    /**
     * Attach event listeners.
     *
     * @abstract
     */
    _attachEvents: function() {}
});
