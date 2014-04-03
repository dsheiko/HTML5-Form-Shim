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
_require.def( "src/main.js", function( _require, exports, module ){
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
define(function() {
	"use strict";
		/**
			* Get reference to jQuery
			* @type {object}
			**/
		var

				/**
				 * Composite that can as Page as Form
				 * @type (object)
				 */
				composite = null,

				/**
				 * @type {module:util}
				 */
				util = _require( "src/Misc/util.js" ),
				/**
				 *
				 * @type {jQuery}
				 */
				$ = _require( "jQuery" ),

				/**
				* @type {module:Page}
				*/
				Page = _require( "src/Page.js" ),
				/**
				* @type {module:Form}
				*/
				Form = _require( "src/Form.js" );


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
			composite = util.createInstance( Page );
		});

		if ( typeof $ === "undefined" ) {
			throw new ReferenceError( "jQuery is required" );
		}

		/** @lends module:main.prototype */
		return {
			/**
			* Repeat initialization on a given form or all the forms in DOM
			* if no argument given
			* @access public
			* @param {object} [options]
			*/
			init: function( options ) {
				if ( options && options.boundingBox && options.boundingBox.length ) {
					composite = util.createInstance( Form, [ options ] );
				} else {
					composite = util.createInstance( Page );
				}
			},
			/**
			* Obtain AbstractInput (hfFormShim input wrapper) for the given node
			* @access public
			* @param {object} node
			* @returns {module:Input/Abstract}
			*/
			getInput: function( node ) {
				return composite.getInput( node );
			}
	};
});
	return module;
});

_require.def( "src/Misc/util.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module util
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
 * @alias module:util
 */
define(function() {
	var
			/** @type {object} */
			document = window.document,
			/** @type {module:jQuery} */
			$ = _require( "jQuery" ),
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
			* @memberof module:util
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
		* @memberof module:util
		* @param {function} fn
		*/
		onDomReady: function( fn ) {
			if ( typeof define === "function" && define.amd ) {
				require( [ "domReady" ], function ( domReady ) {
					domReady( fn );
				});
			} else {
				$( document ).ready( fn );
			}
		},
		/**
			* PHP replica of is_string
			* @memberof module:util
			* @param {*} value
			* @returns {boolean}
			*/
		isString: function( value ) {
			return typeof( value ) === "string" && isNaN( value );
		},
		/**
			* PHP replica of is_numeric
			* @memberof module:util
			* @param {*} value
			* @returns {boolean}
			*/
		isNumber: function( value ) {
			return !isNaN( parseFloat( value ) ) && isFinite( value );
		},
		/**
			* Make a string's first character uppercase, others lowercase
			* @memberof module:util
			* @param {string} str
			* @returns {string}
			*/
			ucfirst: function( str ) {
				str += "";
				return str.charAt( 0 ).toUpperCase() + ( str.substr( 1 ).toLowerCase() );
			}
	};
});
	return module;
});

_require.def( "jQuery", function( _require, exports, module ){
	module.exports = window.jQuery;

	return module;
});

_require.def( "src/Page.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing page
 * @module Page
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
 * @alias module:Page
 */
define(function() {
	/** @type {module:jQuery} */
	var $ = _require( "jQuery" );
	/** @lends module:Page.prototype */
	return function() {
		var
		/**
			* Module representing the Form
			* @type {modele:Form}
			*/
			Form = _require( "src/Form.js" ),
			/**
			 * @type {module:util}
			 */
			util = _require( "src/Misc/util.js" ),
			/**
			 *
			 * @type {Node[]}
			 */
			forms = [];
		/** @lends module:Page.prototype */
		return {
			/**
			* @constructs
			*/
			__constructor__: function() {
				$( "form[data-enable-shim='true']" ).each(function(){
					forms.push( util.createInstance( Form, [ { boundingBox: $( this ) } ] ) );
				});
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
			}
		};
	};
});
	return module;
});

