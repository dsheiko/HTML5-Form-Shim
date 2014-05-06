/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module App/Input/Abstract/Validator
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
 * @alias module:App/Input/Abstract/Validator
 */
define(function( require ) {
	/**
	 * @param {Node} node
	 * @param {Boolean} isFormCustomValidation
	 */
	return function( $node ){
		/** @type {module:App/jQuery} */
		var $ = require( "jquery" ),
				/**
				* @type {module:App/Misc/util}
				*/
				util = require( "../../Misc/util" ),
				/**
				* Value Object representing constraint validation API validity default state
				* @type {modele:Input/Abstract/Validator/Vo/ValidityDefaultState}
				*/
				ValidityDefaultStateVo = require( "./Vo/ValidityDefaultState" ),
				/**
				* @type (module:App/dictionary)
				*/
				defaultValidationMessages = require( "./Validator/dictionary" );

		/** @lends module:App/Input/Abstract/Validator.prototype */
		return {
			/**
			* reference to the bound validation message container
			* @type {Node}
			*/
			validationMessageNode: null,
			/**
			* @type {Node}
			*/
			boundingBox: $node,
			/**
			* Constraint validation API
			* @type {module:App/Vo/ValidityDefaultState}
			*/
			validity: new ValidityDefaultStateVo(),
			/**
			* Returns the error message that would be shown to the user if the element was to be checked for validity.
			* @type (string)
			*/
			validationMessage: "",
			/**
			 * @constructs
			 */
			init: function(){
				var that = this;
				// Support checkValidity element method
				$node.checkValidity = function() {
					return that.checkValidity();
				};
				this.lookForValidationMessageNode();
			},
			/**
			 * Reset input validation state to defaults
			 */
			reset: function() {
				this.validationMessage = "";
				this.validity = new ValidityDefaultStateVo();
			},
			/**
			* Emulate API method checkValidity
			* @access public
			*/
			checkValidity: function() {
				this.validateRequired();
				if ( this.isRequired() || !this.isEmpty() ) {
					this.checkValidityWithoutRequired();
				}
				this.validateValue && this.validateValue();
				return this.validity.valid;
			},
			/**
			* We don't validate required on input, otherwise
			* it would report error as soon as one focuses on the field
			* @access protected
			*/
			checkValidityWithoutRequired: function() {
				this.validateValue && this.validateValue();
				this.validateByPattern();
				this.validateCustomValidity();
			},
			/**
			* Fallback for isRequired validator
			* @access public
			* @returns {object} ValidationLogger
			*/
			validateRequired: function() {
				if ( this.isRequired() && this.isEmpty() ) {
					this.throwValidationException( "valueMissing" );
				}
			},
			/**
			* Is the input value empty
			* @access public
			* @returns {boolean}
			*/
			isEmpty: function() {
				return ( $node.val() === $node.attr( "placeholder" ) ||
					!$node.val() );
			},

			/**
			 * Access value  for $.setCustomInputTypeValidator
			 * @returns {*}
			 */
			val: function() {
				return $node.val();
			},

			/**
			* Tell is the input required
			* @access public
			* @returns {boolean}
			*/
			isRequired: function() {
				return $node.hasClass( "required" );
			},

			/**
			* If validation message node assigned for this input found
			* It will be used instead of tooltip
			*/
			lookForValidationMessageNode: function() {
				var id = $node.attr( "id" ), $hint;
				if ( id ) {
					$hint = $( "form *[data-validation-message-for='" + id + "']" );
					this.validationMessageNode = $hint.length ? $hint : null;
				}
			},
			/**
			* Show message in validation message placeholder node
			* @access public
			*/
			showValidationMessage: function() {
				var msg = this.validationMessage;
				if ( !this.validationMessageNode ) {
					return;
				}
				this.validationMessageNode.html( msg );
				this.validationMessageNode[ msg ? "show" : "hide" ]();
			},

			/**
			* Is used on form submittion to check if
			* data-customvalidity attr. was not changed externally (e.g. AJAX)
			* @access public
			*/
			validateCustomValidity: function() {
				if ( $node.data( "customvalidity" ) ) {
					this.throwValidationException( "customError",
						$node.data( "customvalidity" )
					);
					return false;
				}
				return true;
			},

			/**
			* Is invoked after every validation
			* @access protected
			* @param {string} prop
			* @param {string} validationMessage
			*/
			throwValidationException: function( prop, validationMessage ) {
				var msgContainer = defaultValidationMessages[ util.language ] ||
					defaultValidationMessages.en;
				if ( this.validity[ prop ] === undefined ) {
					throw new SyntaxError(
					"Invalid validity property '" +
					prop + "'" );
				}
				this.validity[ prop ] = true;
				this.validity.valid = false;

				this.validationMessage = validationMessage ||
					msgContainer[ prop ];
				this.shimConstraintValidationApi();
			},
			/**
			* Try to emulate Constraint Validation Api
			* http://www.w3.org/html/wg/drafts/html/master/forms.html#the-constraint-validation-api
			* on legacy browsers
			* @access protected
			*/
			shimConstraintValidationApi: function() {
				var node = $node.get( 0 );
				try {
					node.validity = this.validity;
				} catch ( err ) {
					// If the element has only getter (new browsers)
					// just ignore it
				}
			},
			/**
			* Fallback for pattern validator
			* @access public
			* @returns {boolean}
			*/
			validateByPattern: function() {
				var pattern = new RegExp( $node.attr( "pattern" ), "g" );
				if (!$node.attr( "pattern" )) {
					return true;
				}
				pattern.test( $node.val() ) ||
					this.throwValidationException( "patternMismatch",
						$node.attr( "title" ) || null );
			}
		};
	};
});