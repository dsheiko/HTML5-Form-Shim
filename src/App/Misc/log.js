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
	var $ = require( "jquery" ),
			isSync = false,
			isDebugMode = false,
			$output = null,

			/** @type {LogVo[]} */
			messages = [],
			/**
		 * @param {string} module
		 * @param {string} action
		 * @param {Node} node
		 */
			renderMessage = function( module, action, node ) {
				if ( !isDebugMode ){
					return;
				}
				if ( node ) {
					console.log( "%s: %s on %o", module, action, node );
				} else {
					console.log( "%s: %s", module, action );
				}
				$output && $output.html(function( i, html ){
					return html + module + ":" + action + (
						( node && node.id ) ? ":" + node.id : ""
						) + "\n";
				});
			},

			/**
			 * Obtain bindings from DOM
			 */
			syncUi = function(){
				isSync = true;
				isDebugMode = !!$( "html" ).data( "debug" );
				$output = $( "#debug-log" ).length ? $( "#debug-log" ) : null;

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