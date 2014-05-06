/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Email Input
 * @module App/Input/Email
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
 * @alias module:App/Input/Email
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
		 NAME = "Input/Email";

	/** @lends module:App/Input/Email.prototype */
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
					var pattern = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\.]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
					log.log( NAME, "validates value", this.boundingBox.get( 0 ) );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
							"Please enter a valid email address" );
				};
			}
		};
	};
});