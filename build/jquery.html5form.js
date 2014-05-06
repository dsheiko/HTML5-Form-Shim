/* jshint unused: false */
/**
 * @typedef module
 * @type {object}
 * @property {string} id - the identifier for the module.
 * @property {string} filename - the fully resolved filename to the module.
 * @property {module} parent - the module that required this one.
 * @property {module[]} children - the module objects required by this one.
 * @property {boolean} loaded - whether or not the module is done loading, or is in the process of loading
 */
/**
	*
	* Define scope for `require`
	*/
var _require = (function(){
	var /**
			* Store modules (types assigned to module.exports)
			* @type {module[]}
			*/
			imports = [],
			/**
			 * Store the code that constructs a module (and assigns to exports)
			 * @type {*[]}
			 */
			factories = [],
			/**
			 * @type {module}
			 */
			module = {},
			/**
			 * Implement CommonJS `require`
			 * http://wiki.commonjs.org/wiki/Modules/1.1.1
			 * @param {string} filename
			 * @returns {*}
			 */
			__require = function( filename ) {

				if ( typeof imports[ filename ] !== "undefined" ) {
					return imports[ filename ].exports;
				}
				module = {
					id: filename,
					filename: filename,
					parent: module,
					children: [],
					exports: {},
					loaded: false
				};
				if ( typeof factories[ filename ] === "undefined" ) {
					throw new Error( "The factory of " + filename + " module not found" );
				}
				// Called first time, so let's run code constructing (exporting) the module
				imports[ filename ] = factories[ filename ]( _require, module.exports, module );
				imports[ filename ].loaded = true;
				if ( imports[ filename ].parent.children ) {
					imports[ filename ].parent.children.push( imports[ filename ] );
				}
				return imports[ filename ].exports;
			};
	/**
	 * Register module
	 * @param {string} filename
	 * @param {function(module, *)} moduleFactory
	 */
	__require.def = function( filename, moduleFactory ) {
		factories[ filename ] = moduleFactory;
	};
	return __require;
}());
// Must run for UMD, but under CommonJS do not conflict with global require
if ( typeof require === "undefined" ) {
	require = _require;
}
_require.def( "src/h5formshim.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
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
 * @alias module:main
 */
define(function( require ) {
	"use strict";
		/**
			* Get reference to jQuery
			* @type {object}
			**/
		var
				/**
				 * @type {module:App/Misc/util}
				 */
				util = _require( "src/App/Misc/util.js" ),
				/**
				 *
				 * @type {jQuery}
				 */
				$ = _require( "jquery" ),

				/**
				* Page singleton
				* @type {module:App/Page}
				*/
				page = _require( "src/App/Page.js" ),
				/**
				* @type {module:App/Form}
				*/
				Form = _require( "src/App/Form.js" ),
				/**
				* @callback onReadyCb
				* @type {onReadyCb}
				*/
			  onReadyCb = function(){};

		/**
		 * Wrap $.setCustomInputTypeValidator defined in module:App/Form to make it caling page.init
		 */
		$.setCustomInputTypeValidator = function() {
			Form.setCustomInputTypeValidator.apply( this, arguments );
		};
		/**
		 * After form submit all the inputs must be reset
		 */
		$.__resetInputsAcrossThePage = function() {
			page.reset();
		};

		/**
		* Render tooltip when validation error happens on form submition
		* Can be overriden
		* @param {string} error
		*/
		$.setCustomValidityCallback = function( error ) {
					/** $type {{top: number, left: number }} */
			var pos = this.position(),
					/** @type {jQuery} */
					parentNode = this.parent(),
					/** @type {jQuery} */
					tooltip,
					/** @type {string} */
					tooltipId = "has-tip-" + Math.ceil( pos.left ) + "-" + Math.ceil( pos.top );


			// Skip if the target already provided with tooltip (even in waiting)
			if ( parentNode.hasClass( tooltipId ) ) {
				return;
			}
			parentNode.addClass( tooltipId );
			tooltip = $( "<div class=\"tooltip tooltip-e\">" +
				"<div class=\"tooltip-arrow tooltip-arrow-e\"></div>" +
				"<div class=\"tooltip-inner\">" + error + "</div>" +
				"</div>"
				).
				appendTo( parentNode );

			tooltip.css({
				"top": pos.top - ( tooltip.height() / 2 ) + 20,
				"left": pos.left - tooltip.width() - 12
			});
			window.setTimeout( function(){
				tooltip.remove();
				parentNode.removeClass( tooltipId );
			}, 2500 );
	};
	/**
		* Shim for setCustomValidity DOM element method
		* Sets a custom error, so that the element would fail to validate.
		* The given message is the message to be shown to the user when
		* reporting the problem to the user.
		* If the argument is the empty string, clears the custom error.
		* @see http://www.w3.org/html/wg/drafts/html/master/forms.html#the-constraint-validation-api
		* @param {string} message
		*/
	$.fn.setCustomValidity = function( message ) {
		$( this ).each(function( inx, el ) {
			$( el ).data( "customvalidity", message );
		});
	};



		util.onDomReady(function(){
			page.syncUi();
			onReadyCb( page );
		});

		if ( typeof $ === "undefined" ) {
			throw new ReferenceError( "jQuery is required" );
		}

		/** @lends module:main.prototype */
		window.hfFormShim = {

			/**
			* Repeat initialization on a given form or all the forms in DOM
			* if no argument given
			* @access public
			* @param {object} [options]
			* @returns {module:main}
			*/
			init: function( options ) {
				if ( options && options.boundingBox && options.boundingBox.length ) {
					page.add( util.createInstance( Form, [ options ] ) );
				} else {
					page.syncUi();
				}
				return this;
			},
			/**
			 * Assign on-ready callback (triggered by util.onDomReady)
			 * @param {onReadyCb} cb
			 * @returns {module:main}
			 */
			onReady: function( cb ) {
				onReadyCb = cb;
				return this;
			},
			/**
			* Obtain AbstractInput (hfFormShim input wrapper) for the given node
			* @access public
			* @param {object} node
			* @returns {module:Input/Abstract}
			*/
			getInput: function( node ) {
				return page.getInput( node );
			}
	};
	return window.hfFormShim;
});
	return module;
});

