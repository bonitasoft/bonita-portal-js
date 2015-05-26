(function() {
  'use strict';
  describe('ProcessProblemResolutionService', function() {
    var processProblemResolutionService;

    beforeEach(module('org.bonitasoft.service.process.resolution'));

    beforeEach(function() {

      inject(function($injector) {
        processProblemResolutionService = $injector.get('ProcessProblemResolutionService');
      });
    });
    describe('empty or bad state problem resolution', function() {

      it('should return false when value state target type is not present', function() {
        expect(processProblemResolutionService.buildProblemsList()).toEqual([]);
        expect(processProblemResolutionService.buildProblemsList({})).toEqual([]);
        expect(processProblemResolutionService.buildProblemsList({})).toEqual([]);
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'actorsd'
        }, {
          type: 'bdm'
        }])).toEqual([]);
        expect(processProblemResolutionService.buildProblemsList({
          'actor': 'connector'
        })).toEqual([]);
      });
    });
    describe('actors', function() {
      it('should return the appropriate message', function() {
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'actor'
        }, {
          type: 'actor'
        }])).toEqual([{
          type: 'actor',
          message: 'Entity Mapping must be resolved before enabling the Process.'
        }]);
      });
    });
    describe('connector', function() {
      it('should return the appropriate message', function() {
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'connector'
        }, {
          type: 'connector'
        }])).toEqual([{
          type: 'connector',
          message: 'Connector definitions must be resolved before enabling the Process.'
        }]);
      });
    });
    describe('params', function() {
      it('should return the appropriate message', function() {
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'parameter'
        }, {
          type: 'parameter'
        }])).toEqual([{
          type: 'parameter',
          message: 'Parameters must be resolved before enabling the Process.'
        }]);
      });
    });
    describe('business data', function() {
      it('should return the appropriate message', function() {
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'business data',
          'ressource_id': 'news'
        }, {
          type: 'business data',
          'ressource_id': 'labels'
        }])).toEqual([{
          type: 'business data',
          message: 'The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.',
          args: 'news, labels'
        }]);
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'business data',
          'ressource_id': 'news'
        }, {
          type: 'business data',
          'ressource_id': 'labels'
        }, {
          type: 'business data',
          'ressource_id': 'links'
        }])).toEqual([{
          type: 'business data',
          message: 'The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.',
          args: 'news, labels,...'
        }]);
      });
    });
    describe('form mapping', function() {
      it('should return the appropriate message', function() {
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'form mapping',
          'ressource_id': 'news'
        }, {
          type: 'form mapping',
          'ressource_id': 'PROCESS_OVERVIEW'
        }])).toEqual([{
          type: 'form mapping',
          message: 'The following form mappings are not resolved: [ {} ]',
          args: 'news, Case overview'
        }]);
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'form mapping',
          'ressource_id': 'PROCESS_OVERVIEW'
        }, {
          type: 'form mapping',
          'ressource_id': 'PROCESS_START'
        }, {
          type: 'form mapping',
          'ressource_id': 'links'
        }])).toEqual([{
          type: 'form mapping',
          message: 'The following form mappings are not resolved: [ {} ]',
          args: 'Case overview, Case start,...'
        }]);
      });
    });
    describe('problemsLists', function() {
      it('should return the appropriate messages when there are error in state resolution', function() {
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'actor'
        }, {
          type: 'parameter'
        }])).toEqual([{
          type: 'actor',
          message: 'Entity Mapping must be resolved before enabling the Process.'
        }, {
          type: 'parameter',
          message: 'Parameters must be resolved before enabling the Process.'
        }]);
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'parameter'
        }, {
          type: 'actor'
        }])).toEqual([{
          type: 'actor',
          message: 'Entity Mapping must be resolved before enabling the Process.'
        }, {
          type: 'parameter',
          message: 'Parameters must be resolved before enabling the Process.'
        }]);
        expect(processProblemResolutionService.buildProblemsList([{
          type: 'actor'
        }, {
          type: 'parameter'
        }, {
          type: 'business data',
          'ressource_id': 'news'
        }, {
          type: 'business data',
          'ressource_id': 'labels'
        }, {
          type: 'business data',
          'ressource_id': 'links'
        }, {
          type: 'connector'
        }])).toEqual([{
          type: 'actor',
          message: 'Entity Mapping must be resolved before enabling the Process.'
        }, {
          type: 'connector',
          message: 'Connector definitions must be resolved before enabling the Process.'
        }, {
          type: 'parameter',
          message: 'Parameters must be resolved before enabling the Process.'
        }, {
          type: 'business data',
          message: 'The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.',
          args: 'news, labels,...'
        }]);
      });
    });
  });
})();
