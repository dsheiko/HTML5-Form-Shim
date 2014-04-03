/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Email Input
 * @module Input/Email
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
 * @alias module:Input/Email
 */
define(function() {
	"use strict";
	var /** @type {module:config} */
			config = require( "../config" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
		 NAME = "Input/Email";

	/** @lends module:Input/Email.prototype */
	return function() {
		return {
			__extends__: require( "Abstract" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					var pattern = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
					config.debug && console.log( "%s: validates value of %o", NAME, this.boundingBox.get( 0 ) );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
							"Please enter a valid email address" );
				};
			}
		};
	};
});