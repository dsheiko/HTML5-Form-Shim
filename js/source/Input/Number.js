                module.exports = function() {
                    return {
                        __extends__ : AbstractInput,
                        /**
                         * @name __constructor__
                         * @memberof Input.Number
                         */
                        __constructor__: function() {
                           this.degrade();
                        },
                        /**
                         * Validate input value
                         *
                         * @public
                         * @memberof Input.Number
                         * @return {object} ValidationLogger
                         */
                        validateValue: function() {
                            util.isNumber( parseInt( this.boundingBox.val(), 10 ) ) ||
                                this.throwValidationException( "typeMismatch",
                                    "Please enter a valid number");
                            (this.boundingBox.attr('min') &&
                                parseInt(this.boundingBox.val(), 10) < parseInt(this.boundingBox.attr('min'), 10)) &&
                                this.throwValidationException("rangeUnderflow");

                            (this.boundingBox.attr('max') &&
                                parseInt(this.boundingBox.val(), 10) > parseInt(this.boundingBox.attr('max'), 10)) &&
                                this.throwValidationException("rangeOverflow");
                        }
                    };
               };