_require.def( "src/App/Misc/util.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/util
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
/*
 * @namespace
 * @alias module:App/Misc/util
 */
define(function( require ) {
	var
			/** @type {object} */
			document = window.document,
			/** @type {module:jQuery} */
			$ = _require( "jquery" ),
			/**
			* Object.create replica for pseudo-classes of module design
			* createInstance implements C-like inheritance
			* in JavaScript. When a pseudo-class is intended to extend
			* other one, it's enough just put base class object in __extends__
			* properry.
			* Module-like object context isn't available within constructor
			* function scope (being created only on its return). createInstance
			* calls automaticale __constructor__ method, if one provided,
			* right after instance creation. So it can be used as constructor
			* for modules
			* @see http://bit.ly/1bUJnZ4
			* @access private
			* @memberof module:App/Misc/util
			* @param {function} constr - object constructor
			* @param {array} args - array of arguments
			* @returns {object}
			*/
			createInstance = function( constr, args ) {
				var key,
					instance,
					members = ( typeof constr === "function" ? constr.apply( constr.prototype, args || [] ) : constr ),
					Fn = function(){};


				// Inherit from a super type if any specified in __extends__ property
				if ( members.hasOwnProperty( "__extends__" ) && members.__extends__ ) {
					constr.prototype = createInstance( members.__extends__, args );
				}

				// Copy given type prototype linking to a new constructor
				Fn.prototype = constr.prototype || {};

				for ( key in members ) { // Mix in members
					if ( members.hasOwnProperty( key ) ) {
						Fn.prototype[ key ] = members[ key ];
					}
				}
				instance = new Fn();
				members.hasOwnProperty( "__constructor__" ) &&
					members.__constructor__.apply( instance, args || [] );
				return instance;
			};
	return {
		/**
		 * Detect user-agent language code
		 * @returns {string} language
		 */
		language: (function(){
			return ( window.navigator.userLanguage || window.navigator.language )
				.substr( 0, 2 );
		}()),
		/**
		 * Accessor for private createInstance
		 * @param {function} module - object constructor
		 * @param {array} args - array of arguments
		 * @returns {Object}
		 */
		createInstance: function( module, args ) {
			return createInstance( module, args );
		},
		/**
		* Wrapper for DOMContentLoaded event listener to support AMD
		* @memberof module:App/Misc/util
		* @param {function} fn
		*/
		onDomReady: function( fn ) {
			if ( typeof define === "function" && define.amd ) {
				require( [ "./domReady" ], function ( domReady ) {
					domReady( fn );
				});
			} else {
				$( document ).ready( fn );
			}
		},
		/**
			* PHP replica of is_string
			* @memberof module:App/Misc/util
			* @param {*} value
			* @returns {boolean}
			*/
		isString: function( value ) {
			return typeof( value ) === "string" && isNaN( value );
		},
		/**
			* PHP replica of is_numeric
			* @memberof module:App/Misc/util
			* @param {*} value
			* @returns {boolean}
			*/
		isNumber: function( value ) {
			return !isNaN( parseFloat( value ) ) && isFinite( value );
		},
		/**
		* Make a string's first character uppercase, others lowercase
		* @memberof module:App/Misc/util
		* @param {string} str
		* @returns {string}
		*/
		ucfirst: function( str ) {
			str += "";
			return str.charAt( 0 ).toUpperCase() + ( str.substr( 1 ).toLowerCase() );
		},
		/**
		 * Simplified replica of ES5 Array.prototype.filter
		 * @param {*[]} arr
		 * @param {function} cb
		 * @returns {*[]}
		 */
		filter: function( arr, cb ) {
			var i = 0,
					len = arr.length,
					res = [];
			for ( ; i < len; i++ ) {
				cb( arr[ i ] ) && res.push( arr[ i ] );
			}
      return res;
		}
	};
});
	return module;
});

