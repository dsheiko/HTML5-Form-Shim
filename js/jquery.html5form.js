/*
* HTML5 Form Shim
*
* @package HTML5 Form Shim
* @author $Author: sheiko $
* @version $Id: jquery.html5form.js, v 1.0 $
* @license GNU
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
*/
(function( $ ) {

    var ONINPUT_DELAY = 500, TOOLTIP_SHOW_TIME = 2500,
    Util = {
        isString :  function(value) {
            return typeof(value)=='string' && isNaN(value);
        },
        isNumber :  function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        log : function(val) {
            var placeholder = $('.log');
            if (placeholder.length) {
                placeholder.html(placeholder.html() + val + '<br />');
            }
        }
    },
    Browser = {
        supportedInputTypes: (function() {
            var inputElem = document.createElement('input'),
            types = (function(props) {            
            for ( var i = 0, types =[], len = props.length; i < len; i++ ) {
                inputElem.setAttribute('type', props[i]);
                types[props[i]] = !!(inputElem.type !== 'text');
            }
            return types;
            })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
          return types;
        }()),
        /*
         * List of suppoerted properties of input element
         */
        supportedInputProps: (function() {
            var inputElem = document.createElement('input'),
                attrs = (function( props ) {                    
                    for ( var i = 0, attrs = [], len = props.length; i < len; i++ ) {
                        attrs[ props[i] ] = !!(props[i] in inputElem);
                    }
                    return attrs;
                })('autocomplete autofocus list placeholder max min multiple pattern required step'
                    .split(' '));
            return attrs;
        }())
    },
    App = {
        init: function() {
            $("form").each(function(){
                var _form = new App.Form($(this));
                _form.init();
            });
        },        
        Form : function(form) {            
            var _private = {
                form : form,
                elements: [],                
                handleOnSubmit : function(e) {
                   e.preventDefault();
                   for(var i in _private.elements) {
                       var element = _private.elements[i];
                       if (element.isRequired() && 
                           (element.element.val() === element.element.attr('placeholder')
                           || !element.element.val())) {
                           element.showTooltip("Please fill out this field");
                           return;
                       }
                       if (!element.isValid()) {
                           element.showTooltip();
                           return;
                       }
                   };
               }
            };
            return {
               init : function() {
                   var context = this;              
                    _private.form.find("input, textarea").each(function(){
                        var instance = context.makeElementInstance($(this));
                        if (instance !== false) {
                            _private.elements.push(instance);
                        }
                    });
                    _private.form.bind('submit', this, _private.handleOnSubmit);
               },
               makeElementInstance : function(element) {
                   var instance = {}, base = null;
                   switch (element.attr('type').toLowerCase()) {
                      case "email":
                           base = new App.Email();
                           break;
                      case "text":
                           base = new App.Text();
                           break;
                      case "number":
                           base = new App.Number();
                           break;
                      case "tel":
                           base = new App.Tel();
                           break;
                      case "url":
                           base = new App.Url();
                           break;
                       default:
                           return false;
                   }
                   $.extend(true, instance, base);
                   $.extend(true, instance, App.Element_Abstract);                   
                   instance.process(element);
                   return instance;
               }
            }
        },
        Element_Abstract: {
            element : null,
            hasPlaceholder: false,
            _delayedRequest: null,
            handleOnInput: function(e) {
                var context = e.data;
                if (null !== this._delayedRequest) {
                    window.clearTimeout(this._delayedRequest);
                }
                this._delayedRequest = window.setTimeout(function(){
                    this._delayedRequest = null;                    
                    context.updateStatus();
                }, ONINPUT_DELAY);
            },
            handleOnFocus : function(e) {
                var context = (typeof e === 'undefined' ? this : e.data);
                context.element.addClass('focus');
                if (context.element.val() === context.element.attr('placeholder')) {
                    context.element.val('');
                    context.element.removeClass('placeholder');
                }

            },
            handleOnBlur : function(e) {
                var context = (typeof e === 'undefined' ? this : e.data);
                context.element.removeClass('focus');
                if (!context.element.val()) {
                    context.element.val(context.element.attr('placeholder'));
                    context.element.addClass('placeholder');
                }
            },
            isset : function(prop) {
                return (typeof this[prop] !== 'undefined');
            },
            issetAttr : function(attr) {
                return (typeof this.element.attr(attr) !== 'undefined');
            },
            process: function(element) {
                this.element = element;
                if (this.isset("init")) {
                    this.init();
                }
                if (!Browser.supportedInputProps.placeholder) {
                    this.processPlaceholder();
                    this.element.bind('focusin', this, this.handleOnFocus);
                    this.element.bind('focusout', this, this.handleOnBlur);
                }
                if (!Browser.supportedInputProps.autofocus) {
                    this.processAutofocus();
                }
                if (!Browser.supportedInputProps[this.element.attr('type')]) {
                    this.syncElementUI();
                }
            },
            syncElementUI: function() {
                this.element.bind('change', this, this.handleOnInput);
                this.element.bind('mouseup', this, this.handleOnInput);
                this.element.bind('keydown', this, this.handleOnInput);
                // this.element.get().oncontextmenu =  _private.handleOnInput;

            },
            isRequired: function() {
                return (typeof this.element.attr('required') !== 'undefined');
            },
            processAutofocus: function() {
                if (this.issetAttr("autofocus")) {
                    this.element.focus();                    
                    this.handleOnFocus();
                }
            },
            processPlaceholder: function() {
                if (this.issetAttr("placeholder")) {
                    this.element.attr("autocomplete", "false");
                    this.hasPlaceholder = true;
                    this.handleOnBlur();
                }
            },
            updateStatus: function() {
                this.element.removeClass('valid').removeClass('invalid');
                this.element.addClass(this.isValid() ? 'valid' : 'invalid');                
            },
            showTooltip : function(error) {
               if (!error) {
                    error = this.element.data('customvalidity') || this.message;
               }
               $.setCustomValidityCallback.apply(this.element, [error]);


            }
        },
        Email: function() {
            return {
                message: "Please enter an email address",
                isValid: function() {
                    var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
                    return pattern.test(this.element.val());
                }               
            }
        },
       Number: function() {
            return {
                init:  function() {
                    this.message = "Please enter a valid number" +
                        ((this.issetAttr('min') && this.issetAttr('max'))
                        ? ". The value is expected to be between "
                        + parseInt(this.element.attr('min')) + " and " +
                        + parseInt(this.element.attr('max')): "");
                },
                isValid: function() {
                    if (!Util.isNumber(this.element.val())) {
                        return false;
                    }                    
                    if (this.issetAttr('min') 
                        && parseInt(this.element.val()) < parseInt(this.element.attr('min'))) {                        
                        return false;
                    }
                    if (this.issetAttr('max') 
                        && parseInt(this.element.val()) > parseInt(this.element.attr('max'))) {
                        return false;
                    }
                    return true;
                }
            }
       },
       Tel: function() {
            return {
                message: "Please enter an email address",
                isValid: function() {
                    // The pattern taken from http://blog.stevenlevithan.com/archives/validate-phone-number
                    var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/g;
                    return pattern.test(this.element.val());
                }
            }
       },
       Url: function() {
            return {
                message: "Please enter a URL address",                
                isValid: function() {
                    //The pattern is taken from http://stackoverflow.com/questions/2838404/javascript-regex-url-matching
                    var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
                        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
                        '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
                        '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
                        '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
                        '(\#[-a-z\d_]*)?$','i'); // fragment locater
                    return pattern.test(this.element.val());
                }
            }
        },
        Text: function() {
            return {
                message: "Please fill out this field",
                isValid: function() {
                    if (!this.element.attr('pattern')) {
                        return true;
                    }
                    if (!this.element.attr('title')) {
                        this.message += ": " + this.element.attr('title');
                    }
                    var pattern = new RegExp(this.element.attr('pattern'), 'g');
                    return pattern.test(this.element.val());
                }
            }
        }
    };
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
    $.fn.setCustomValidity = function(error) {
        $(this).parent('form').attr("novalidate", "novalidate");
        this.each(function() {
            $(this).data('customvalidity', error);
        });
    }
// Document is ready
$(document).bind('ready.html5formshim', App.init);


})( jQuery );

