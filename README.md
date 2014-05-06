HTML5 Form Shim
==============
[![Build Status](https://travis-ci.org/dsheiko/HTML5-Form-Shim.png)](https://travis-ci.org/dsheiko/HTML5-Form-Shim)

* The project site: https://github.com/dsheiko/HTML5-Form-Shim
* The demo site: http://dsheiko.github.io/HTML5-Form-Shim/

That is a jQuery plugin, which brings [HTML5 Form](http://www.w3.org/TR/html5/forms.html) support on legacy browsers and allow to extend HTML5 Form on new ones.
Different browsers provide different look&feel for the form elements. However you would hardly able to re-style bubble validation messages , date-picker, color-picker and others. With this plugin you may intercept browser native HTML5 Form API control and, therefore, have all the attached UI components always in the same style. Besides, you can have own validation messaging (e.g. showing messages next to the field instead using tooltips).

### How to use
To enable the shim you simply mark forms with `data-enable-shim="true"` while running jQuery and this plugin.

```
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="./build/jquery.html5form.min.js" type="text/javascript"></script>
```
```
<form data-enable-shim="true">
...
</form>
```


See details on how to use HTML5 form at http://www.html5rocks.com/en/tutorials/forms/html5forms/

### Styling

Take in the account that legacy browsers ignore CSS pseudo-classes :focus, :invalid, :valid, so use instead classes focus, invalid, valid.

NOTE: The examples below use CSS3 styles. If you want your forms not only behave, but look the same in all browsers, use simple styles

### Features

* [The constraint validation API](http://www.w3.org/html/wg/drafts/html/master/forms.html#the-constraint-validation-api) exposed on HTMLElement for legacy browser and on h5FormShim input wrappers (e.g. input.checkValidity(), input.validationMessage, input.validity.typeMismatch where var input = hfFormShim.getInput("#email")).
* Can show validation messages on custom elements
* Easy attach of 3rd-party-made widgets (datepicker, colorpicker, slider as so on)
* Allows custom on-submit tooltips
* Allows custom input type validators
* Allows custom on-input callbacks
* Shim formaction, formenctype, formmethod, and formtarget attributes
* Covered with tests
* Implemented as UMD (can be used as AMD or CommonJS modules)


#### Example 1: Custom form submission validation

```
<form class="example1" data-custom-validation="true" data-enable-shim="true">
    <label for="name">Name:</label>
    <input type="text" placeholder="Name" required="true" name="name"  />
    <label for="email">Email:</label>
    <input type="email" placeholder="Email" autofocus="true" required="true" name="email" />
    <label for="name">Age:</label>
    <input type="number" required="true" name="age" min="18" max="100" />
    <label for="email">Promo code:</label>
    <input type="text" name="promocode" required="true" pattern="[A-Z]{3}[0-9]{4}"
title="Promo code consist of 3 uppercase letters followed by 4 digits." />
    <label for="email">Tel:</label>
     <input type="tel" name="tel" required="true" pattern="^\+(?:[0-9] ?){6,14}[0-9]$"
title="Please enter valid tel." />
    <button type="submit">Submit</button>
</form>
```

This form shows custom tooltips as on old browsers as well as on those supporting HTML5.

To make the form showing your custom tooltip on submission validation, define `data-custom-validation` property on the
form element.

The plugin will use $.setCustomValidityCallback to display validation messages. You can override this callback with
your own function:

```
   $.setCustomInputTypeValidator = function( type, msg, validatorCb, initCb ) {
         Control[ type ] = function() {
                return {
                    "__extends__" : AbstractControl,
                    "__init__": function() {
                        initCb && initCb.apply( this.boundingBox, [ this ] );
                    },
                    validateValue: function() {
                        validatorCb.apply( this.boundingBox, [ this ] ) ||
                            this.throwValidationException( "customError", msg );
                        return this.logger;
                    }
                };
            };
     };
```

#### Example 2: Showing validation messages on custom elements
```
<form class="example2" data-custom-validation="true" data-enable-shim="true">
    <label for="email">Email:</label>
    <input id="f2email" type="email" placeholder="Email" required="required" name="email" />
    <div class="help-inline">
        <div data-validation-message-for="f2email"></div>
    </div>
    <label for="name">Age:</label>
    <input id="f2age" type="number" required="required" name="age" min="18" max="100" />
    <div class="help-inline">
        <div data-validation-message-for="f2age"></div>
    </div>
    <button class="btn btn-inverse btn-large" type="submit">Submit</button>
</form>
```
This form is forced to custom validation by attribute `data-custom-validation`.
So whatever browser you use it displays validation messages on the elements marked as `data-validation-message-for="<input-id>"`

#### Example 3: Custom input type validation

```
<form class="example3" data-enable-shim="true">
    <label for="name">Zipcode (custom input type):</label>
    <input type="zipcode" placeholder="Zipcode" required="required" name="zipcode"  />
    <button class="btn btn-inverse btn-large" type="submit">Submit</button>
</form>
```

You can easily define your own input validator by using `$.setCustomInputTypeValidator`. It receives following arguments:

type | description
--- | ---
(string) | Input type (here Zip for `<input type="zip">`)
(string) | Input value validation message
(function) | Validation callback (returns boolean)
(function) | (OPTIONAL) Initialization callback

```
$.setCustomInputTypeValidator( "Zip", "Please enter a valid zip code", function() {
    var pattern = /^[0-9]{6,8}$/;
    return pattern.test( $( this ).val() );
});
```
Mark that the input element is available within the callback as the context (`this`).


#### Example 4: Attaching 3rd-party widgets to form elements
```
<form class="example4" data-enable-shim="true">

    <label for="color">Color:</label>
    <input type="color" name="color" value="#d4251b" />

    <label for="date">Date:</label>
    <input type="date" name="date" />

    <button class="btn btn-inverse btn-large" type="submit">Submit</button>
</form>
```
You can attach to any input element a custom handler. Thus you can enrich inputs of such types as color, date,
datetime, week, moth, time, range with corresponding widgets (e.g. how it's implemented in latest Chrome/Opera releases).

In the example below you can find color input using `colorPicker` jQuery-plugin and date input using jQueryUI `datePicker`

```
// Custom color input handler example
$.setCustomInputTypeValidator( "Color", "Please enter a valid hex color", function() {
		var pattern = /^#(?:[0-9a-f]{3}){1,2}$/i;
		return pattern.test( $( this ).val() );
}, function( control ) {
		control.isShimRequired() &&
		control.boundingBox.ColorPicker({
				onChange: function( hsb, hex, rgb ) {
						control.boundingBox.val( "#" + hex );
				},
				onBeforeShow: function () {
						$( this ).ColorPickerSetColor( this.value );
				}
		});
});

// Custom date input handler example
$.setCustomInputTypeValidator( "Date", "Please enter a valid date", function() {
		var pattern = /^\d{2,4}(-|\/)\d{2,4}(-|\/)\d{2,4}$/i;
		return !$( this ).val() || pattern.test( $( this ).val() );
}, function( control ) {
		control.isShimRequired() &&
		control.boundingBox.datepicker();
});
```
As you see here last argument of `$.setCustomInputTypeValidator` is initialization callback.
It injects dependency to input control handler (control). From which you can access
the element `control.boundingBox` ( the same as $(this) ) and methods such as `control.isShimRequired()`
(indicates if if the input type supported)

#### Example 5: Custom oninput callback
```
<form class="example5"  data-custom-validation="true" data-enable-shim="true">
    <label for="email">Email:</label>
    <input type="email" placeholder="Email" required="required" name="email" />
    <label for="password">Password:</label>
    <input type="password" required="required" name="password" />
    <label for="confirm">Password confirmation:</label>
    <input type="password" required="required" name="confirm" />
    <button class="btn btn-inverse btn-large" type="submit">Submit</button>
</form>
```

HTML5 introduces a new event `input`, which can be handled to perform additional validation tests on a field.
For example, making registration form you can define a handler which checks by XMLHttpRequest if the
given email already exists in DB. Here an example for a cross-browser on-input handler:

```
$('form.example3 input[name=confirm]').on("input", function () {
    var input = $(this);
    if (input.val() != $('form.example3 input[name=password]').val()) {
    input.setCustomValidity('The two passwords must match.');
    } else {
    // input is valid -- reset the error message
    input.setCustomValidity('');
    }
});
```

## API


### hfFormShim

#### .init( options ): <self>

Repeat initialization on a given form or all the forms in DOM if no argument given

Whereas options is an object of the following structure:
```
{
    boundingBox: formNode, // OPTIONAL
    inputs: "input, textarea, select", // OPTIONAL, by default "input, textarea"
    handlers: { // OPTIONAL
        onSubmit: fn()
    }
}
```

If `boundingBox` property is missing, all the form marked with `data-enable-shim="true"` will be initialized.
It's pretty handy for ebling HTML5FormShim on dynamically built pages

#### .getInput( $input ): AbstractInput

Obtain AbstractInput (hfFormShim input wrapper) for the given node to get access to `The constraint validation API`

#### .onReady( callback ): self

Invokes the callback function when all the specified forms initialized. The callback takes one parameter - `page` object.
You can obtain one of initialized form objects by index `page.getForm( index )`.


### AbstractInput

#### .validator.reset(): void
Reset input validation state to defaults

#### .validator.checkValidity(): boolean
Run all the validity tests (validateRequired, validateValue, validateByPattern, validateCustomValidity) and
return validation status

#### .validator.validateRequired(): boolean
Throws validation exception if input value is empty on a required input

#### .validator.validateCustomValidity(): void
Throws validation exception if input node `data-customvalidity` attribute has been modified.
Handy when `data-customvalidity` been changed externally (e.g. AJAX)

#### .validator.validateByPattern(): void
Throws validation exception if input value doesn't match the provided pattern

#### .validator.validateValue()(): void
Throws validation exception if constraints given to this input type are not satisfied


#### .throwValidationException( validationProperty, validationMessage )
Trigger validation exception which reflects on `The constraint validation API`

#### .shim.isShimRequired(): boolean
Shim is required when the input type isn't supported or custom validation requested (`data-custom-validation="true"`)

#### .shim.degrade(): void
Set attribute to text to avoid collisions with browser embedded input handlers

## Class Digram
![Class Diagram](https://github.com/dsheiko/HTML5-Form-Shim/raw/master/doc/class-diagram.png)

## Building

The project can be built with [Grunt task runner](http://gruntjs.com/).
During the build Grunt validates the JavaScript sources with jshint and [jscs](https://github.com/dsheiko/jscodesniffer),
compiles JavaScripts UMD modules using [cjsc](https://github.com/dsheiko/cjsc),
runs Qunit tests and minifies JavaScript. To make a build just fire up Grunt anywhere within your project directory:

Producing .build/jquery.html5form.min.js
```
grunt build
```
Producing .build/jquery.html5form.js
```
grunt debug
```
Running automated tests and code style validation
```
grunt test
```

As you commit TravisCI reports you if the build isn't successful

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/c47f48053eefc566f7a4790801f3ff6e "githalytics.com")](http://githalytics.com/dsheiko/HTML5-Form-Shim)