_require.def( "src/Form.js", function( _require, exports, module ){
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
	var $ = _require( "jQuery" ),
			/** @type {module:util} */
			util = _require( "src/Misc/util.js" ),
			/** @type {module:config} */
			config = _require( "src/config.js" ),
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
			AbstractInput = _require( "src/Input/Abstract.js" ),
			/**
			* Input type custom validators
			* @type {object}
			*/
			Input = {
				Text: _require( "src/Input/Text.js" ),
				Tel: _require( "src/Input/Tel.js" ),
				Email: _require( "src/Input/Email.js" ),
				Number: _require( "src/Input/Number.js" ),
				Url: _require( "src/Input/Url.js" )
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
	return module;
});

_require.def( "src/config.js", function( _require, exports, module ){
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
 * @alias module:config
 */
define(function() {
	"use strict";
	return {
		debug: true
	};
});
	return module;
});

_require.def( "src/Input/Abstract.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module Input/Abstract
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
 * @alias module:Input/Abstract
 */
define(function() {
	/** @type {module:jQuery} */
	var $ = _require( "jQuery" ),
			/** @type {module:Input/Abstract/Shim} */
			Shim = _require( "src/Input/Abstract/Shim.js" ),
			/** @type {module:Input/Abstract/Validator} */
			Validator = _require( "src/Input/Abstract/Validator.js" );
	/** @lends module:Input/Abstract.prototype */
	return function(){
		return {
			/**
			* Reference to the input element
			* @type {Node}
			*/
			boundingBox: null,
			/**
			 * @type {module:Input/Abstract/Validator}
			 */
			validator: null,
			/**
			 * @type {module:Input/Abstract/Shim}
			 */
			shim: null,

			/**
			* Input constructor
			* @constructs module:Input/Abstract
			* @param {Node} boundingBox
			* @param {boolean} isFormCustomValidation
			*/
			__constructor__: function( boundingBox, isFormCustomValidation ) {
				this.boundingBox = boundingBox;
				this.validator = new Validator( boundingBox, isFormCustomValidation );
				this.validator.init();
				this.shim = new Shim( boundingBox, isFormCustomValidation );
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
			 * @returns {module:Input/Abstract} self
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

_require.def( "src/Input/Abstract/Shim.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module Input/Abstract/Shim
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
 * @alias module:Input/Abstract/Shim
 */
define(function() {
	/**
	 * @param {Node} $node
	 * @param {Boolean} isFormCustomValidation
	 * @param {undefined} undefined
	 */
	return function( $node, isFormCustomValidation, undefined ){
		/** @type {module:jQuery} */
		var $ = _require( "jQuery" ),
				/** @type {module:config} */
				config = _require( "src/config.js" ),
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
				 modernizr = _require( "src/Misc/modernizr.js" ),
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

		/** @lends module:Input/Abstract/Shim.prototype */
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
	return module;
});

_require.def( "src/Misc/modernizr.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module that detects HTML5 and CSS3 features in the user’s browser
 * @module modernizr
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
 * @alias module:modernizr
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

_require.def( "src/Input/Abstract/Validator.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module Input/Abstract/Validator
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
 * @alias module:Input/Abstract/Validator
 */
define(function() {
	/**
	 * @param {Node} node
	 * @param {Boolean} isFormCustomValidation
	 */
	return function( $node, isFormCustomValidation ){
		/** @type {module:jQuery} */
		var $ = _require( "jQuery" ),
				/**
				* @type {module:util}
				*/
				util = _require( "src/Misc/util.js" ),
				/**
				* Value Object representing constraint validation API validity default state
				* @type {modele:Input/Abstract/Validator/Vo/ValidityDefaultState}
				*/
				ValidityDefaultStateVo = _require( "src/Input/Abstract/Vo/ValidityDefaultState.js" ),
				/**
				* @type (module:dictionary)
				*/
				defaultValidationMessages = _require( "src/Input/Abstract/Validator/dictionary.js" ),
				/**
				* reference to the bound validation message container
				* @type {Node}
				*/
				validationMessageNode = null;

		/** @lends module:Input/Abstract/Validator.prototype */
		return {
			/**
			* @type {Node}
			*/
			boundingBox: $node,
			/**
			* Constraint validation API
			* @type {module:Vo/ValidityDefaultState}
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
			* Emulate API method checkValidity
			* @access public
			*/
			checkValidity: function() {
				if ( !isFormCustomValidation ) {
					return;
				}
				this.validateRequired();
				if ( this.isRequired() || !this.isEmpty() ) {
					this.checkValidityWithoutRequired();
				}
				return this.validity.valid;
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
			* Tell is the input required
			* @access public
			* @returns {boolean}
			*/
			isRequired: function() {
				return $node.hasClass( "required" );
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
			* If validation message node assigned for this input found
			* It will be used instead of tooltip
			*/
			lookForValidationMessageNode: function() {
				var id = $node.attr( "id" ), $hint;
				if ( id ) {
					$hint = $( "form *[data-validation-message-for=" + id + "]" );
					validationMessageNode = $hint.length ? $hint : null;
				}
			},
			/**
			* Show message in validation message placeholder node
			* @access public
			*/
			showValidationMessage: function() {
				var msg = this.validationMessage;
				validationMessageNode.html( msg );
				validationMessageNode[ msg ? "show" : "hide" ]();
			},

			/**
			* Reset to default input validation state
			* @access public
			*/
			resetValidationState: function(){
				this.validity = new ValidityDefaultStateVo();
				this.validationMessage = "";
				validationMessageNode && this.showValidationMessage();
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

_require.def( "src/Input/Abstract/Vo/ValidityDefaultState.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Value Object representing constraint validation API validity default state
 * @module Input/Abstract/Validator/Vo/ValidityDefaultState
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
 * @alias module:Input/Abstract/Validator/Vo/ValidityDefaultState
 */
define(function() {
	return function() {
		/** @lends module:Input/Abstract/Validator/Vo/ValidityDefaultState.prototype */
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

_require.def( "src/Input/Abstract/Validator/dictionary.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 */

/**
 * Module representing abstract Input
 * @module Input/Abstract/Validator/dictionary
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
 * @alias module:Input/Abstract/Validator/dictionary
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

_require.def( "src/Input/Text.js", function( _require, exports, module ){
			/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Text Input
 * @module Input/Text
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
 * @alias module:Input/Text
 */
define(function() {
	"use strict";
	var /** @type {module:config} */
		config = _require( "src/config.js" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Text";
	/** @lends module:Input/Text.prototype */
	return function() {
			return {
			__extends__: _require( "src/Input/Abstract.js" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
			}
		};
	};
});
	return module;
});

_require.def( "src/Input/Tel.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Number Tel
 * @module Tel/Number
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
 * @alias module:Tel/Number
 */
define(function() {
	"use strict";
	var /** @type {module:config} */
		config = _require( "src/config.js" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Tel";
	/** @lends module:Tel/Number.prototype */
	return function() {
		return {
			__extends__: _require( "src/Input/Abstract.js" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
					config.debug && console.log( "Module Input/Tel: validation" );
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

_require.def( "src/Input/Email.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Email Input
 * @module Input/Email
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
 * @alias module:Input/Email
 */
define(function() {
	"use strict";
	var /** @type {module:config} */
			config = _require( "src/config.js" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
		 NAME = "Input/Email";

	/** @lends module:Input/Email.prototype */
	return function() {
		return {
			__extends__: _require( "src/Input/Abstract.js" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					var pattern = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
					config.debug && console.log( "%s: validates value of %o", NAME, this.boundingBox.get( 0 ) );
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

_require.def( "src/Input/Number.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Number Input
 * @module Input/Number
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
 * @alias module:Input/Number
 */
define(function() {
	"use strict";
	/** @type {module:util} */
	var util = _require( "src/Misc/util.js" ),
		/** @type {module:config} */
		config = _require( "src/config.js" ),
		/**
		* @constant
		* @default
		* @type {string}
		*/
		NAME = "Input/Number";
	/** @lends module:Input/Number.prototype */
	return function() {
		return {
			__extends__: _require( "src/Input/Abstract.js" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
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

_require.def( "src/Input/Url.js", function( _require, exports, module ){
/**
 * @author sheiko
 * @license MIT
 * jscs standard:Jquery
 * @module main
 */

/**
 * Module representing Url Input
 * @module Input/Url
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
 * @alias module:Input/Url
 */
define(function() {
	"use strict";
	var /** @type {module:config} */
			config = _require( "src/config.js" ),
			/**
			* @constant
			* @default
			* @type {string}
			*/
			NAME = "Input/Url";
	/** @lends module:Input/Url.prototype */
	return function() {
		return {
			__extends__: _require( "src/Input/Abstract.js" ),
			/**
			* @constructs
			*/
			__constructor__: function() {
				config.debug && console.log( "%s: initialized on %o", NAME, this.boundingBox.get( 0 ) );
				/**
				* Validate input value
				*
				* @access public
				* @returns {boolean}
				*/
				this.validator.validateValue = function() {
					// The pattern is taken from http://stackoverflow.com/questions/2838404/javascript-regex-url-matching
					// pattern fragments: protocol, domain name OR ip (v4) address, port and path, query string, fragment locater
					var pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d\-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[\-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=\-]*)?(\#[\-a-z\d_]*)?$/i;
					config.debug && console.log( "Module Input/Url: validation" );
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

_require( "src/main.js" );

//# sourceMappingURL=./jquery.html5form.js.map