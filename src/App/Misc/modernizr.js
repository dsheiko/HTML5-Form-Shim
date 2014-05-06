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