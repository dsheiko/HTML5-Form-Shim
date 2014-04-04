/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Value Object representing constraint validation API validity default state
 * @module App/Input/Abstract/Validator/Vo/ValidityDefaultState
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
 * @alias module:App/Input/Abstract/Validator/Vo/ValidityDefaultState
 */
define(function() {
	return function() {
		/** @lends module:App/Input/Abstract/Validator/Vo/ValidityDefaultState.prototype */
		return {
			/**
			 * Returns true if the element has no value but is a required field; false otherwise.
			 * @type {boolean}
			 */
			valueMissing: false,
			/**
			 * Returns true if the element's value is not in the correct syntax; false otherwise.
			 * @type {boolean}
			 */
			typeMismatch: false,
			/**
			 * Returns true if the element's value doesn't match the provided pattern; false otherwise.
			 * @type {boolean}
			 */
			patternMismatch: false,
			/**
			 * Returns true if the element's value is longer than the provided maximum length; false otherwise.
			 * @type {boolean}
			 */
			tooLong: false,
			/**
			 * Returns true if the element's value is lower than the provided minimum; false otherwise.
			 * @type {boolean}
			 */
			rangeUnderflow: false,
			/**
			 * Returns true if the element's value is higher than the provided maximum; false otherwise.
			 * @type {boolean}
			 */
			rangeOverflow: false,
			/**
			 * Returns true if the element's value doesn't fit the rules given by the step attribute; false otherwise.
			 * @type {boolean}
			 */
			stepMismatch: false,
			/**
			 * Returns true if the user has provided input in the user interface that the user agent
			 * is unable to convert to a value; false otherwise.
			 * @type {boolean}
			 */
			badInput: false,
			/**
			 * Returns true if the element has a custom error; false otherwise.
			 * @type {boolean}
			 */
			customError: false,
			/**
			 * Returns true if the element's value has no validity problems; false otherwise.
			 * @type {boolean}
			 */
			valid: true
		};
	};
});