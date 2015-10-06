'use strict';



var template = {};
angular.module('basejumpsApp')
  .controller('MainCtrl', function ($scope, Auth, User, $http, $routeParams) {
    $scope.awesomeThings = [];
    $scope.polls = [];
    $scope.optionElems = ['Coke','Pepsi'];
    $scope.pollOptions = [];
    $scope.page = 'createPoll';
    $scope.params = $routeParams;
    $scope.mypolls = [];

    function searchQuery(){
      if($routeParams.username !== null && $routeParams.query !== null){
        //console.log($scope.polls);

        for(var i in $scope.polls){
          var query = $scope.polls[i].name.replace(/[?]/g,'');
          if(query === $routeParams.query && 
            $scope.polls[i].username === $routeParams.username){

            $scope.voteObj = $scope.polls[i];
            $scope.select = Object.keys($scope.voteObj.polls)[0];
            $scope.page = 'vote';
          }
        }
      }
    }
    $scope.changeView = function(page){
      window.history.pushState("string", "title", "");
      $scope.page=page;
    };

    $scope.voteSubmit = function(){
      $scope.voteObj.polls[$scope.select] += 1;
      updatePoll($scope.voteObj);
      $scope.graph($scope.voteObj);
    };

    $scope.addOption = function(){
      $scope.optionElems.push('New Option');
    };

    $scope.isLoggedIn = function(){
      return Auth.isLoggedIn();
    };

    function getPolls(){
      $http.get('/api/polls').success(function(polls) {
        $scope.polls = polls;
        var user = Auth.getCurrentUser().name;
        $scope.mypolls=[];
        for(var i in polls){
          if(polls[i].username === user)
            $scope.mypolls.push(polls[i]);
        }
        searchQuery();

      });
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    function updatePoll(poll){
      $http.put('/api/polls/' + poll._id, poll);
    }

    $scope.addPoll = function() {
      if($scope.newPoll === '') {
        return;
      }
      $scope.newPoll.polls = {};
      for(var i in $scope.pollOptions){
        $scope.newPoll.polls[$scope.pollOptions[i]] = 0; 
      }
      $scope.newPoll.username = Auth.getCurrentUser().name;
      //console.log($scope.newPoll);
      $http.post('/api/polls', $scope.newPoll );
      getPolls();
      $scope.page = 'postedPoll';
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
      getPolls();
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.graph = function(poll){
      template.xAxis.categories=[];
      template.series[0].data = [];
      template.title.text=poll.name;
      for(var i in poll.polls){
        template.xAxis.categories.push(i);
        template.series[0].data.push(poll.polls[i]);
      }
      $('#graph').highcharts(template);
      $scope.page='graph';
    };

    getPolls();
  });

template = {
  chart: {
      type: 'column'
  },
  title: {
      text: 'Monthly Average Rainfall'
  },
  xAxis: {
      categories: [],
      crosshair: true
  },
  yAxis: {
      min: 0,
      title: {
          text: 'Votes'
      }
  },
  tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [{
      name: '',
      data: []

  }]
};
