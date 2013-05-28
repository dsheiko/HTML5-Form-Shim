                function() {
                   return {
                       "__extends__" : AbstractInput,
                        /**
                         * @name __constructor__
                         * @memberof Input.Url
                         */
                       "__constructor__": function() {
                           this.degrade();
                       },
                       /**
                         * Validate input value
                         *
                         * @public
                         * @memberof Input.Url
                         * @return {object} ValidationLogger
                         */
                       validateValue: function() {
                           // The pattern is taken from http://stackoverflow.com/questions/2838404/javascript-regex-url-matching
                           // pattern fragments: protocol, domain name OR ip (v4) address, port and path, query string, fragment locater
                           var pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d\-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[\-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=\-]*)?(\#[\-a-z\d_]*)?$/i;
                            pattern.test( this.boundingBox.val() ) ||
                                this.throwValidationException( "typeMismatch",
                                    "Please enter a valid URL");
                       }
                   };
               }