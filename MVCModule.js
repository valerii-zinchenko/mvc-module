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
 * @file It contains the implementation of [MVC module builder]{@link MVCModule}
 *
 * @see {@link AClass}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

'use strict';

/**
 * Main MVC module constructor.
 * This automates the collecting of sub-modules (Model, View, Control) constructors
 * and creates a single module constructor.
 *
 * @type {AClass}
 * @constructor
 * @param {Object} MVCConstructors - Object of constructors for each sub-module. All constructors are required.
 * @param {ClassConstructor} MVCConstructors.Model - Constructor for Model sub-module.
 * @param {ClassConstructor} MVCConstructors.View - Constructor for View sub-module.
 * @param {ClassConstructor} MVCConstructors.Control - Constructor for Control sub-module.
 * @return {ModuleConstructor}
 *
 * @throws {Error} Incorrect amount of input arguments
 */
var MVCModule = new AClass(function(MVCConstructors) {
    if (arguments.length < 1) {
        throw new Error('Incorrect amount of input arguments');
    }

    var MVC = ['Model', 'View', 'Control'];
    var objects = MVC.map(function(key) {
        return key.toLowerCase();
    });

    MVC.forEach(function(Constructor) {
        if (!MVCConstructors[Constructor]) {
            throw new Error(Constructor + ' constructor is undefined');
        }
    });

    /**
     * Module constructor.
     * This automates the creation of each sub-modules (Model, View, Control) and binding them for each other
     * to let know the each module about other sub-modules.
     *
     * @note This is just for documentation.
     *
     * @name ModuleConstructor
     * @constructor
     * @param {Object} [moduleArgs = {}] - Object of argument objects for each sub-module.
     * @param {Object} [moduleArgs.model] - Input object argument for Model sub-module.
     * @param {Object} [moduleArgs.view] - Input object argument for View sub-module.
     * @param {Object} [moduleArgs.control] - Input object argument for Control sub-module.
     */
    return function(moduleArgs) {
        moduleArgs = moduleArgs || {};

        // Build each sub-module
        MVC.forEach(function(Constructor, indx) {
            this[objects[indx]] = new MVCConstructors[Constructor](moduleArgs[objects[indx]]);
        }, this);

        // Populate module components for each other
        objects.forEach(function(object, indx) {
            for (var n = 0, N = objects.length; n < N; n++) {
                if (n != indx) {
                    this[object] = this[objects[n]];
                }
            }
        }, this);
    }
});