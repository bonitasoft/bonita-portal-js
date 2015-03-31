/* globals Bloodhound*/
(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', ['org.bonitasoft.common.filters.date.parser',
      'jsTag', 'siyfion.sfTypeahead'
    ])
    .controller('processInformationCtrl', function($scope, process, dateParser, JSTagsCollection) {
      var vm = this;
      vm.process = process;
      vm.parseAndFormat = dateParser.parseAndFormat;
      $scope.tags = new JSTagsCollection(['jsTag', 'angularJS']);
      $scope.jsTagOptions = {
        'texts': {
          'inputPlaceHolder': 'Type text here'
        },
        'tags': $scope.tags
      };
      // Build suggestions array
      var suggestions = ['jsTag', 'c#', 'java', 'javascript', 'jquery', 'android' , 'php', 'c++', 'python', 'ios', 'mysql', 'iphone', 'sql', 'html', 'css', 'objective-c', 'ruby-on-rails', 'c', 'sql-server', 'ajax', 'xml', '.net', 'ruby', 'regex', 'database', 'vb.net', 'arrays', 'eclipse', 'json', 'django', 'linux', 'xcode', 'windows', 'html5', 'winforms', 'r', 'wcf', 'visual-studio-2010', 'forms', 'performance', 'excel', 'spring', 'node.js', 'git', 'apache', 'entity-framework', 'asp.net', 'web-services', 'linq', 'perl', 'oracle', 'action-script', 'wordpress', 'delphi', 'jquery-ui', 'tsql', 'mongodb', 'neo4j', 'angularJS', 'unit-testing', 'postgresql', 'scala', 'xaml', 'http', 'validation', 'rest', 'bash', 'django', 'silverlight', 'cake-php', 'elgg', 'oracle', 'cocoa', 'swing', 'mocha', 'amazon-web-services'];
      suggestions = suggestions.map(function(item) { return { "suggestion": item } });
      
      // Instantiate the bloodhound suggestion engine
      suggestions = new Bloodhound({
        datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.suggestion); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: suggestions
      });

      // Initialize the bloodhound suggestion engine
      suggestions.initialize();

      // Single dataset example
      $scope.exampleData = {
        displayKey: 'suggestion',
        source: suggestions.ttAdapter()
      };
      
      // Typeahead options object
      $scope.exampleOptions = {
        hint: false,
        highlight: true
      };
    });
})();