_require.def( "jquery", function( _require, exports, module ){
	module.exports = window.jQuery;

	return module;
});

_require.def( "src/App/Page.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing page
 * @module App/Page
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
 * @alias module:App/Page
 */
define(function( require ) {
	/** @type {module:jQuery} */
	var $ = _require( "jquery" );
	/** @lends module:App/Page.prototype */
	return (function() {
		var
		/**
			* Module representing the Form
			* @type {modele:Form}
			*/
			Form = _require( "src/App/Form.js" ),
			/**
			 * @type {module:App/Misc/util}
			 */
			util = _require( "src/App/Misc/util.js" ),
			/**
			 *
			 * @type {Node[]}
			 */
			forms = [];
		/**
		 * Expose the shim as global
		 * @lends module:App/Page.prototype
		 */
		return {
			/**
			* Sync UI on DOM ready
			*/
			syncUi: function() {
				$( "form[data-enable-shim='true']" ).each(function(){
					var $node = $( this );
					// Ignore if node is already added
					if ( util.filter( forms, function( item ){
							return item.boundingBox === $node;
						}).length ) {
						return;
					}
					forms.push( util.createInstance( Form, [ { boundingBox: $node } ] ) );
				});
			},
			/**
			 * Add form into the stack
			 * @param {moule:App/Form} form
			 */
			add: function( form ) {
				forms.push( form );
			},
			/*
			 * Access processed form by index in hfFormShim#onReady
			 * @param {number} inx
			 * @returns {module:App/Form}
			 */
			getForm: function( inx ) {
				return forms[ inx ] || null;
			},

			/**
			* Look up for AbstractInput instance for the given HTMLElement
			* @public
			* @param {object} node
			* @returns (object) AbstractInput
			*/
			getInput: function( node ) {
				var $node = $( node ), i, input;
				for ( i in forms ) {
					input = forms[ i ].getInput( $node );
					if ( input ) {
						return input;
					}
				}
				return null;
			},
			/**
			 * Reset all the forms (useful when inputs must be reinitialized)
			 */
			reset: function() {
				$.each( forms, function( i ){
					forms[ i ].reset();
				});
			}
		};
	}());
});
	return module;
});

