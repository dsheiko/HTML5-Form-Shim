				module.exports = function() {
					return {
						__extends__: AbstractInput,
						/**
							* @name __constructor__
							* @memberof Input.Tel
							*/
						__constructor__: function() {
							this.degrade();
						},
						/**
							* Validate input value
							*
							* @public
							* @memberof Input.Tel
							* @return {object} ValidationLogger
							*/
						validateValue: function() {
							var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
							pattern.test( this.boundingBox.val() ) ||
								this.throwValidationException( "typeMismatch",
								"Please enter a valid tel. number +1 11 11 11" );
						}
					};
				};