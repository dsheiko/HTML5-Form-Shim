/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Number Input
 * @module App/Input/Number
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
 * @alias module:App/Input/Number
 */
define(function( require ) {
	"use strict";
	/** @type {module:App/Misc/util} */
	var util = require( "../Misc/util" ),
			/** @type {module:App/Misc/log} */
			log = require( "../Misc/log" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
			NAME = "Input/Number";
	/** @lends module:App/Input/Number.prototype */
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
					util.isNumber( parseFloat( this.boundingBox.val(), 10 ) ) ||
						this.throwValidationException( "typeMismatch",
							"Please enter a valid number" );
					if ( this.boundingBox.attr( "min" ) &&
							parseFloat( this.boundingBox.val(), 10 ) < parseFloat( this.boundingBox.attr( "min" ), 10 ) ) {
						this.throwValidationException( "rangeUnderflow" );
					}

					if ( this.boundingBox.attr( "max" ) &&
						parseFloat( this.boundingBox.val(), 10 ) > parseFloat( this.boundingBox.attr( "max" ), 10 ) ) {
						this.throwValidationException( "rangeOverflow" );
					}
				};
			}
		};
	};
});