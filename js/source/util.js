			module.exports = {

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
				* @memberof util
				* @param {function} module - object constructor
				* @param {array} args - array of arguments
				* @return {object}
				*/
				createInstance: function( module, args ) {
					var key,
						instance,
						members = module.apply( module.prototype, args || [] ) || {},
						Fn = function(){};

					if ( members.hasOwnProperty( "__extends__" ) &&
						members.__extends__ ) {
						module.prototype =
							util.createInstance( members.__extends__, args );
					}
					Fn.prototype = module.prototype; // Link to the supertype
					for ( key in members ) { // Mix in members
						if ( members.hasOwnProperty( key ) ) {
							Fn.prototype[ key ] = members[ key ];
						}
					}
					instance = new Fn();
					members.hasOwnProperty( "__constructor__" ) &&
						members.__constructor__.apply( instance, args || [] );
					return instance;
				},
				/**
				* Wrapper for DOMContentLoaded event listener to support AMD
				* @memberof util
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
					* @memberof util
					* @param {*} value
					* @return {boolean}
					*/
				isString: function( value ) {
					return typeof( value ) === "string" && isNaN( value );
				},
				/**
					* PHP replica of is_numeric
					* @memberof util
					* @param {*} value
					* @return {boolean}
					*/
				isNumber: function( value ) {
					return !isNaN( parseFloat( value ) ) && isFinite( value );
				},
				/**
					* Make a string's first character uppercase, others lowercase
					* @memberof util
					* @param {string} str
					* @return {string}
					*/
					ucfirst: function( str ) {
						str += "";
						return str.charAt( 0 ).toUpperCase() + ( str.substr( 1 ).toLowerCase() );
					}
			};