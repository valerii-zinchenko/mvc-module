/*
 TaskOnFly. Manage your tasks and task lists on the fly.
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


function AClass(Constructor) {
    if (arguments.length === 0) {
        throw new Error('Incorrect input arguments. Constructor function is not defined');
    }
    if (typeof Constructor !== 'function') {
        throw new Error('Constructor should be an function');
    }

    return function(Parent, props){
        var Class, CoreClass, key, value;

        // Check input argumnets
        if (typeof Parent !== 'function') {
            props = Parent;
            Parent = Object;
        }
        if (props && typeof props !== 'object') {
            throw new Error('Incorrect input arguments. It should be: new Class([[Function], Object])');
        }

        // Create proxy function
        CoreClass = function(){};
        CoreClass.prototype = Parent.prototype;

        // Clone class constructor function
        eval('Class = ' + Constructor.toString());
        // Setup class constructor function
        Class.prototype = new CoreClass();
        Class.parent = Parent.prototype;
        Class.prototype.constructor = Class;

        Class.prototype._defaults = {};
        // Clone default properties from parent class
        if (Class.parent._defaults) {
            utils.deepCopy(Class.prototype._defaults, Class.parent._defaults);
        }
        // Setup input properties to the new class
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                value = props[key];
                switch (typeof value) {
                    case 'function':
                        Class.prototype[key] = value;
                        break;
                    case 'object':
                        if (value) {
                            if (!Class.prototype._defaults[key]) {
                                Class.prototype._defaults[key] = {};
                            }
                            utils.deepCopy(Class.prototype._defaults[key], value);
                            break;
                        }
                    default:
                        Class.prototype._defaults[key] = value;
                }
            }
        }

        return Class;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AClass;
}