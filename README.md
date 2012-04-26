# HTML5 Form Shim

* The project site: https://github.com/dsheiko/HTML5-Form-Shim
* The demo site: http://demo.dsheiko.com/html5formshim/

That is a jquery plugin, which emulates HTML5 Form behavior on old browsers.

The plugin also allows to customize form submission validation tooltips and field validation callbacks
(e.g. via XMLHttpRequest)

Currently the plugins serves following input types:

* text
* text
* email
* url
* number
* tel

and following input properties:

* novalidate
* placeholder
* required
* autofocus
* pattern
* min
* max

### How to use
To enable the shim you simply have to include jQuery and this plugin.

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    <script src="./js/jquery.html5form.js" type="text/javascript"></script>


See details on how top use HTML5 form at http://www.html5rocks.com/en/tutorials/forms/html5forms/

### Styling

Take in the account that legacy browsers ignore CSS pseudo-classes :focus, :invalid, :valid, so use instead classes focus, invalid, valid.

NOTE: The examples below use CSS3 styles. If you want your forms not only behave, but look the same in all browsers, use simple styles

Example 1: Custom form submission validation

    <form class="example1" data-custom-validation="true">
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


This form shows custom tooltips as on old browsers as well as on those supporting HTML5.

To make the form showing your custom tooltip on submission validation, define data-custom-validation property on the
form element.

The plugin will use $.setCustomValidityCallback to disaply validation messages. You can override this callback with
your own function:

    $.setCustomValidityCallback = function(error) {
       var pos = this.position(),
       tooltip = $('<span class="custom-validity-tooltip">' + error
                   + '<div><div><!-- --></div></div></span>').appendTo('body');
       tooltip.css('top', pos.top - tooltip.height() - 22);
       tooltip.css('left', pos.left - 10);
       window.setTimeout(function(){
            tooltip.remove();
       }, 2500);
    }


If you need your custom text for validation message, please use $(input).setCustomValidity
instead of input.setCustomValidity:

    $('form.example1 input[name=email]').setCustomValidity('Email rejected');


Example 2: Custom input type validation

   <form class="example2">
        <label for="name">Zipcode (custom input type):</label>
        <input type="zipcode" placeholder="Zipcode" required="true" name="zipcode"  />
        <button type="submit">Submit</button>
    </form>


Using the plugin you can define your own input validator:

    Custom input type validator example
        $.setCustomInputTypeValidator.Zipcode = function() {
            return {
                init: function() {
                    this.validationMessage.typeMismatch = "Please enter a valid zip code";
                },
                checkValidity: function() {
                    var pattern = /^[0-9]{6,8}$/g;
                    this.validity.typeMismatch = pattern.test(this.element.val());
                }
            }
        };


Example 3: With custom oninput callback

    <form class="example3" >
        <label for="email">Email:</label>
        <input type="email" placeholder="Email" required="true" name="email" />
        <label for="password">Password:</label>
        <input type="password" required="true" name="password" />
        <label for="confirm">Password confirmation:</label>
        <input type="password" required="true" name="confirm" />
        <button type="submit">Submit</button>
    </form>


HTML5 introduces a new event oninput, which can be handled to perform additional validation tests on a field.
For example, making registration form you can define a handler which checks by XMLHttpRequest if the given email
already exists in DB. Here an example for a cross-browser oninput handler:

    $('form.example3 input[name=confirm]').bind("oninput", function () {
          var input = $(this);
          if (input.val() != $('form.example3 input[name=password]').val()) {
            input.setCustomValidity('The two passwords must match.');
          } else {
            // input is valid -- reset the error message
            input.setCustomValidity('');
          }
        });
