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
 * @file It contains the implementation of an [event handler]{@link EventHandler}.
 *
 * @author Valerii Zinchenko
 *
 * @version 2.0.0
 */

'use strict';

/**
 * Event handler
 *
 * @class
 */
var EventHandler = Class(/** @lends EventHandler.prototype */{
	/**
	 * Holder of registered events
	 *
	 * @private
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
	 * @param [...rest] - Arguments that will be applied to the registered event handlers
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
