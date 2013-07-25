/*jshint node:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks("grunt-jsic");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-qunit");


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    },
    jsic: {
        files: ["./js/source/main.js", "./js/build/jquery.html5form.js"]
    },
    qunit: {
      all: ["tests/index.html"]
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: './js/build/jquery.html5form.js',
        dest: './js/build/jquery.html5form.min.js'
      }
    }
  });

  grunt.registerTask("test", ["qunit"]);
  grunt.registerTask("build", ["jshint", "jscs", "jsic", "uglify", "qunit"]);
  grunt.registerTask("default", ["build"]);

};
