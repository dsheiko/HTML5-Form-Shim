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
define(function() {
	/**
	 * @param {Node} $node
	 * @param {Boolean} isFormCustomValidation
	 * @param {undefined} undefined
	 */
	return function( $node, isFormCustomValidation, undefined ){
		/** @type {module:App/jQuery} */
		var $ = require( "jQuery" ),
				/** @type {module:App/config} */
				config = require( "../../config" ),
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
			 H5_INPUT_TYPES = [ "color", "date", "datetime", "datetime-local", "email", "month",
				 "number", "range", "search", "tel", "time", "url", "week" ],
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
				if ( isFormCustomValidation && $.inArray( $node.attr( "type" ), H5_INPUT_TYPES ) ) {
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
				if ( isFormCustomValidation && !modernizr.supportedInputProps.autofocus ) {
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
			disableH5Validation: function() {
				$node.attr( "novalidate", "novalidate" );
			},
			/**
			* Add required class to element. That goes for
			* styling as well as for further checks
			* @access protected
			*/
			shimRequiredAttr: function() {
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
			shimFocusPseudoClass: function() {
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
			shimAutofocus: function() {
				if ( $node.attr( "autofocus" ) !== undefined ) {
					$node.focus();
					this.handleOnFocus();
				}
			},
			/**
			* Fallback placeholder handler
			* @access protected
			*/
			shimPlaceholder: function() {
				var that = this;
				if ( $node.attr( "placeholder" ) !== undefined ) {
					$node.attr( "autocomplete", "false" );
					// Display placeholder
					this.handleOnBlur();
					// Sync UI
					$node
						.on( "focusin", function() {
							that.handleOnFocus();
						})
						.on( "focusout", function() {
							that.handleOnBlur();
						});
				}
			},
			/**
			* Emulates oninput event
			* @access protected
			*/
			handleOnInput: function() {
				var that = this;
				if ( null !== deferredRequest ) {
					window.clearTimeout( deferredRequest );
				}
				deferredRequest = window.setTimeout( function(){
					// Reset input validity info before validation
					that.resetValidationState();
					deferredRequest = null;
					that.invokeOnInputCallBack();
					$node.trigger( "oninput", that );
					that.checkValidityWithoutRequired();
					that.updateState();




					that.validationMessageNode && that.showValidationMessage();
				}, ONINPUT_DELAY );
			},
			/**
			* Calls a global handler specified in oninput attribute
			* @access protected
			*/
			invokeOnInputCallBack: function() {
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
			handleOnFocus: function() {
				if ( $node.val() === $node.attr( "placeholder" ) ) {
					$node.val( "" );
					$node.removeClass( "placeholder" );
				}

			},
			/**
			* Restore placeholder on blur
			* @access protected
			*/
			handleOnBlur: function() {
				if ( !$node.val() ) {
					$node.val( $node.attr( "placeholder" ) );
					$node.addClass( "placeholder" );
				}
			},
			/**
			* Subscribe for oninput events
			* @access protected
			*/
			shimOnInput: function() {
				var that = this;
				$node
					.on( "change mouseup keydown", function() {
						that.handleOnInput();
					});
				// @TODO: Context menu handling:
				// $node.get().oncontextmenu =  _private.handleOnInput;
			},

			/**
			* Shim is required when the input type isn't supported
			* or custom validation requsted
			* @access public
			* @returns (boolean)
			*/
			isShimRequired: function() {
				return isFormCustomValidation || !modernizr.supportedInputTypes[ $node.attr( "type" ) ] ||
					$node.data( "custom-validation" );
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
			 *
			 * @returns {undefined}
			 */
			shimSetCustomValidity: function() {
				$node.get( 0 ).setCustomValidity = function( msg ) {
					msg && this.throwValidationException( "customError", msg );
					$node.get( 0 ).setCustomValidity( msg );
				};
			},

			/**
			* Set attribute text to avoid collisions with browser
			* embedded input handlers
			* @access public
			*/
			degrade: function() {
				config.debug && console.log( "%s: degraded %o", NAME, $node.get( 0 ) );
				$node.get( 0 ).type = "text";
				return this;
			}

		};
	};
});