// Karma configuration
// Generated on Wed Dec 21 2016 22:00:19 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-resource/angular-resource.js',
      'js/**/*.js',
      'js/angularjs/angular-animate.min.js.map',
      'js/angularjs/angular-aria.min.js.map',
      'js/angularjs/angular.min.js.map',
      'js/app.js',
      'js/controllers/suppliersController.js',
      'js/controllers/supplierController.js',
      'js/controllers/mapOverViewController.js',
      'js/models/configs.js',
      'index.html',
      'css/bootstrap/bootstrap.min.css',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDXIUqHXtcSYnm2Ve3U49y2ma4pfEEGDfU',
      'css/style.css',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'js/bootstrap.min.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
