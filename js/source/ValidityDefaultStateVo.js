		module.exports = function() {
				return {
					// Returns true if the element has no value but is a required field; false otherwise.
					valueMissing: false,
					// Returns true if the element's value is not in the correct syntax; false otherwise.
					typeMismatch: false,
					// Returns true if the element's value doesn't match the provided pattern; false otherwise.
					patternMismatch: false,
					// Returns true if the element's value is longer than the provided maximum length; false otherwise.
					tooLong: false,
					// Returns true if the element's value is lower than the provided minimum; false otherwise.
					rangeUnderflow: false,
					// Returns true if the element's value is higher than the provided maximum; false otherwise.
					rangeOverflow: false,
					// Returns true if the element's value doesn't fit the rules given by the step attribute; false otherwise.
					stepMismatch: false,
					// Returns true if the user has provided input in the user interface that the user agent
					// is unable to convert to a value; false otherwise.
					badInput: false,
					// Returns true if the element has a custom error; false otherwise.
					customError: false,
					// Returns true if the element's value has no validity problems; false otherwise.
					valid: true
				};
			};