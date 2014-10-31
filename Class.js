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
 * @file It contains the implementation of simple [class]{@link Class} creator.
 *
 * @see {@link AClass}
 * @see {@link SingletonClass}
 * @see {@link MVCModule}
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.0
 */

'use strict';

/**
 * Simple Class creator function.
 * This creator subroutine calls first the parent
 * class constructor method ('initialize') and then the own class constructor method.
 *
 * @type {AClass}
 * @constructor
 * @param {ClassConstructor} [Parent = Object] - Parent class. Built-in 'Object' will be used if this argument will be omitted
 * @param {Object} props - Defines the properties and methods for new class
 * @returns {Function} Instance
 */
var Class = new AClass(function() {
    utils.deepExtend(this, this.constructor.prototype._defaults);

    if (this.constructor.parent) {
        this.parent = {};
        Object.keys(this.constructor.parent).forEach(function(key) {
            if (this.constructor.parent.hasOwnProperty(key) && (typeof this.constructor.parent[key] === 'function')) {
                this.parent[key] = this.constructor.parent[key].bind(this);
            }
        }, this);

        if (this.parent.hasOwnProperty('initialize')) {
            this.parent.initialize.apply(this, arguments);
        }
    }
    if (this.constructor.prototype.hasOwnProperty('initialize')) {
        this.constructor.prototype.initialize.apply(this, arguments);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Class;
}

/*
new Class({
    private: {

    },
    protected: {

    },
    public: {

    }
});
*/

