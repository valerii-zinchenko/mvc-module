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

/**
 * @file #Router - simple hash router.
 *
 * @see HashRouter
 *
 * @author Valerii Zinchenko
 *
 * @version 1.0.0
 */

'use strict';

/**
 * #Router
 * This is simple hash router. He behaves as singleton.
 * Route can be defined by using named parts like ":name", or by using RegExp with captured groups like "(\\w+)". Remember to allways escape "\" character and use round braces to capture variable parts of route.
 * Please note, that appropriate methods will be executed only on first matched route. So plan your routes by importance in descending order.
 *
 * @example {"user/:id": ["load", "display"]}
 * @example {"user/(\\w+)": ["load", "display"], "(.*)": "404"}
 *
 * @throws {Error} Type of routingMap input argument expected to be an Object
 * @throws {Error} Type of context input argument expected to be an Object
 *
 * @constructor
 * @param {Object} routingMap - Map of routes and methods name
 * @param {Object} context - Context object wich has methods used in routingMap
 * @param {String} [fallbackRoute] - Fallback route. It will be used for cases when the visiting history is empty and application tries to go back
 */
var HashRouter = new SingletonClass(/** @lends HashRouter# */{
	/**
	 * RegExp to match the hash from the URL.
	 *
	 * @type {RegExp}
	 */
	hashRegExp: /(?:(\#.*)(?=\?))|(\#.*)/,

	/**
	 * RegExp to match the hard (URL search query) and soft (query after fragment) query from the URL.
	 *
	 * @type {RegExp}
	 */
	queryRegExp: /(\?.*)(?=\#)(?:\#.*(\?.*))?|(\?.*)+?/,

	/**
	 * Map of converted routes in RegExp and array of method names.
	 * @example {/^#user/([\w\-\+\.]+)$/: ['load', 'display']}
	 *
	 * @type {Object}
	 */
	_routingMap: {},

	/**
	 * Context object with methods.
	 *
	 * @type {Object}
	 */
	_context: null,

	/**
	 * Fallback route. Is used when visiting history doesn't have any items.
	 *
	 * @type {String}
	 */
	_fallbackRoute: '',

	/**
	 * Array of visiting routes.
	 *
	 * @type {Array}
	 */
	_history: [],

	// constructor
	initialize: function(routingMap, context, fallbackRoute) {
		if (!utils.isObject(routingMap)) {
			throw new Error('Type of routingMap input argument expected to be an Object');
		}
		if (!utils.isObject(context)) {
			throw new Error('Type of context input argument expected to be an Object');
		}

		this._context = context;
		this._fallbackRoute = fallbackRoute;

		if (!this._context.prefix) {
			this._context.prefix = '';
		}

		var methods;
		for (var route in routingMap) {
			methods = routingMap[route];
			if (_.isString(methods)) {
				methods = [methods];
			}

			this._routingMap[route] = {
				regExp: new RegExp(this._preprocessRouteName(route, this._context.prefix)),
				methods: methods
			};
		}
	},

	/**
	 * Start the router.
	 *
	 * @param {String} [route] - Start point for router.
	 */
	start: function(route) {
		var _this = this;
		window.onhashchange = function(ev) {
			_this._hashChange(_this._getHash(ev.newURL), _this._getQuery(ev.newURL));
		};

		if (route) {
			this._hashChange(this._getHash(route), this._getQuery(route));
		}
	},

	/**
	 * Route to the new path.
	 *
	 * @param {String} route - New route.
	 * @param {String} [queries] - Optional parameters.
	 */
	routeTo: function(route, queries) {
		if (utils.isObject(queries)) {
			route += this.object2Query(queries);
		}

		location.hash = route;
	},

	/**
	 * Go back;
	 */
	back: function() {
		this._history.pop();

		if (this._history.length === 0 && this._fallbackRoute) {
			this.routeTo(this._context.prefix + this._fallbackRoute);

			return;
		}

		window.history.back();
	},

	/**
	 * Execute approptiate method(s) by changing hash to the new route.
	 *
	 * @param {String} hash - New route (should begin with '#').
	 * @param {String | Object} [queries] - Optional parameters (should begin with '?').
	 */
	_hashChange: function(route, queries) {
		var args;
		var methods;

		// Detect if user moves backward by using browser back button.
		if (this._history[this._history.length-2] === route) {
			this._history.pop();
		} else {
			this._history.push(route);
		}


		var map;
		for (var routeMap in this._routingMap) {
			map = this._routingMap[routeMap];

			if (map.regExp.test(route)) {
				args = map.regExp.exec(route);
				methods = map.methods;

				break;
			}
		}

		if (!methods || methods.length === 0) {
			return;
		}

		args = args.slice(1);
		args.push(this.query2Object(queries));
		_.forEach(methods, function(methodName) {
			var method = this[methodName];

			if (method) {
				method.apply(this, args);
			}
		}, this._context);
	},

	/**
	 * Convert query string into object.
	 * For example "?key1=value1&key2=value2" will be converted to {"key1": "value1", "key2": "value2"}
	 *
	 * @param {String} query - Query string.
	 * @return {Object}
	 */
	query2Object: function(query) {
		if (!query || query[0] !== '?' || !query[1]) {
			return {};
		}

		query = '{"' + query;
		// remove "?"and "?&"at the beginning and "&" at the end
		query = query.replace(/\?(?!\&)|\?\&|\&$/g, '');
		query = query.replace(/=/g, '":"');
		query = query.replace(/&/g, '","');
		query += '"}';

		return JSON.parse(query);
	},

	/**
	 * Convert object into query string .
	 * For example {"key1": "value1", "key2": "value2"} will be converted to "?key1=value1&key2=value2"
	 *
	 * @param {String} obj - Object that will be converted into query string.
	 * @return {Object}
	 */
	object2Query: function(obj) {
		var queries = [];
		_.forEach(obj, function(value, key) {
			if (value) {
				queries.push(key + '=' + value);
			}
		});

		return queries.length === 0 ? '' : '?' + queries.join('&');
	},

	/**
	 * Convert human readable route like "path/:part" into RegExp undestandable part "path/(\w+)"
	 *
	 * @param {String} route - Route, that should be converted
	 */
	_preprocessRouteName: function(route, prefix) {
		if (prefix) {
			prefix = '(?:' + prefix + ')?';
		} else {
			prefix = '';
		}

		route = route.replace(/\:[\w\-\.]+/g, '([\\w\\-\\.]+\/?)');

		return '^#' + prefix + route + '/?$';
	},

	/**
	 * Get hash part of the URL.
	 *
	 * @param {String} url - URL.
	 * @return {String}
	 */
	_getHash: function(url) {
		var match = this.hashRegExp.exec(url) || [];

		return match[1] || match[2] || '#';
	},

	/**
	 * Get query part of the URL.
	 *
	 * @param {String} url - URL.
	 * @return {String|undefined}
	 */
	_getQuery: function(url) {
		var result;
		var match = this.queryRegExp.exec(url) || [];

		if (match[1]) {
			result = match[1];

			if (match[2]) {
				result += '&' + (match[2]).slice(1);
			}
		} else if (match[3]) {
			result = match[3];
		}

		return result;
	}
});
