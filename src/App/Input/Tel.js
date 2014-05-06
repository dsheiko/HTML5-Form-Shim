/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Number Tel
 * @module App/Tel/Number
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
 * @alias module:App/Tel/Number
 */
define(function( require ) {
	"use strict";
	var /** @type {module:App/Misc/log} */
			log = require( "../Misc/log" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Tel";
	/** @lends module:App/Tel/Number.prototype */
	return function() {
		return {
			__extends__: require( "./Abstract" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				log.log( NAME, "initializes", this.boundingBox.get( 0 ) );
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
					log.log( NAME, "validates", this.boundingBox.get( 0 ) );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
						"Please enter a valid tel. number +1 11 11 11" );
				};
			}
		};
	};
});