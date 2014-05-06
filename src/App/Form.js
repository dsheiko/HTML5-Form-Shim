/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing form
 * @module App/Form
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
 * @alias module:App/Form
 */
define(function( require ) {
	/** @type {module:jQuery} */
	var $ = require( "jquery" ),
			/** @type {module:App/Misc/util} */
			util = require( "./Misc/util" ),
			 /** @type {module:App/Misc/log} */
			log = require( "./Misc/log" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
		  NAME = "Form",
			/**
			* Abstract input (input of a given type or textarea)
			* @type {module:App/Input/Abstract}
			*/
			AbstractInput = require( "./Input/Abstract" ),
			/**
			* Input type custom validators
			* @type {object}
			*/
			inputConstructors = {
				Text: require( "./Input/Text" ),
				Tel: require( "./Input/Tel" ),
				Email: require( "./Input/Email" ),
				Number: require( "./Input/Number" ),
				Url: require( "./Input/Url" )
			},
			/**
			 * @alias module:App/form
			 */
			Form = function(){
				/** @lends module:App/Form.prototype */
				return {
					/**
					* Reference to the form element
					* @type {Node}
					*/
					boundingBox: null,
					/**
					* List of monitored child inputs
					* @type {Object}
					*/
					inputs: {},
					/**
					* Options interface
					* @type {Object}
					* @property {Node} boundingBox - form container
					* @property {string} inputs - list of controls of the interest
					* @property {Object} handlers - custom handlers
					*/
					options: {
						boundingBox: null,
						inputs: "input, textarea",
						/**
						 * @type {Object}
						 * @property {function} onSubmit - form onSubmit custom handler placeholder
						 */
						handlers: {
							onSubmit: function(){}
						}

					},
					/**
					* Returns true if the form has no validity problems; false otherwise.
					* @type {boolean}
					*/
					valid: true,
					/**
					* @constructs
					* @param {object} options
					*/
					__constructor__: function( options ) {
						var that = this;

						if ( !options.boundingBox ) {
							throw new Error( "Options property boundingBox undefined ");
						}
						this.boundingBox = options.boundingBox;

						log.log( NAME, "initializes", this.boundingBox.get( 0 ) );

						$.extend( this.options, options );

						if (this.isCustomValidation()) {
							this.boundingBox.attr( "novalidate", "novalidate" );
						}
						this.shimFormAttrMutators();

						inputConstructors && this.init();

						this.boundingBox.on( "submit", function( e ){
							that.handleOnSubmit( e );
						});
					},



					/**
					* Get AbstractInput by node
					* @access public
					* @param {Node} node
					* @returns (module:App/Input/AbstractInput)
					*/
					getInput: function( node ) {
						// HTMLElement given
						var $node = $( node ),
								find = util.filter( this.inputs, function( el ){
									return $node.get( 0 ) === el.boundingBox.get( 0 );
								});
						return find.length ? find[ 0 ] : null;
					},

					/**
					* Init child inputs
					* @access protected
					*/
					init: function() {
						var that = this;
						// Untie object reference
						this.inputs = [];

						this.boundingBox.find( this.options.inputs ).each(function(){
							var $node = $( this ),
								instance;
							if ( !that.getInput( $node ) ) {
								instance = that.inputFactory( $node );
								instance && that.inputs.push( instance );
							}
						});
					},
					/**
					* Make an instance of custom validator for a given input type
					* @access public
					* @param {Node} element
					* @constructs module:App/Input/AbstractInput
					*/
					inputFactory: function( element ) {
						var type = util.ucfirst( element.data( "type" ) || element.attr( "type" ) );
						// If the element has pattern attribute it removes the validator assigned to the eleent type
						if ( element.is( "[pattern]" ) ) {
							type = "Text";
						}
						return util
							.createInstance( inputConstructors[ type ] || inputConstructors.Text,
								[ element, this.isCustomValidation() ] );
					},
					/**
					 * Reset validator for each input
					 */
					reset: function() {
						$.each( this.inputs, function(){
							this.validator.reset();
						});
					},
					/**
					* Shim formaction, formenctype, formmethod, and formtarget
					* http://html5doctor.com/html5-forms-introduction-and-new-attributes/#formaction
					* @access protected
					*/
					shimFormAttrMutators: function() {
						var that = this;
						// From the specification:
						// It has effect on the form element and can only be used with a submit
						// or image button (type="submit" or type="image").
						this.boundingBox.find( "button[type=submit], button[type=image]" ).each(function(){
							$( this ).attr( "formaction" )  &&
								$( this ).on( "click", function() {
									that.boundingBox.attr( "action", $( this ).attr( "formaction" ) );
								});
							$( this ).attr( "formenctype" ) &&
								$( this ).on( "click", function() {
									that.boundingBox.attr( "enctype", $( this ).attr( "formenctype" ) );
								});
							$( this ).attr( "formmethod" ) &&
								$( this ).on( "click", function() {
									that.boundingBox.attr( "method", $( this ).attr( "formmethod" ) );
								});
							$( this ).attr( "formtarget" ) &&
								$( this ).on( "click", function() {
									that.boundingBox.attr( "target", $( this ).attr( "formtarget" ) );
								});
						});
					},
					/**
					* Is data-custom-validation attribute set?
					* @access public
					* @returns {boolean}
					*/
					isCustomValidation: function() {
						return ( this.boundingBox.data( "custom-validation" ) !== undefined );
					},
					/**
					* Is novalidate attribute set?
					* @access public
					* @returns {boolean}
					*/
					isNoValidate: function() {
						return ( this.boundingBox.attr( "novalidate" ) !== undefined );
					},
					/**
					* Set form to valid state
					* @access public
					*/
					setValid: function() {
						this.valid = true;
						this.boundingBox.addClass( "valid" ).removeClass( "invalid" );
					},
					/**
					* Set form to invalid state
					* @access public
					*/
					setInvalid: function() {
						this.valid = false;
						this.boundingBox.addClass( "invalid" ).removeClass( "valid" );
					},
					/**
					* Handle on-submit event
					* @param {Event} e
					* @access protected
					*/
					handleOnSubmit: function( e ) {
						var isValid = true, i, input;
						if ( !this.inputs ) {
							return;
						}
						log.log( NAME, "submitted", this.boundingBox.get( 0 ) );
						for( i in this.inputs ) {
							if ( this.inputs.hasOwnProperty( i ) ) {
								input = this.inputs[ i ];
								// Reset input validity info before validation
								input.validator.reset();
								input.validator.showValidationMessage();
								if ( input.shim.isShimRequired() ) {
										input.validator.checkValidity();
										input.updateState();
										JSON.stringify && log.log( "Input/*", "validity: " + JSON.stringify( input.validator.validity ) +
												", validation message: " + input.validator.validationMessage,
												input.boundingBox.get( 0 ) );
										// Here check for validity
										if ( !input.validator.validity.valid ) {
											if ( input.validator.validationMessageNode ) {
												input.validator.showValidationMessage();
											} else {
												// Show tooltip ONCE and stop propagation
												isValid && input.showTooltip();
											}
											isValid = false;
										}
								}
							}
						}
						$.__resetInputsAcrossThePage();
						log.log( NAME, "validation status is " + ( isValid ? "true" : "false" ), this.boundingBox.get( 0 ) );
						if ( isValid ) {
							this.setValid();
							// Invoke given onSubmit handler
							this.options.handlers.onSubmit();
						} else {
							this.setInvalid();
							e.preventDefault();
							e.stopImmediatePropagation();
						}
					}
				};
			};

	/**
	 * @callback validatorCb
	 * @param {Node} jQuery
	 * @param {object} ValidationLogger
	 * @returns {boolean}
	 */
	/**
	 * @callback initCb
	 * @param {Node} jQuery
	 * @param {object} ValidationLogger
	 * @returns {boolean}
	 */

	/**
	* Set custom validator
	*
	* @param {string} type - e.g. Zip
	* @param {string} msg - validation message
	* @param {validatorCb} validatorCb - validatorCb( node: jQuery, logger: ValidationLogger ): boolean
	* @param {initCb} initCb - initCb( node: jQuery, logger: ValidationLogger ): boolean
	*/
	Form.setCustomInputTypeValidator = function( type, msg, validatorCb, initCb ) {
		/**
		* @class
		* @name Input.AbstractType
		*/
		inputConstructors[ util.ucfirst( type ) ] = function() {
			return {
				__extends__: AbstractInput,
				/**
				* @constructs
				*/
				__constructor__: function() {
					initCb && initCb.apply( this.boundingBox, [ this ] );
					/**
					* Validate input value
					*/
					this.validator.validateValue = function() {
						validatorCb.apply( this.boundingBox, [ this ] ) ||
							this.throwValidationException( "customError", msg );
					};
				}
			};
		};
	};
	return Form;
});