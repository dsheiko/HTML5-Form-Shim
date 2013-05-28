/*
* HTML5 Form Shim Test Suit
*
* @package tests
* @author: sheiko
* @version $Id: jquery.html5form.js, v 1.0 $
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
(function( window, undefined ){
    var $ = window.jQuery,
        document = window.document,
        stub = window.stub,
        // Import testable members of hfFormShim scope
        testable = window.hfFormShim.getTestable();

    $( document ).ready(function(){
        test("util.createInstance", function() {
            var control = testable.util.createInstance( stub.Input.Text );
            ok( control instanceof stub.Input.Text, "Inherits from pseoudo-class" );
            ok( control instanceof stub.AbstractInput, "Inherits from base-class" );
            ok( control.isConstructorCalled, "__constructor__ pseudo-method was processed" );
        });


        (function(){
            var $email = $("form#test1 #email"),
                $number = $("form#test1 #number"),
                $url = $("form#test1 #url"),
                input = null;
            module("Test validateValue methods on form controls");

            test("email's value is not in the correct syntax", function() {
                $email.val("invalid-email");
                input = testable.util.createInstance( testable.Input.Email, [ $email ] );
                input.validateValue();
                ok( input.validity.typeMismatch );
                ok( !input.validity.valid );
            });
            test("email's value is in the correct syntax", function() {
                $email.val("valid.email@email.com");
                input = testable.util.createInstance( testable.Input.Email, [ $email ] );
                input.validateValue();
                ok( input.validity.valid );
            });
            test("number's value is not in the correct syntax", function() {
                $number.val("invalid-number");
                input = testable.util.createInstance( testable.Input.Number, [ $number ] );
                input.validateValue();
                ok( input.validity.typeMismatch );
                ok( !input.validity.valid );
            });
            test("number's value is in the correct syntax", function() {
                $number.val("100");
                input = testable.util.createInstance( testable.Input.Number, [ $number ] );
                input.validateValue();
                ok( input.validity.valid );
            });

            test("number's value value is lower than the provided minimum", function() {
                $number.val("1");
                $number.attr("min", "10");
                input = testable.util.createInstance( testable.Input.Number, [ $number ] );
                input.validateValue();
                ok( input.validity.rangeUnderflow );
                ok( !input.validity.valid );
            });
            test("number's value doesn't fit the rules given by the step attribute", function() {
                $number.val("100");
                $number.attr("max", "10");
                input = testable.util.createInstance( testable.Input.Number, [ $number ] );
                input.validateValue();
                ok( input.validity.rangeOverflow );
                ok( !input.validity.valid );
            });
            test("url's value is not in the correct syntax", function() {
                $url.val("invalid-url");
                input = testable.util.createInstance( testable.Input.Url, [ $url ] );
                input.validateValue();
                ok( input.validity.typeMismatch );
                ok( !input.validity.valid );
            });
            test("url's value is in the correct syntax", function() {
                $url.val("http://valid-url.site.com");
                input = testable.util.createInstance( testable.Input.Url, [ $url ] );
                input.validateValue();
                ok( input.validity.valid );
            });

        }());

        module("Test validateRequired methods on form controls");
        test("element has no value but is a required field", function() {
            var $email = $("form#test1 #email"),
                input = null;
            $email.attr( "required", "required" );
            $email.val("");
            input = testable.util.createInstance( testable.Input.Email, [ $email ] );
            input.shimRequired();
            input.validateRequired();
            ok( !input.validity.valid );
        });

        module("Test validateByPattern on form controls");
        test("element's value doesn't match the provided pattern", function() {
            var $tel = $("form#test1 #tel"),
                customMsg = "Please enter valid tel.",
                input;
            $tel.attr("title", customMsg);
            input = testable.util.createInstance( testable.Input.Text, [ $tel ] );
            input.validateByPattern();
            ok( input.validity.patternMismatch );
            ok( input.validationMessage === customMsg, "Show custom message" );
        });

        module("Test input state");
        test("on validation error the state updates", function() {
            var $email = $("form#test1 #email"),
                input = null;
            $email.val("invalid-email");
            input = testable.util.createInstance( testable.Input.Email, [ $email ] );
            input.validateValue();
            ok( input.updateState() === "invalid" );
        });

        module("Test $.setCustomInputTypeValidator helper");
        test("input[type=zip] validator watches for value", function() {
            var $zip = $("form#test1 #zip"),
                input = null;
            // Using context to reach control
            $.setCustomInputTypeValidator( "Zip", "Please enter a valid zip code", function() {
                var pattern = /^[0-9]{6,8}$/g;
                return pattern.test( $( this ).val() );
            });
            input = testable.util.createInstance( testable.Input.Zip, [ $zip ] );
            input.validateValue();
            ok( input.validity[ "customError" ], "Give correct error code" );
            ok( !input.validity.valid );

            // Using argument to reach control
            $.setCustomInputTypeValidator( "Zip", "Please enter a valid zip code", function( control ) {
                var pattern = /^[0-9]{6,8}$/g, isValid = pattern.test( control.val() );
                isValid || control.throwValidationException( "typeMismatch", "Please enter a valid zip code" );
                return isValid;
            });
            input = testable.util.createInstance( testable.Input.Zip, [ $zip ] );
            input.validateValue();

            ok( input.validity.customError && input.validity.typeMismatch, "Both validation glags triggered" );
            ok( !input.validity.valid );
        });

        module("Test setCustomValidity constraint on form controls");
        test("When manually defined, input throws validation error", function() {
            var $email = $("form#test1 #email"),
                input = null,
                customMsg = "Custom message";
            $email.val("invalid-email");
            input = testable.util.createInstance( testable.Input.Email, [ $email ] );
            // The control was set externally to error state
            $email.setCustomValidity( customMsg );
            input.validateCustomValidity();
            ok( !input.validity.valid );
            ok( input.validationMessage === customMsg );
        });

        module("Test form attributes shim");
        test("input[formaction]", function() {
            var $form = $("form#test2"),
                $btn = $form.find('#btn1');
            $form.on( "submit", function( e ) {
                e.preventDefault();
                ok( $( this ).attr("action") === "newAction" );
            });
            $btn.trigger("click");
        });

        test("input[formmethod]", function() {
            var $form = $("form#test2"),
                $btn = $form.find('#btn2');
            $form.on( "submit", function( e ) {
                e.preventDefault();
                ok( $( this ).attr("method") === "POST" );
            });
            $btn.trigger("click");

        });
        test("input[formtarget]", function() {
            var $form = $("form#test2"),
                $btn = $form.find('#btn3');
            $form.on( "submit", function( e ) {
                e.preventDefault();
                ok( $( this ).attr("target") === "_blank" );
            });
            $btn.trigger("click");
        });
        test("input[formenctype]", function() {
            var $form = $("form#test2"),
                $btn = $form.find('#btn4');
            $form.on( "submit", function( e ) {
                e.preventDefault();
                ok( $( this ).attr("enctype") === "application/x-www-form-urlencoded" );
            });
            $btn.trigger("click");
        });
    });
}( window ));