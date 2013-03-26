/*
* HTML5 Form Shim Test Suit
*
* @package tests
* @author sheiko
* @version $Id: jquery.html5form.js, v 1.0 $
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
var fixture = {
    AbstractControl: function() {
        return {

        }
    },
    Control: {
        Text: function() {
            return {
                "__extends__" : fixture.AbstractControl,
                "__constructor__" : function() {
                    this.isConstructorCalled = true;
                },
                isConstructorCalled: false
            }
        }
    }
}
