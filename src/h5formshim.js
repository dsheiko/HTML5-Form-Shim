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
				 * @type {module:App/Misc/util}
				 */
				util = require( "./App/Misc/util" ),
				/**
				 *
				 * @type {jQuery}
				 */
				$ = require( "jQuery" ),

				/**
				* @type {module:App/Page}
				*/
				Page = require( "./App/Page" ),
				/**
				* @type {module:App/Form}
				*/
				Form = require( "./App/Form" );


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