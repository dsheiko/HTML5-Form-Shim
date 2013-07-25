        module.exports = function() {
               return {
                   /**
                    * Reference to the input element
                    * @memberof AbstractInput
                    * @type {object}
                    */
                   boundingBox: null,

                   /**
                    * @memberof AbstractInput
                    * @type (object)
                    */
                   defaultValidationMessages: { 
                       en: {
                           valueMissing : "Please fill out this field",
                           typeMismatch : "",
                           patternMismatch : "The pattern is mismatched",
                           rangeUnderflow: "The value is too low",
                           rangeOverflow: "The value is too high",
                           tooLong: "The value is too long",
                           stepMismatch: "Invalid step for the range",
                           badInput: "The user agent is unable to convert to a value",
                           customError: "" },
                       de: {
                           valueMissing : "Bitte füllen Sie dieses Feld aus",
                           typeMismatch : "",
                           patternMismatch : "Die Eingabe stimmt nicht mit dem vorgegebenen Muster überein",
                           rangeUnderflow: "Der Wert ist zu niedrig",
                           rangeOverflow: "Der Wert ist zu hoch",
                           tooLong: "Die Eingabe ist zu lang",
                           stepMismatch: "Ungültiger Schritt in diesem Bereich",
                           badInput: "Der Browser kann die Eingabe nicht in einen gültigen Wert umwandeln",
                           customError: "" }
                   },
                   /**
                    * Constraint validation API
                    * @namespace
                    * @memberof AbstractInput
                    */
                   validity: new ValidityDefaultStateVo(),
                   /**
                    * Returns the error message that would be shown to the user if the element was to be checked for validity.
                    * @memberof AbstractInput
                    * @type (string)
                    */
                   validationMessage: "",

                   /**
                    * reference to the bound validation message container
                    * @memberof AbstractInput
                    * @type {object}
                    */
                   validationMessageNode: null,
                   /**
                    * Timeout id
                    * @memberof AbstractInput
                    * @type {number}
                    */
                   deferredRequest: null,
                   /**
                    * @memberof AbstractInput
                    * @type {boolean}
                    */
                   forceShim: false,
                   /**
                    * Input constructor
                    * @name __constructor__
                    * @memberof AbstractInput
                    * @param {object} boundingBox
                    * @param {boolean} forceShim
                    */
                   __constructor__: function( boundingBox, forceShim ) {
                       var that = this;
                       this.boundingBox = boundingBox;
                       this.forceShim = !!forceShim;
                       this.boundingBox.removeClass('valid invalid');

                       // Support checkValidity element method
                       this.boundingBox.checkValidity = function() {
                           return that.checkValidity();
                       };

                       this.shimSetCustomValidity();
                       this.lookForValidationMessageNode();

                       if ( this.forceShim ||
                           !modernizr.supportedInputProps.placeholder) {
                           this.shimPlaceholder();
                       }
                       // If required attr. is not supported,
                       // mark the field with "required" class
                       if ( this.forceShim ||
                           !modernizr.supportedInputProps.required) {
                           this.shimRequired();
                       }
                       if ( this.forceShim ||
                           !modernizr.supportedInputProps.autofocus) {
                           this.shimFocusPseudoClass();
                           this.shimAutofocus();
                       }
                       // If custom-validation attr declared,
                       // it disables default H5 form handler
                       if (this.boundingBox.data('custom-validation')) {
                           this.boundingBox.attr( 'novalidate', 'novalidate' );
                       }
                       if ( this.isShimRequired() ) {
                           this.shimOnInput();
                       }
                   },
                   /**
                    * alias for jQuery().val()
                    * @public
                    * @return (String)
                    * @memberof AbstractInput
                    */
                   val : function( val ) {
                       return val !== undefined ? ( this.boundingBox = val ) :
                           this.boundingBox;
                   },
                   /**
                    * Set attribute text to avoid collisions with browser
                    * embedded input handlers
                    * @public
                    * @memberof AbstractInput
                    */
                   degrade : function() {
                       this.boundingBox.get( 0 ).type = "text";
                       return this;
                   },
                   shimSetCustomValidity : function() {
                       // Support setCustomValidity element method
                       this.boundingBox.get( 0 ).setCustomValidity =
                           $.fn.setCustomValidity;

                       this.boundingBox.get( 0 ).setCustomValidity = function( msg ) {
                           msg && this.throwValidationException( "customError", msg );
                           this.boundingBox.get( 0 ).setCustomValidity( msg );
                       };

                   },
                   /**
                    * Shim is required when the input type isn't supported
                    * or custom validation requsted
                    * @public
                    * @return (Boolean)
                    * @memberof AbstractInput
                    */
                   isShimRequired : function() {
                        return this.forceShim ||
                           !modernizr.supportedInputTypes[ this.boundingBox.attr('type') ] ||
                           this.boundingBox.data('custom-validation');
                   },
                   /**
                    * Emulate API method checkValidity
                    * @public
                    * @memberof AbstractInput
                    */
                   checkValidity: function() {
                        this.validateRequired();
                        this.checkValidityWithoutRequired();
                        return this.validity.valid;
                   },
                   /**
                    * We don't validate required on input, otherwise
                    * it would report error as sson as one focuses on the field
                    * @private
                    * @memberof AbstractInput
                    */
                   checkValidityWithoutRequired: function() {
                        this.validateValue && this.validateValue();
                        this.validateByPattern();
                        this.validateCustomValidity();
                   },
                   /**
                    * If validation message node assigned for this input found
                    * It will be used instead of tooltip
                    * @memberof AbstractInput
                    */
                   lookForValidationMessageNode: function() {
                       var id, $hint;
                       if ((id = this.boundingBox.attr("id"))) {
                           $hint = $( "form *[data-validation-message-for=" + id + "]" );
                           this.validationMessageNode = $hint.length ? $hint : null;
                       }
                   },
                   /**
                    * Show message in validation message placeholder node
                    * @public
                    * @memberof AbstractInput
                    */
                   showValidationMessage: function() {
                       var msg = this.validationMessage;
                       this.validationMessageNode.html( msg );
                       this.validationMessageNode[ msg ? "show" : "hide" ]();
                   },
                   /**
                    * Subscribe for oninput events
                    * @protected
                    * @memberof AbstractInput
                    */
                   shimOnInput: function() {
                       var that = this;
                       this.boundingBox
                        .on( 'change mouseup keydown', function() {
                            that.handleOnInput();
                        });
                       // @TODO: Context menu handling:
                       // this.boundingBox.get().oncontextmenu =  _private.handleOnInput;

                   },
                   /**
                    * Reset to default input validation state
                    * @public
                    * @memberof AbstractInput
                    */
                   resetValidationState: function()
                   {
                       this.validity = new ValidityDefaultStateVo();
                       this.validationMessage = "";
                       this.validationMessageNode && this.showValidationMessage();
                   },

                   /**
                    * Emulates oninput event
                    * @protecteds
                    * @memberof AbstractInput
                    */
                   handleOnInput: function() {
                       var that = this;
                       if ( null !== this.deferredRequest ) {
                           global.clearTimeout( this.deferredRequest );
                       }
                       this.deferredRequest = global.setTimeout( function(){
                           // Reset input validity info before validation
                           that.resetValidationState();
                           that.deferredRequest = null;
                           that.invokeOnInputCallBack();
                           that.boundingBox.trigger( "oninput", that );
                           that.checkValidityWithoutRequired();
                           that.updateState();
                           that.validationMessageNode && that.showValidationMessage();
                       }, ONINPUT_DELAY );
                   },
                   /**
                    * Calls a global handler specified in oninput attribute
                    * @protected
                    * @memberof AbstractInput
                    */
                   invokeOnInputCallBack: function() {
                       var callbackKey, pos;
                       if (this.boundingBox.attr("oninput") !== undefined) {
                           callbackKey = this.boundingBox.attr("oninput");
                           pos = callbackKey.indexOf("(");
                           callbackKey = pos ? callbackKey.substr( 0, pos ) : callbackKey;
                           if (typeof global[callbackKey]) {
                               global[callbackKey](this.boundingBox);
                           }
                       }
                   },
                   /**
                    * Remove placeholder on focus
                    * @protected
                    * @memberof AbstractInput
                    */
                   handleOnFocus : function() {
                       if (this.boundingBox.val() === this.boundingBox.attr('placeholder')) {
                           this.boundingBox.val('');
                           this.boundingBox.removeClass('placeholder');
                       }

                   },
                   /**
                    * Restore placeholder on blur
                    * @protected
                    * @memberof AbstractInput
                    */
                   handleOnBlur : function() {
                       if (!this.boundingBox.val()) {
                           this.boundingBox.val( this.boundingBox.attr('placeholder') );
                           this.boundingBox.addClass('placeholder');
                       }
                   },
                    /**
                     * Is used on form submittion to check if
                     * data-customvalidity attr. was not changed externally (e.g. AJAX)
                     * @public
                     * @memberof AbstractInput
                     */
                   validateCustomValidity: function() {
                       if ( this.boundingBox.data('customvalidity') ) {
                           this.throwValidationException( "customError", 
                            this.boundingBox.data('customvalidity') );
                           return false;
                       }
                       return true;
                   },
                   /**
                    * Add required class to element. That goes for
                    * CSS as well as for further checking
                    * @protected
                    * @memberof AbstractInput
                    */
                   shimRequired: function() {
                       this.boundingBox.attr('required') === undefined ||
                           this.boundingBox.addClass('required')
                               .data( "custom-validation" , "true" );
                   },
                   /**
                    * Toggle .focus class on the input on focus/blur events
                    *
                    * @protected
                    * @memberof AbstractInput
                    */
                   shimFocusPseudoClass: function() {
                       var that = this;
                       this.boundingBox.on( "focus", function(){
                           that.boundingBox.addClass('focus');
                       }).on( "blur", function(){
                           that.boundingBox.removeClass('focus');
                       });
                   },
                   /**
                    * Force focus
                    * and remove placeholder
                    * @protected
                    * @memberof AbstractInput
                    */
                   shimAutofocus: function() {
                       if (this.boundingBox.attr('autofocus') !== undefined) {
                           this.boundingBox.focus();
                           this.handleOnFocus();
                       }
                   },
                   /**
                    * Fallback placeholder handler
                    * @protected
                    * @memberof AbstractInput
                    */
                   shimPlaceholder: function() {
                       var that = this;
                       if ( this.boundingBox.attr("placeholder") !== undefined ) {
                           this.boundingBox.attr( "autocomplete", "false" );
                           // Display placeholder
                           this.handleOnBlur();
                           // Sync UI
                           this.boundingBox.on( 'focusin', function() {
                               that.handleOnFocus();
                           }).on( 'focusout', function() {
                               that.handleOnBlur();
                           });
                       }
                   },
                   /**
                    * Is invoked after every validation
                    * @public
                    * @memberof AbstractInput
                    * @param {string} prop
                    * @param {string} validationMessage
                    */
                   throwValidationException: function( prop, validationMessage ) {
                       if ( this.validity[ prop ] === undefined ) {
                           throw new SyntaxError(
                            "Invalid validity property '" +
                           prop + "'" );
                       }
                       this.validity[ prop ] = true;
                       this.validity.valid = false;
                       if (language != 'de') {
                           language = 'en';
                       }
                       this.validationMessage = validationMessage ||
                           this.defaultValidationMessages[ language ][ prop ];
                       this.shimConstraintValidationApi();
                   },
                   /**
                    * Try to emulate Constraint Validation Api
                    * http://www.w3.org/html/wg/drafts/html/master/forms.html#the-constraint-validation-api
                    * on legacy browsers
                    */
                   shimConstraintValidationApi: function() {
                       var node = this.boundingBox.get( 0 );
                       try {
                           node.validity = this.validity;
                       } catch ( err ) {
                           // If the element has only getter (new browsers)
                           // just ignore it
                       }
                   },

                   /**
                    * Fallback for pattern validator
                    * @public
                    * @memberof AbstractInput
                    * @return {object} ValidationLogger
                    */
                   validateByPattern: function() {
                       if (!this.boundingBox.attr('pattern')) {
                           return true;
                       }
                       var pattern = new RegExp( this.boundingBox.attr('pattern'), 'g' );
                       pattern.test( this.boundingBox.val() ) ||
                            this.throwValidationException( "patternMismatch",
                                this.boundingBox.attr('title') || null );
                   },
                   /**
                    * Fallback for isRequired validator
                    * @public
                    * @memberof AbstractInput
                    * @return {object} ValidationLogger
                    */
                   validateRequired: function() {
                       if ( this.boundingBox.hasClass('required')  &&
                            ( this.boundingBox.val() === this.boundingBox.attr('placeholder') ||
                            !this.boundingBox.val())) {
                            this.throwValidationException("valueMissing");
                        }
                   },
                   /**
                    * Update status of input
                    * @public
                    * @memberof AbstractInput
                    * @return (String) state
                    */
                   updateState: function() {
                       var state = this.validity.valid ? 'valid' : 'invalid';
                       this.boundingBox
                        .removeClass('valid invalid')
                        .addClass( state );
                        return state;
                   },
                   /**
                    * Show tooltip with validation message on the input
                    * @public
                    * @memberof AbstractInput
                    */
                   showTooltip : function( msg ) {
                      $.setCustomValidityCallback.apply( this.boundingBox,
                            [ msg || this.validationMessage ]);
                   }
               };
           };
