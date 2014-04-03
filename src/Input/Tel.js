/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Number Tel
 * @module Tel/Number
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
 * @alias module:Tel/Number
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
		NAME = "Input/Tel";
	/** @lends module:Tel/Number.prototype */
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
					var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
					config.debug && console.log( "Module Input/Tel: validation" );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
						"Please enter a valid tel. number +1 11 11 11" );
				};
			}
		};
	};
});