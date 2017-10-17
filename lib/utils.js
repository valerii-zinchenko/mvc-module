/*
 * mvc-pack
 *
 * Copyright (c) 2016-2017 Valerii Zinchenko
 *
 * Licensed under MIT (http://valerii-zinchenko.github.io/mvc-pack/blob/master/LICENSE.txt)
 *
 * All source files are available at: http://github.com/valerii-zinchenko/mvc-pack
 */


/**
 * @file It contains some [utility functions]{@link utils}.
 *
 * @author Valerii Zinchenko
 *
 * @version 1.1.0
 */

'use strict';

/**
 * Utility functions.
 *
 * @namespace
 */
var utils = {
	/**
	 * Get the type of the data
	 *
	 * @param {*} data - Data what will be discovered
	 * @return {String} - Type of the data
	 */
	whatIs: function(data) {
		return Object.prototype.toString.call(data);
	},

	/**
	 * Check the specific type of an input argument.
	 *
	 * @param {*} data - Argument that will be checked.
	 * @param {String} type - Expected type name, like Object, Array etc.
	 * @return {boolean}
	 */
	is: function(data, type) {
		return this.whatIs(data) === '[object ' + type + ']';
	}
};
