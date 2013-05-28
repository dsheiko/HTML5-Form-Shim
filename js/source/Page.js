            function() {
               var forms = [];
               return {
                   /**
                    * @name __constructor__
                    * @memberof Page
                    */
                   "__constructor__": function() {
                       $("form[data-enable-shim='true']").each(function(){
                           forms.push( util.createInstance( Form, [ { boundingBox: $( this ) } ] ) );
                       });
                   },
                   /**
                    * Look up for AbstractInput instance for the given HTMLElement
                    * @memberof Page
                    * @public
                    * @param {object} node
                    * @return (object) AbstractInput
                    */
                   getInput: function( node ) {
                       var $node = $( node ),
                           input;
                       for ( var i in forms ) {
                           if ( ( input = forms[ i ].getInput( $node ) ) ) {
                               return input;
                           }
                       }
                       return null;
                   }
               };
           }