(function () {
    'use strict';

    angular.module('org.bonita.features.admin.cases.list', [])
        .controller('casesListCtrl',['$scope', '$filter', function($scope, $filter){
            $scope.content = 'Hello MTF !';
            $scope.columns = ['ProcessName', 'ProcessVersion', 'CaseId', 'StartDate', 'StartedBy', 'state'];
            $scope.cases = [
                {
                    'ProcessName' : 'Have Fun',
                    'ProcessVersion' : '1.0',
                    'CaseId' : 1232455,
                    'StartDate': $filter('date')(1235465464, 'medium'),
                    'StartedBy': 'Chuck Norris',
                    'state': 'Successful'
                  },
                  {
                    'ProcessName' : 'Have Sad',
                    'ProcessVersion' : '0.2',
                    'CaseId' : 789,
                    'StartDate': $filter('date')(12354, 'medium'),
                    'StartedBy': 'Olivia Newton John',
                    'state': 'Successful'
                  },
                  {
                    'ProcessName' : 'Make Fun',
                    'ProcessVersion' : '4651.0',
                    'CaseId' : 0,
                    'StartDate': $filter('date')(1469873243, 'medium'),
                    'StartedBy': 'John Travolta',
                    'state': 'California'
                  }
                ]
            ;
          }]);

  })();