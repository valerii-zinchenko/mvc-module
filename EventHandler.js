/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

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

var EventHandler = new Class({
	/**
	 * Holder of registered events
	 *
	 * @type {Object}
	 */
	_events: {},

	/**
	 * Listen specific event and attach event handler.
	 *
	 * @param {String | Object} eventName - Event name. If this argument is object then the keys it will be treated as event names and key values as event handlers
	 * @param {Function} [handler] - Event handler
	 */
	listen: function(eventName, handler) {
		if (Object.prototype.toString.call(eventName) == '[object Object]') {
			var obj = eventName;
			for (eventName in obj) {
				this.listen(eventName, obj[eventName]);
			}
		} else {
			if (!this._events[eventName]) {
				this._events[eventName] = [];
			}
			this._events[eventName].push(handler);
		}
	},

	/**
	 * Trigger specific event.
	 *
	 * @param {String} eventName - Event name that should be triggered
	 * @param {[*]} [...rest] - Arguments that will be applied to the registered event handlers
	 */
	trigger: function(eventName) {
		var events = this._events[eventName];
		if (!events || events.length == 0) {
			return;
		}

		var args = Array.prototype.slice.call(arguments, 1);
		for (var n = 0, N = events.length; n < N; n++) {
			events[n].apply(this, [this].concat(args));
		}
	},

	/**
	 * Remove registered event handlers.
	 *
	 * @param {String} eventName - Event name from where the event handler will be removed
	 * @param {Function} handlerRef - Original reference to the registered event handler
	 */
	removeListener: function(eventName, handlerRef) {
		var events = this._events[eventName];
		if (!events || events.length == 0) {
			return;
		}

		for (var n = 0, N = events.length; n < N; n++) {
			if (events[n] === handlerRef) {
				events.splice(n,1);
				break;
			}
		}
	}
});
