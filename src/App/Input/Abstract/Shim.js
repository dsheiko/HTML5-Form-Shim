/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module App/Input/Abstract/Shim
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
 * @alias module:App/Input/Abstract/Shim
 */
define(function( require ) {
	/**
	 * @param {Node} $node
	 * @param {Boolean} isFormCustomValidation
	 * @param {module:App/Input/Abstract} input
	 * @param {undefined} undefined
	 */
	return function( $node, isFormCustomValidation, input, undefined ){
		/** @type {module:App/jQuery} */
		var $ = require( "jquery" ),
				/** @type {module:App/Misc/log} */
				log = require( "../../Misc/log" ),
				/**
				 * @constant
				 * @default
				 * @type {string}
				 */
				NAME = "Input/Abstract/Shim",
				/**
				* HTML5 specific input types
				* @constant
				* @default
				* @type {string[]}
				*/
				H5_INPUT_TYPES = [
					"color",
					"date",
					"datetime",
					"datetime-local",
					"email",
					"month",
					"number",
					"range",
					"search",
					"tel",
					"time",
					"url",
					"week"
				],
				/**
				* Especiall types that must not be degraded
				* @constant
				* @default
				* @type {string[]}
				*/
				SPEC_TYPES = [
				 "password"
				],
				/**
				 * Module that detects HTML5 and CSS3 features in the user’s browser
				 * @type {modele:modernizr}
				 */
				 modernizr = require( "../../Misc/modernizr" ),
				/**
				*  How long on-input event handler waits before catching the input
				*  @constant
				*  @default
				*/
				ONINPUT_DELAY = 500,
				/**
				* Timeout id
				* @type {number}
				*/
				deferredRequest = null;

		/** @lends module:App/Input/Abstract/Shim.prototype */
		return {
			/**
			 * @constructs
			 */
			init: function(){
				this.shimSetCustomValidity();
				// Degrade type of input to text when it's one of HTML5 specific types
				if ( isFormCustomValidation && $.inArray( $node.attr( "type" ), H5_INPUT_TYPES ) &&
					$.inArray( $node.attr( "type" ), SPEC_TYPES ) ) {
					this.degrade();
				}
				// Shim placeholder attribute when it's not supported
				if ( isFormCustomValidation || !modernizr.supportedInputProps.placeholder ) {
					this.shimPlaceholder();
				}
				// Shim required attribute when it's not supported
				if ( isFormCustomValidation || !modernizr.supportedInputProps.required ) {
					this.shimRequiredAttr();
				}
				// Shim autofocus attribute when it's not supported
				if ( isFormCustomValidation || !modernizr.supportedInputProps.autofocus ) {
					this.shimFocusPseudoClass();
					this.shimAutofocus();
				}
				// If custom-validation attr declared,
				// it disables default H5 form handler
				$node.data( "custom-validation" ) && this.disableH5Validation();

				// Shim Input event when the input type isn't supported or custom validation requsted
				this.isShimRequired() && this.shimOnInput();
			},
			/**
			 * Disable HTML5 validatin on the input
			 */
			disableH5Validation: function(){
				$node.attr( "novalidate", "novalidate" );
			},
			/**
			* Add required class to element. That goes for
			* styling as well as for further checks
			* @access protected
			*/
			shimRequiredAttr: function(){
				$node.attr( "required" ) === undefined ||
					$node
						.removeAttr( "required" )
						.addClass( "required" )
						.data( "custom-validation", "true" );
			},
			/**
			* Toggle .focus class on the input on focus/blur events
			* @access protected
			*/
			shimFocusPseudoClass: function(){
				$node
					.on( "focus", function(){
						$node.addClass( "focus" );
					})
					.on( "blur", function(){
						$node.removeClass( "focus" );
					});
			},
			/**
			* Force focus
			* and remove placeholder
			* @access protected
			*/
			shimAutofocus: function(){
				if ( $node.attr( "autofocus" ) !== undefined ) {
					$node.focus();
					this.handleOnFocus();
				}
			},
			/**
			* Fallback placeholder handler
			* @access protected
			*/
			shimPlaceholder: function(){
				var that = this;
				if ( $node.attr( "placeholder" ) !== undefined ) {
					$node.attr( "autocomplete", "false" );
					// Display placeholder
					this.handleOnBlur();
					// Sync UI
					$node
						.on( "focusin", function(){
							that.handleOnFocus();
						})
						.on( "focusout", function(){
							that.handleOnBlur();
						});
				}
			},
			/**
			* Emulates oninput event
			* @access protected
			*/
			handleOnInput: function(){
				var that = this;

				if ( null !== deferredRequest ) {
					window.clearTimeout( deferredRequest );
				}
				deferredRequest = window.setTimeout( function(){
					// Reset input validity info before validation
					input.validator.reset();
					input.validator.showValidationMessage();
					deferredRequest = null;
					that.invokeOnInputCallBack();
					$node.trigger( "input", that );
					input.validator.checkValidityWithoutRequired();
					input.updateState();
					// Show validation message online if msg node is bound
					input.validator.validationMessageNode && input.validator.showValidationMessage();
				}, ONINPUT_DELAY );
			},
			/**
			* Calls a global handler specified in oninput attribute
			* @access protected
			*/
			invokeOnInputCallBack: function(){
				var callbackKey, pos;
				if ( $node.attr( "oninput" ) !== undefined ) {
					callbackKey = $node.attr( "oninput" );
					pos = callbackKey.indexOf( "(" );
					callbackKey = pos ? callbackKey.substr( 0, pos ) : callbackKey;
					if ( typeof window[ callbackKey ] ) {
						window[ callbackKey ]( $node );
					}
				}
			},
			/**
			* Remove placeholder on focus
			* @access protected
			*/
			handleOnFocus: function(){
				$node.addClass( "focus" );
				if ( $node.val() === $node.attr( "placeholder" ) ) {
					$node.val( "" );
					$node.removeClass( "placeholder" );
				}

			},
			/**
			* Restore placeholder on blur
			* @access protected
			*/
			handleOnBlur: function(){
				$node.removeClass( "focus" );
				if ( !$node.val() ) {
					$node.val( $node.attr( "placeholder" ) );
					$node.addClass( "placeholder" );
				}
			},
			/**
			* Subscribe for oninput events
			* @access protected
			*/
			shimOnInput: function(){
				var that = this;
				$node
					.on( "change mouseup keydown", function(){
						that.handleOnInput();
					});
				// @TODO: Context menu handling:
				// $node.get().oncontextmenu =  .handleOnInput;
			},

			/**
			* Shim is required when the input type isn't supported
			* or custom validation requsted
			* @access public
			* @returns (boolean)
			*/
			isShimRequired: function(){
				return isFormCustomValidation || !modernizr.supportedInputTypes[ $node.attr( "type" ) ] ||
					$node.data( "custom-validation" );
			},
			/**
			 * Wrap with cross-cutting concern
			 * Example: input.setCustomValidity( "The two passwords must match." );
			 * @returns {undefined}
			 */
			shimSetCustomValidity: function(){
				var old = $node.get( 0 ).setCustomValidity || function(){};
				$node.get( 0 ).setCustomValidity = function( msg ) {
					msg && input.validator.throwValidationException( "customError", msg );
					old( msg );
				};
			},

			/**
			* Set attribute text to avoid collisions with browser
			* embedded input handlers
			* @access public
			*/
			degrade: function(){
				log.log( NAME, "degrades", $node.get( 0 ) );
				$node.get( 0 ).type = "text";
				return this;
			},
			/**
			 * reflect on properties of Constraint Validation API
			 * @param {Object} validityState
			 * @param {string} validationMessage
			 */
			shimConstraintValidationApi: function( validityState, validationMessage ){
				$.extend( $node.validity, validityState );
				$node.validationMessage = validationMessage;
			}
		};
	};
});