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
			$ = require( "jQuery" ),
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