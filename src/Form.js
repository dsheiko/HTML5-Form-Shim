/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing form
 * @module Form
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
 * @alias module:Form
 */
define(function() {
	/** @type {module:jQuery} */
	var $ = require( "jQuery" ),
			/** @type {module:util} */
			util = require( "Misc/util" ),
			/** @type {module:config} */
			config = require( "config" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
		  NAME = "Form";
			/**
			* Abstract input (input of a given type or textarea)
			* @type {module:Input/Abstract}
			*/
			AbstractInput = require( "./Input/Abstract" ),
			/**
			* Input type custom validators
			* @type {object}
			*/
			Input = {
				Text: require( "./Input/Text" ),
				Tel: require( "./Input/Tel" ),
				Email: require( "./Input/Email" ),
				Number: require( "./Input/Number" ),
				Url: require( "./Input/Url" )
			},
			/**
			 * @type {Object}
			 * @property {number} incrementor
			 */
			Page = {
				incrementor: 0
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
	$.setCustomInputTypeValidator = function( type, msg, validatorCb, initCb ) {
		/**
		* @class
		* @name Input.AbstractType
		*/
		Input[ util.ucfirst( type ) ] = function() {
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


	return function(){
		/** @lends module:Form.prototype */
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

				config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );

				$.extend( this.options, options );
				// Untie object reference
				this.inputs = [];
				if (this.isCustomValidation()) {
					this.boundingBox.attr( "novalidate", "novalidate" );
				}
				this.shimFormAttrMutators();
				this.initInputs();
				this.boundingBox.on( "submit", function( e ){
					that.handleOnSubmit( e );
				});
			},
			/**
			* Obtain input local id (in-form unique hash)
			* If it is not defined, the function generates a new id and
			* bind it to the input
			* @access protected
			* @param {Node} $node
			* @returns (number)
			*/
			getLocalId: function( $node ) {
				var localId = $node.data( "local-id" ) || Page.incrementor++;
				$node.data( "local-id", Page.incrementor );
				return localId;
			},
			/**
			* Get AbstractInput by node
			* @access public
			* @param {Node} node
			* @returns (module:Input/AbstractInput)
			*/
			getInput: function( node ) {
				// HTMLElement given
				var $node = $( node ),
					localId = this.getLocalId( $node );
				return this.inputs[ localId ] || null;
			},
			/**
			* Collect child inputs to monitor
			* @access protected
			*/
			initInputs: function() {
				var that = this;
				this.boundingBox.find( this.options.inputs ).each(function(){
					var $node = $( this ),
						localId = that.getLocalId( $node ),
						instance = that.inputFactory( $node );

					if ( instance !== false ) {
						that.inputs[ localId ] = instance;
					}
				});
			},
			/**
			* Shim formaction, formenctype, formmethod, and formtarget
			* @access protected
			*/
			shimFormAttrMutators: function() {
				var that = this;
				this.boundingBox.find( "input, button" ).each(function(){
					$( this ).attr( "formaction" )  &&
						$( this ).on( "click", function() {
							that.boundingBox.attr( "action",
								$( this ).attr( "formaction" ) );
						});
					$( this ).attr( "formenctype" ) &&
						$( this ).on( "click", function() {
							that.boundingBox.attr( "enctype",
								$( this ).attr( "formenctype" ) );
						});
					$( this ).attr( "formmethod" ) &&
						$( this ).on( "click", function() {
							that.boundingBox.attr( "method",
								$( this ).attr( "formmethod" ) );
						});
					$( this ).attr( "formtarget" ) &&
						$( this ).on( "click", function() {
							that.boundingBox.attr( "target",
								$( this ).attr( "formtarget" ) );
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
			* Make an instance of custom validator for a given input type
			* @access public
			* @param {Node} element
			* @constructs module:Input/AbstractInput
			*/
			inputFactory: function( element ) {
				var type = util.ucfirst( element.data( "type" ) || element.attr( "type" ) );
				// If the element has pattern attribute it removes the validator assigned to the eleent type
				if ( element.is( "[pattern]" ) ) {
					type = "Text";
				}
				return util
					.createInstance( Input[ type ] || Input.Text, [ element, this.isCustomValidation() ] );
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
				for( i in this.inputs ) {
					if ( this.inputs.hasOwnProperty( i ) ) {
						input = this.inputs[ i ];
						// Reset input validity info before validation
						input.resetValidationState();
						if ( input.isShimRequired() ) {
								input.checkValidity();
								input.updateState();
								// Here check for validity
								if ( !input.validity.valid ) {
									if ( input.validationMessageNode ) {
										input.showValidationMessage();
									} else {
										// Show tooltip and stop propagation
										isValid && input.showTooltip();
									}
									isValid = false;
								}
						}
					}
				}
				// Invoke given onSubmit handler
				this.options.handlers.onSubmit();
				if ( isValid ) {
					this.setValid();
				} else {
					this.setInvalid();
					e.preventDefault();
				}
			}
		};
	};
});