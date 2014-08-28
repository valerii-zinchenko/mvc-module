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


'use strict';

var Class = new AClass(function() {
    utils.deepExtend(this, this.constructor.prototype._defaults);

    if (this.constructor.parent && this.constructor.parent.hasOwnProperty('initialize')) {
        this.constructor.parent.initialize.apply(this, arguments);
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

