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
	var $ = require( "jquery" );
	/** @lends module:App/Page.prototype */
	return (function() {
		var
		/**
			* Module representing the Form
			* @type {modele:Form}
			*/
			Form = require( "./Form" ),
			/**
			 * @type {module:App/Misc/util}
			 */
			util = require( "./Misc/util" ),
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