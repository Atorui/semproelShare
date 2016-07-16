module.exports = (grunt) ->

  grunt.initConfig()
  
  grunt.loadNpmTasks 'grunt-npm'
  
  grunt.registerTask 'default', 'Default task',->
    grunt.task.run []
