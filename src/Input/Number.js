/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Number Input
 * @module Input/Number
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
 * @alias module:Input/Number
 */
define(function() {
	"use strict";
	/** @type {module:util} */
	var util = require( "../Misc/util" ),
		/** @type {module:config} */
		config = require( "../config" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Number";
	/** @lends module:Input/Number.prototype */
	return function() {
		return {
			__extends__: require( "Abstract" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
					util.isNumber( parseInt( this.boundingBox.val(), 10 ) ) ||
						this.throwValidationException( "typeMismatch",
							"Please enter a valid number" );
					if ( this.boundingBox.attr( "min" ) &&
							parseInt( this.boundingBox.val(), 10 ) < parseInt( this.boundingBox.attr( "min" ), 10 ) ) {
						this.throwValidationException( "rangeUnderflow" );
					}

					if ( this.boundingBox.attr( "max" ) &&
						parseInt( this.boundingBox.val(), 10 ) > parseInt( this.boundingBox.attr( "max" ), 10 ) ) {
						this.throwValidationException( "rangeOverflow" );
					}
				};
			}
		};
	};
});