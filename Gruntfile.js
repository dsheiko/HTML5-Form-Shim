/*jshint node:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: ["js/jquery.html5form.js", "tests/**/*.js"]
    }
  });

  grunt.registerTask("test", ["jshint"]);
  grunt.registerTask("default", ["test"]);

};
