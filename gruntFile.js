/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      //ignore bluebutton.js library when running jsHint
      files: ['*.js', './lib/*.js', './test/*.js', '!./lib/bluebutton.min.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        expr:true,
        globals: {
          'it': true,
          'describe': true,
          'before': true,
          'after': true,
          'done': true
        }
      }
    },
    watch: {
      all: {
        files: ['./lib/*.js', '*.js'],
        tasks: ['default']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: '10000'
        },
        src: ['test/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  //Express omitted for travis build.
  grunt.registerTask('commit', ['jshint', 'mochaTest']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};