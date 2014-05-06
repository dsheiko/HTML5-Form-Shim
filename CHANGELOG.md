# v2.3.0 (2014-05-06)

## Architectural Improvements
- fully refactored
- all the components of the application implemented as UMD-modules and compiled with [cjsc](https://github.com/dsheiko/cjsc) into a single browser-compliant file
- better coverage with automated tests
- provided example of usage together with RequireJS ./tests/requirejs.html

# v2.2.1
- Adopted localization proposed by @weberhofer and refactored it

# v2.2.0
- Now forms shimed automatically only on demand (data-enable-shim="true")
- One can pass custom onSubmit form handler and query selector form inner input controls via hfFormShim.init
- The whole source script splitted into meaningful chunks, ANT build script is to reassemble it

# v2.0.0
- The constraint validation API exposed on jQuery HTMLElement wrapper
- Covered with tests
- Allow to specify custom validation message placeholder element
- Resulting code is wrapped as UMD (can be used as AMD or CommonJS module)
- Simple API to attach 3rd-party-made widgets (datepicker, colorpicker, slider as so on)

# v1.0.0
- First release