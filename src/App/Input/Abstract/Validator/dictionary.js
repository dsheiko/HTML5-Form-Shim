/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module App/Input/Abstract/Validator/dictionary
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
 * @alias module:App/Input/Abstract/Validator/dictionary
 */
define(function() {
	return {
		en: {
			valueMissing: "Please fill out this field",
			typeMismatch: "",
			patternMismatch: "The pattern is mismatched",
			rangeUnderflow: "The value is too low",
			rangeOverflow: "The value is too high",
			tooLong: "The value is too long",
			stepMismatch: "Invalid step for the range",
			badInput: "The user agent is unable to convert to a value",
			customError: "" },
		de: {
			valueMissing: "Bitte füllen Sie dieses Feld aus",
			typeMismatch: "",
			patternMismatch: "Die Eingabe stimmt nicht mit dem vorgegebenen Muster überein",
			rangeUnderflow: "Der Wert ist zu niedrig",
			rangeOverflow: "Der Wert ist zu hoch",
			tooLong: "Die Eingabe ist zu lang",
			stepMismatch: "Ungültiger Schritt in diesem Bereich",
			badInput: "Der Browser kann die Eingabe nicht in einen gültigen Wert umwandeln",
			customError: ""
		}
	};
});