_require.def( "src/App/Form.js", function( _require, exports, module ){
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
	var $ = _require( "jquery" ),
			/** @type {module:App/Misc/util} */
			util = _require( "src/App/Misc/util.js" ),
			 /** @type {module:App/Misc/log} */
			log = _require( "src/App/Misc/log.js" ),
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
			AbstractInput = _require( "src/App/Input/Abstract.js" ),
			/**
			* Input type custom validators
			* @type {object}
			*/
			inputConstructors = {
				Text: _require( "src/App/Input/Text.js" ),
				Tel: _require( "src/App/Input/Tel.js" ),
				Email: _require( "src/App/Input/Email.js" ),
				Number: _require( "src/App/Input/Number.js" ),
				Url: _require( "src/App/Input/Url.js" )
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
	return module;
});

_require.def( "src/App/Misc/log.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
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
 * @typedef {Object} LogVo
 * @property {string} module
 * @property {string} action
 * @property {Node} noder}
 */

/**
 * @constructor
 * @alias module:App/Misc/log
 */
define(function() {
	"use strict";
	/** @type {module:jQuery} */
	var $ = _require( "jquery" ),
			isSync = false,
			isConsoleLogMode = false,
			$output = null,

			/** @type {LogVo[]} */
			messages = [],
			/**
		 * @param {string} module
		 * @param {string} action
		 * @param {Node} node
		 */
			renderMessage = function( module, action, node ) {
				$output && $output.html(function( i, html ){
					return html + module + ":" + action + (
						( node && node.id ) ? ":" + node.id : ""
						) + "\n";
				});

				if ( !isConsoleLogMode ){
					return;
				}
				if ( node ) {
					console && console.log( "%s: %s on %o", module, action, node );
				} else {
					console && console.log( "%s: %s", module, action );
				}
			},

			/**
			 * Obtain bindings from DOM
			 */
			syncUi = function(){
				var logNode = $( "#" + $( "html" ).data( "debug-log" ) );
				isSync = true;

				isConsoleLogMode = !!$( "html" ).data( "debug-console" );
				$output = logNode.length ? logNode : null;

				$.each( messages, function( i ){
					renderMessage.apply( renderMessage, messages[ i ] );
				});
			};

			$( window.document ).ready( syncUi );

	return {

		/**
		 * @param {string} module
		 * @param {string} action
		 * @param {Node} node
		 */
		log: function( module, action, node ) {
			if ( isSync ) {
				return renderMessage( module, action, node );
			}
			messages.push([ module, action, node ]);
		}
	};
});
	return module;
});

_require.def( "src/App/Input/Abstract.js", function( _require, exports, module ){
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
	var $ = _require( "jquery" ),
			/** @type {module:App/Input/Abstract/Shim} */
			Shim = _require( "src/App/Input/Abstract/Shim.js" ),
			/** @type {module:App/Input/Abstract/Validator} */
			Validator = _require( "src/App/Input/Abstract/Validator.js" );
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
	return module;
});

_require.def( "src/App/Input/Abstract/Shim.js", function( _require, exports, module ){
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
		var $ = _require( "jquery" ),
				/** @type {module:App/Misc/log} */
				log = _require( "src/App/Misc/log.js" ),
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
				 modernizr = _require( "src/App/Misc/modernizr.js" ),
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
	return module;
});

_require.def( "src/App/Misc/modernizr.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module that detects HTML5 and CSS3 features in the user’s browser
 * @module App/modernizr
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
 * @alias module:App/Misc/modernizr
 */
define(function() {
	var
			/** @type {object} */
			document = window.document;
	return {
				/**
					*  List of supported types of input element
					*  Run through HTML5's new input types to see if the UA understands any.
					*  Implementation adopted from http://www.modernizr.com
					*  @memberof modernizr
					*  @type {Array)
					*/
				supportedInputTypes: (function() {
					var inputElem = document.createElement( "input" ),
					types = (function( props ) {
						var i = 0, types = [], len = props.length;
						for ( ; i < len; i++ ) {
							inputElem.setAttribute( "type", props[i] );
							types[ props[ i ] ] = ( inputElem.type !== "text" );
						}
						return types;
					})( "search tel url email datetime date month week time datetime-local number range color".split( " " ) );
					return types;
				}()),
				/*
					* List of supported properties of input element
					* Run through HTML5's new input attributes to see if the UA understands any.
					* Implementation adopted from http://www.modernizr.com
					*  spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
					* @memberof modernizr
					* @type {array}
					*/
				supportedInputProps: (function() {
					var inputElem = document.createElement( "input" ),
						attrs = (function( props ) {
							var i = 0, attrs = [], len = props.length;
							for ( ; i < len; i++ ) {
								attrs[ props[i] ] = !!(props[i] in inputElem);
							}
							return attrs;
						})("autocomplete autofocus list placeholder max min multiple pattern required step"
							.split( " " ));
					return attrs;
				}())
			};
});
	return module;
});

