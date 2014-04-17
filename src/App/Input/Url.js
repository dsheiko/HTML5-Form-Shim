/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Url Input
 * @module App/Input/Url
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
 * @alias module:App/Input/Url
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
			NAME = "Input/Url";
	/** @lends module:App/Input/Url.prototype */
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
					// The pattern is taken from http://stackoverflow.com/questions/2838404/javascript-regex-url-matching
					// pattern fragments: protocol, domain name OR ip (v4) address, port and path, query string, fragment locater
					var pattern = new RegExp( "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d\\-]*[a-z\\d])*)\\.)" +
						 "+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[\\-a-z\\d%_.~+]*)" +
						 "*(\\?[;&a-z\\d%_.~+=\\-]*)?(\\#[\\-a-z\\d_]*)?$", "i" );
					log.log( NAME, "validates", this.boundingBox.get( 0 ) );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
							"Please enter a valid URL" );
				};
			}
		};
	};
});