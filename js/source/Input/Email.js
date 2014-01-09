				module.exports = function() {
					return {
						__extends__: AbstractInput,
						/**
							* @name __constructor__
							* @memberof Input.Email
							*/
						__constructor__: function() {
							this.degrade();
						},
						/**
							* Validate input value
							*
							* @public
							* @memberof Input.Email
							* @return {object} ValidationLogger
							*/
						validateValue: function() {
							var pattern = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
							pattern.test( this.boundingBox.val() ) ||
								this.throwValidationException( "typeMismatch",
									"Please enter a valid email address" );
						}
					};
				};