_require.def( "src/App/Input/Abstract/Validator.js", function( _require, exports, module ){
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
		var $ = _require( "jquery" ),
				/**
				* @type {module:App/Misc/util}
				*/
				util = _require( "src/App/Misc/util.js" ),
				/**
				* Value Object representing constraint validation API validity default state
				* @type {modele:Input/Abstract/Validator/Vo/ValidityDefaultState}
				*/
				ValidityDefaultStateVo = _require( "src/App/Input/Abstract/Vo/ValidityDefaultState.js" ),
				/**
				* @type (module:App/dictionary)
				*/
				defaultValidationMessages = _require( "src/App/Input/Abstract/Validator/dictionary.js" );

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
	return module;
});

_require.def( "src/App/Input/Abstract/Vo/ValidityDefaultState.js", function( _require, exports, module ){
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
	return module;
});

_require.def( "src/App/Input/Abstract/Validator/dictionary.js", function( _require, exports, module ){
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
	return module;
});

_require.def( "src/App/Input/Text.js", function( _require, exports, module ){
			/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Text Input
 * @module App/Input/Text
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
 * @alias module:App/Input/Text
 */
define(function( require ) {
	"use strict";
	var /** @type {module:App/Misc/log} */
			log = _require( "src/App/Misc/log.js" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Text";
	/** @lends module:App/Input/Text.prototype */
	return function() {
			return {
			__extends__: _require( "src/App/Input/Abstract.js" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				log.log( NAME, "initializes", this.boundingBox.get( 0 ) );
			}
		};
	};
});
	return module;
});

_require.def( "src/App/Input/Tel.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Number Tel
 * @module App/Tel/Number
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
 * @alias module:App/Tel/Number
 */
define(function( require ) {
	"use strict";
	var /** @type {module:App/Misc/log} */
			log = _require( "src/App/Misc/log.js" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Tel";
	/** @lends module:App/Tel/Number.prototype */
	return function() {
		return {
			__extends__: _require( "src/App/Input/Abstract.js" ),
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
					var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
					log.log( NAME, "validates", this.boundingBox.get( 0 ) );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
						"Please enter a valid tel. number +1 11 11 11" );
				};
			}
		};
	};
});
	return module;
});

_require.def( "src/App/Input/Email.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Email Input
 * @module App/Input/Email
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
 * @alias module:App/Input/Email
 */
define(function( require ) {
	"use strict";
	var /** @type {module:App/Misc/log} */
			log = _require( "src/App/Misc/log.js" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
		 NAME = "Input/Email";

	/** @lends module:App/Input/Email.prototype */
	return function() {
		return {
			__extends__: _require( "src/App/Input/Abstract.js" ),
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
					var pattern = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\.]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
					log.log( NAME, "validates value", this.boundingBox.get( 0 ) );
					pattern.test( this.boundingBox.val() ) ||
						this.throwValidationException( "typeMismatch",
							"Please enter a valid email address" );
				};
			}
		};
	};
});
	return module;
});

_require.def( "src/App/Input/Number.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module App/main
 */

/**
 * Module representing Number Input
 * @module App/Input/Number
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
 * @alias module:App/Input/Number
 */
define(function( require ) {
	"use strict";
	/** @type {module:App/Misc/util} */
	var util = _require( "src/App/Misc/util.js" ),
			/** @type {module:App/Misc/log} */
			log = _require( "src/App/Misc/log.js" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
			NAME = "Input/Number";
	/** @lends module:App/Input/Number.prototype */
	return function() {
		return {
			__extends__: _require( "src/App/Input/Abstract.js" ),
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
	return module;
});

_require.def( "src/App/Input/Url.js", function( _require, exports, module ){
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
			log = _require( "src/App/Misc/log.js" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
			NAME = "Input/Url";
	/** @lends module:App/Input/Url.prototype */
	return function() {
		return {
			__extends__: _require( "src/App/Input/Abstract.js" ),
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
	return module;
});

_require( "src/h5formshim.js" );

//# sourceMappingURL=./jquery.html5form.js.map