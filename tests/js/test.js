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
        fixture = window.fixture,
        // Import testable members of htmlFiveFormShim scope
        testable = window.htmlFiveFormShim.getTestable();

        test("util.createInstance", function() {
            var control = testable.util.createInstance( fixture.Control.Text );
            ok( control instanceof fixture.Control.Text, "Inherits from pseoudo-class" );
            ok( control instanceof fixture.AbstractControl, "Inherits from base-class" );
            ok( control.isConstructorCalled, "__init__ pseudo-method was processed" );
        });

        test("ValidationLogger", function() {
            var log = new testable.ValidationLogger();
            ok( log.isEmpty() === true, "isEmpty() is true right after initialization" );
            log.setMessage("valueMissing");
            log.setMessage("rangeOverflow");
            ok( log.getMessage() === "Please fill out this field", "getMessage() returns the first message of the stack" );
            ok( log.isEmpty() === false, "isEmpty() is false after some messages were set" );
        });

        test("Test validateValue methods on form controls", function() {
            var $email = $("form#test1 #email"),
                $number = $("form#test1 #number"),
                $url = $("form#test1 #url"),
                instance = null;


            $email.val("invalid-email");
            instance = testable.util.createInstance( testable.Control.Email, [ $email ] );
            ok( instance.validateValue().getCode() === "typeMismatch", "validate invalid email" );
            ok( instance.isValid() === false );

            $email.val("valid.email@email.com");
            instance = testable.util.createInstance( testable.Control.Email, [ $email ] );
            instance.validateValue();
            ok( instance.isValid(), "validate valid email" );

            $number.val("invalid-number");
            instance = testable.util.createInstance( testable.Control.Number, [ $number ] );
            ok( instance.validateValue().getCode() === "typeMismatch", "validate invalid number" );
            ok( instance.isValid() === false );

            $number.val("100");
            instance = testable.util.createInstance( testable.Control.Number, [ $number ] );
            instance.validateValue();
            ok( instance.isValid(), "validate valid number" );

            $number.val("1");
            $number.attr("min", "10");
            instance = testable.util.createInstance( testable.Control.Number, [ $number ] );
            ok(instance.validateValue().getCode() === "rangeUnderflow", "validate number underflow");
            ok( instance.isValid() === false );

            $number.val("100");
            $number.attr("max", "10");
            instance = testable.util.createInstance( testable.Control.Number, [ $number ] );
            ok(instance.validateValue().getCode() === "rangeOverflow", "validate number overflow");
            ok( instance.isValid() === false );

            $url.val("invalid-url");
            instance = testable.util.createInstance( testable.Control.Url, [ $url ] );
            ok( instance.validateValue().getCode() === "typeMismatch", "validate invalid url" );
            ok( instance.isValid() === false );

            $url.val("http://valid-url.site.com");
            instance = testable.util.createInstance( testable.Control.Url, [ $url ] );
            instance.validateValue();
            ok( instance.isValid(), "validate valid url" );

        });

        test("Test validateRequired methods on form controls", function() {
            var $email = $("form#test1 #email"), instance = null;
            $email.attr( "required", "required" );
            $email.val("");
            instance = testable.util.createInstance( testable.Control.Email, [ $email ] );
            instance.shimRequired();
            instance.validateRequired();
            ok( instance.isValid() === false );
        });

        test("Test validateByPattern on form controls", function() {
            var $tel = $("form#test1 #tel"),
                customMsg = "Please enter valid tel.",
                instance = testable.util.createInstance( testable.Control.Text, [ $tel ] );
            ok( instance.validateByPattern().getCode() === "patternMismatch", "Give correct error code" );
            ok( instance.isValid() === false );

            $tel.attr("title", customMsg);
            instance = testable.util.createInstance( testable.Control.Text, [ $tel ] );
            ok( instance.validateByPattern().getMessage() === customMsg, "Show custom message" );
        });

        test("Test updateState methods on form controls", function() {
            var $email = $("form#test1 #email"), instance = null;
            $email.val("invalid-email");
            instance = testable.util.createInstance( testable.Control.Email, [ $email ] );
            instance.validateValue();
            ok( instance.updateState() === "invalid" );
        });

        test("Test h5API constraint members (validity, validationMessage, checkValidity()) on form controls", function() {
            var $email = $("form#test1 #email"),
                instance = null;
            $email.val("invalid-email");
            instance = testable.util.createInstance( testable.Control.Email, [ $email ] );
            instance.validateValue();
            ok( $email.checkValidity() === false );
            ok( $email.validationMessage.length );
            ok( $email.validity.typeMismatch );
        });

        test("Test $.setCustomInputTypeValidator helper", function() {
            var $zip = $("form#test1 #zip"),
                instance = null,
                logger = null;
            // Using context to reach control
            $.setCustomInputTypeValidator( "Zip", "Please enter a valid zip code", function() {
                var pattern = /^[0-9]{6,8}$/g;
                return pattern.test( $( this ).val() );
            });
            instance = testable.util.createInstance( testable.Control.Zip, [ $zip ] );
            ok( instance.validateValue().getCode() === "customError", "Give correct error code" );
            ok( instance.isValid() === false );

            // Using argument to reach control
            $.setCustomInputTypeValidator( "Zip", "Please enter a valid zip code", function( control ) {
                var pattern = /^[0-9]{6,8}$/g, isValid = pattern.test( control.val() );
                isValid || control.throwValidationException( "typeMismatch", "Please enter a valid zip code" );
                return isValid;
            });
            instance = testable.util.createInstance( testable.Control.Zip, [ $zip ] );
            logger = instance.validateValue();
            ok( $zip.validity.customError && $zip.validity. typeMismatch, "Both validation messages available");
            ok( $zip.validity.valid === false );
            ok( instance.isValid() === false );
        });

        test("Test setCustomValidity constraint on form controls", function() {
            var $email = $("form#test1 #email"),
                instance = null,
                customMsg = "Custom message";
            $email.val("invalid-email");
            instance = testable.util.createInstance( testable.Control.Email, [ $email ] );
            // The control was set externally to error state
            $email.setCustomValidity( customMsg );
            ok( instance.isValid() === false );
            ok( $email.validationMessage === customMsg );
        });


}( window ));