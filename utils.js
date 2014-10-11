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


'use strict';

var utils = {
    deepCopy: function(target, source) {
        var key,
            value;

        for (key in source) {
            value = source[key];
            switch (Object.prototype.toString.call(value)) {
                case '[object Object]':
                    if (!target[key]) {
                        target[key] = {};
                    }
                    utils.deepCopy(target[key], value);
                    break;
                default :
                    target[key] = value
            }
        }

        return target;
    },
    deepExtend: function(target, source) {
        var key,
            value;

        for (key in source) {
            value = source[key];
            if (target.hasOwnProperty(key)) {
                if (typeof target[key] === 'object') {
                    utils.deepExtend(target[key], value);
                }
                continue;
            }

            switch (Object.prototype.toString.call(value)) {
                case '[object Object]':
                    if (!target[key]) {
                        target[key] = {};
                    }
                    utils.deepExtend(target[key], value);
                    break;
                default :
                    target[key] = value
            }
        }

        return target;
    },
    date: function(dateObj) {
        if (dateObj && dateObj.constructor !== Date) {
            throw new Error('Incorrect input argument type');
        }
        return (dateObj ? dateObj : new Date()).toISOString().slice(0,10);
    }
};

function Template(fnTemplate) {
    return fnTemplate.toString().match(/[^]*\/\*\*([^]*)\*\*\/\}$/)[1];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        utils: utils,
        Template: Template
    };
}