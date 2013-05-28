            function( ) {

               return {
                   /**
                    * Reference to the form element
                    * @memberof Form
                    * @type {object}
                    */
                   boundingBox: null,
                   /**
                    * List of monitored child inputs
                    * @memberof Form
                    * @type {array}
                    */
                   inputs: {},
                   /**
                    * Options interface
                    * @memberof Form
                    * @type {array}
                    */
                   options: {
                        boundingBox: null,
                        inputs: "input, textarea",
                        handlers: {
                            onSubmit: function(){}
                        }

                    },
                   /**
                    * Returns true if the form has no validity problems; false otherwise.
                    * @memberof Form
                    * @type {boolean}
                    */
                   valid: true,
                   /**
                    * @name __constructor__
                    * @memberof Form
                    * @param {object} options
                    */
                   "__constructor__" : function( options ) {
                       var that = this;
                       if ( !options.boundingBox ) {
                           throw new Error("Options property boundingBox undefined");
                       }
                       this.boundingBox = options.boundingBox;
                       $.extend( this.options, options );
                       // Untie object reference
                       this.inputs = [];
                       if (this.isCustomValidation()) {
                           this.boundingBox.attr( "novalidate", "novalidate" );
                       }
                       this.shimFormAttrMutators();
                       this.initInputs();
                       this.boundingBox.on( 'submit', function( e ){
                           that.handleOnSubmit( e );
                       });
                   },
                   /**
                    * Obtain input local id (in-form unique hash)
                    * If it is not defined, the function generates a new id and
                    * bind it to the input
                    * @memberof Form
                    * @private
                    * @return (number)
                    */
                   getLocalId: function( $node ) {
                        var localId = $node.data("local-id") || Page.incrementor++;
                        $node.data("local-id", Page.incrementor );
                        return localId;
                   },
                   /**
                    * Get AbstractInput by node
                    * @memberof Form
                    * @public
                    * @return (object) AbstractInput
                    */
                   getInput: function( node ) {
                       // HTMLElement given
                       var $node = $( node ),
                           localId = this.getLocalId( $node );
                        return this.inputs[ localId ] || null;
                   },
                   /**
                    * Collect child inputs to monitor
                    * @private
                    * @memberof Form
                    */
                   initInputs: function() {
                       var that = this;
                       this.boundingBox.find( this.options.inputs ).each(function(){
                            var $node = $( this ),
                                localId = that.getLocalId( $node ),
                                instance = that.inputFactory( $node );

                            if ( instance !== false ) {
                                that.inputs[ localId ] = instance;
                            }
                        });
                   },
                   /**
                    * Shim formaction, formenctype, formmethod, and formtarget
                    * @private
                    * @memberof Form
                    */
                   shimFormAttrMutators: function() {
                       var that = this;
                       this.boundingBox.find( "input, button" ).each(function(){
                            $( this ).attr('formaction')  &&
                                $( this ).on( "click", function() {
                                    that.boundingBox.attr( 'action',
                                        $( this ).attr('formaction') );
                                });
                            $( this ).attr('formenctype') &&
                                $( this ).on( "click", function() {
                                    that.boundingBox.attr( 'enctype',
                                        $( this ).attr('formenctype') );
                                });
                            $( this ).attr('formmethod') &&
                                $( this ).on( "click", function() {
                                    that.boundingBox.attr( 'method',
                                        $( this ).attr('formmethod') );
                                });
                            $( this ).attr('formtarget') &&
                                $( this ).on( "click", function() {
                                    that.boundingBox.attr( 'target',
                                        $( this ).attr('formtarget') );
                                });
                        });
                   },
                   /**
                    * Is data-custom-validation attribute set?
                    * @public
                    * @memberof Form
                    */
                   isCustomValidation: function() {
                       return ( this.boundingBox.data('custom-validation') !== undefined );
                   },
                   /**
                    * Is novalidate attribute set?
                    * @public
                    * @memberof Form
                    */
                   isNoValidate: function() {
                       return ( this.boundingBox.attr('novalidate') !== undefined );
                   },
                   /**
                    * Set form to valid state
                    * @public
                    * @memberof Form
                    */
                   setValid: function() {
                       this.valid = true;
                       this.boundingBox.addClass('valid').removeClass('invalid');
                   },
                   /**
                    * Set form to invalid state
                    * @public
                    * @memberof Form
                    */
                   setInvalid: function() {
                       this.valid = false;
                       this.boundingBox.addClass('invalid').removeClass('valid');
                   },
                   /**
                    * Make an instance of custom validator for a given input type
                    * @public
                    * @constructs AbstractInput instances
                    * @memberof Form
                    */
                   inputFactory : function( element ) {
                       var type = util.ucfirst( element.data('type') || element.attr('type') );
                       return util.createInstance(
                        Input[ type ] || Input.Text, [ element, this.isCustomValidation() ] );
                   },
                   /**
                    * Handle on-submit event
                    * @param {event} e
                    * @private
                    * @memberof Form
                    */
                   handleOnSubmit : function( e ) {
                       var isValid = true;
                       if ( !this.inputs ) {
                           return;
                       }
                       for( var i in this.inputs ) {
                           if ( this.inputs.hasOwnProperty( i ) ) {
                                var input = this.inputs[ i ];
                                // Reset input validity info before validation
                                input.resetValidationState();
                                if ( input.isShimRequired() ) {
                                     input.checkValidity();
                                     input.updateState();
                                     // Here check for validity
                                     if ( !input.validity.valid ) {
                                         if ( input.validationMessageNode ) {
                                             input.showValidationMessage();
                                         } else {
                                             // Show tooltip and stop propagation
                                             isValid && input.showTooltip();
                                         }
                                         isValid = false;
                                     }
                                }
                           }
                       }
                       // Invoke given onSubmit handler
                       this.options.handlers.onSubmit();
                       if ( isValid ) {
                           this.setValid();
                       } else {
                           this.setInvalid();
                           e.preventDefault();
                       }
                   }
               };
           }