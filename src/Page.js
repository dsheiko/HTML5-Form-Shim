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
	var $ = require( "jQuery" );
	/** @lends module:Page.prototype */
	return function() {
		var
		/**
			* Module representing the Form
			* @type {modele:Form}
			*/
			Form = require( "./Form" ),
			/**
			 * @type {module:util}
			 */
			util = require( "./Misc/util" ),
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