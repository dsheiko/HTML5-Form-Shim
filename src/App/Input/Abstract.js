/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module App/Input/Abstract
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
 * @alias module:App/Input/Abstract
 */
define(function( require ) {
	/** @type {module:App/jQuery} */
	var $ = require( "jquery" ),
			/** @type {module:App/Input/Abstract/Shim} */
			Shim = require( "./Abstract/Shim" ),
			/** @type {module:App/Input/Abstract/Validator} */
			Validator = require( "./Abstract/Validator" );
	/** @lends module:App/Input/Abstract.prototype */
	return function(){
		return {
			/**
			* Reference to the input element
			* @type {Node}
			*/
			boundingBox: null,
			/**
			 * @type {module:App/Input/Abstract/Validator}
			 */
			validator: null,
			/**
			 * @type {function}
			 */
			validateValue: null,
			/**
			 * @type {module:App/Input/Abstract/Shim}
			 */
			shim: null,

			/**
			* Input constructor
			* @constructs module:App/Input/Abstract
			* @param {Node} boundingBox
			* @param {boolean} isFormCustomValidation
			*/
			__constructor__: function( boundingBox, isFormCustomValidation ) {
				this.boundingBox = boundingBox;
				this.validator = new Validator( boundingBox, isFormCustomValidation );
				this.validator.init();
				this.shim = new Shim( boundingBox, isFormCustomValidation, this );
				this.shim.init();
				this.updateState();
			},
			/**
			* Update status of the input
			* @access public
			* @returns (string) state
			*/
			updateState: function() {
				var state = this.validator.validity.valid ? "valid" : "invalid";
				this.boundingBox
					.removeClass( "valid invalid" )
					.addClass( state );
				this.shim.shimConstraintValidationApi( this.validator.validity, this.validator.validationMessage );
				return state;
			},
			/**
			* Show tooltip with the validation message on the input
			* @access public
			* @param {string} msg
			*/
			showTooltip: function( msg ) {
				$.setCustomValidityCallback.apply( this.boundingBox,
					[ msg || this.validator.validationMessage ]);
			},
			/**
			 * Stub to support 2.2 branch
			 * @returns {module:App/Input/Abstract} self
			 */
			degrade: function() {
				return this;
			},
			/**
			 * Access shim.isShimRequired
			 * @returns {Boolean}
			 */
			isShimRequired: function() {
				return this.shim.isShimRequired();
			}
		};
	};
});