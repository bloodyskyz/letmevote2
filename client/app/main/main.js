'use strict';

angular.module('basejumpsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/:username/:query', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });