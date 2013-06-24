/*jshint node:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: ["./js/source/**/*.js", "./tests/**/*.js"]
    },
    jscs: {
        options: {
            "standard": "Jquery"
        },
        all: ["./js/source"]
    }
  });

  grunt.registerTask("test", ["jshint", "jscs"]);
  grunt.registerTask("default", ["test"]);

};
