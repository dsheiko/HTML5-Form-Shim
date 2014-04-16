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
			isDebugMode = false,
			$output = null;

	$( window.document ).ready(function(){
		isDebugMode = !!$( "html" ).data( "debug" );
		$output = $( "#debug-log").length ? $( "#debug-log") : null;
	});

	return {
		/** @type {LogVo[]} */
		messages: [],
		/**
		 * @param {string} module
		 * @param {string} action
		 * @param {Node} node
		 */
		log: function( module, action, node) {
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
		}
	};
});