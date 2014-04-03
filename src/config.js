/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
 * @constructor
 * @alias module:config
 */
define(function() {
	"use strict";
	return {
		debug: true
	};
});