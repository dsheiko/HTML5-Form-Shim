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