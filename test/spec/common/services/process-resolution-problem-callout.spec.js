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
    describe('isActorResolutionFailing', function() {

      it('should return false when value state target type is not present', function() {
        expect(processProblemResolutionService.isActorResolutionFailing()).toBeFalsy();
        expect(processProblemResolutionService.isActorResolutionFailing({})).toBeFalsy();
        expect(processProblemResolutionService.isActorResolutionFailing([])).toBeFalsy();
        expect(processProblemResolutionService.isActorResolutionFailing(['actorsd', 'connector', 'bdm'])).toBeFalsy();
        expect(processProblemResolutionService.isActorResolutionFailing({'actor': 'connector'})).toBeFalsy();
      });

      it('should return true when value state target type is not present', function() {
        expect(processProblemResolutionService.isActorResolutionFailing(['actor', 'actor', 'actor'])).toBeTruthy();
        expect(processProblemResolutionService.isActorResolutionFailing(['connector', 'bdm', 'actor'])).toBeTruthy();
      });
    });
    describe('isConnectorResolutionFailing', function() {

      it('should return false when value state target type is not present', function() {
        expect(processProblemResolutionService.isConnectorResolutionFailing()).toBeFalsy();
        expect(processProblemResolutionService.isConnectorResolutionFailing({})).toBeFalsy();
        expect(processProblemResolutionService.isConnectorResolutionFailing([])).toBeFalsy();
        expect(processProblemResolutionService.isConnectorResolutionFailing(['actors', 'connectord', 'bdm'])).toBeFalsy();
        expect(processProblemResolutionService.isConnectorResolutionFailing({'actor': 'connector'})).toBeFalsy();
      });

      it('should return true when value state target type is not present', function() {
        expect(processProblemResolutionService.isConnectorResolutionFailing(['connector', 'connector', 'connector'])).toBeTruthy();
        expect(processProblemResolutionService.isConnectorResolutionFailing(['connector', 'bdm', 'actor'])).toBeTruthy();
      });
    });
    describe('isParameterResolutionFailing', function() {

      it('should return false when value state target type is not present', function() {
        expect(processProblemResolutionService.isParameterResolutionFailing()).toBeFalsy();
        expect(processProblemResolutionService.isParameterResolutionFailing({})).toBeFalsy();
        expect(processProblemResolutionService.isParameterResolutionFailing([])).toBeFalsy();
        expect(processProblemResolutionService.isParameterResolutionFailing(['parmeter', 'connector', 'bdm'])).toBeFalsy();
        expect(processProblemResolutionService.isParameterResolutionFailing({'actor': 'connector'})).toBeFalsy();
      });

      it('should return true when value state target type is not present', function() {
        expect(processProblemResolutionService.isParameterResolutionFailing(['parameter', 'parameter', 'parameter'])).toBeTruthy();
        expect(processProblemResolutionService.isParameterResolutionFailing(['connector', 'bdm', 'parameter'])).toBeTruthy();
      });
    });
    describe('buildProblemsList', function() {
      it('should return the appropriate messages when there are error in state resolution', function() {
        expect(processProblemResolutionService.buildProblemsList([])).toEqual([]);
        expect(processProblemResolutionService.buildProblemsList(['actor'])).toEqual(['Entity Mapping must be resolved before enabling the Process.']);
        expect(processProblemResolutionService.buildProblemsList(['parameter'])).toEqual(['Parameters must be resolved before enabling the Process.']);
        expect(processProblemResolutionService.buildProblemsList(['connector'])).toEqual(['Connector definitions must be resolved before enabling the Process.']);
        expect(processProblemResolutionService.buildProblemsList(['parameter', 'toto', 'connector'])).toContain('Parameters must be resolved before enabling the Process.', 'Connector definitions must be resolved before enabling the Process.');
      });
    });
  });
})();
