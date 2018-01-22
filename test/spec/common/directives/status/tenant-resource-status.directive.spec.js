/** Copyright (C) 2017 Bonitasoft S.A.
 * BonitaSoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
  'use strict';

  describe('status directive', () => {

    beforeEach(module('org.bonitasoft.common.directives.tenantResourceStatus'));
    beforeEach(module('org.bonitasoft.templates'));


    var element, scope, userAPI, getUserRequest, gettext, $q;

    beforeEach(inject(function ($rootScope, $compile, _userAPI_, _gettext_, $document, _$q_) {
      scope = $rootScope.$new();
      $q = _$q_;
      userAPI = _userAPI_;
      gettext = _gettext_;

      getUserRequest = $q.defer();
      spyOn(userAPI, 'get').and.returnValue({
        $promise: getUserRequest.promise
      });

      var template = '<bo-tenant-resource-status data="status"></bo-tenant-resource-status>';
      element = $compile(template)(scope);
      scope.$apply();

    }));

    describe('Installed status',function(){

      it('should be show data when status is installed', function () {
        scope.status = {
          'id': '408',
          'name': 'bdm-access-control.xml',
          'type': 'BDM_ACCESS_CTRL',
          'state': 'INSTALLED',
          'lastUpdatedBy': '4',
          'lastUpdateDate': '2018-01-17T14:28:19.118'
        };
        getUserRequest.resolve({'userName': 'walter.bates'});
        scope.$apply();

        expect(element.find('.glyphicon-ok-circle').length).toBe(1);
        expect(element.find('.glyphicon-ban-circle').length).toBe(0);
        expect(element.find('.glyphicon-cog').length).toBe(0);
        expect(element.find('#displayState')[0].innerHTML).toBe('installed');
        expect(element.find('#lastUpdate')[0].innerHTML).toBe('January 17, 2018 2:28 PM');
        expect(element.find('#updatedBy')[0].innerHTML).toBe('walter.bates');
      });

      it('should be display Technical user on Last update by when id of lastUpdatedBy is -1', function () {
        scope.status = {
          'state': 'INSTALLED',
          'lastUpdatedBy': '-1'
        };
        scope.$apply();

        expect(element.find('#displayState')[0].innerHTML).toBe('installed');
        expect(element.find('#updatedBy')[0].innerHTML).toBe('Technical User');
      });

      it('should show default last updated value when userAPI get failed', function () {
        scope.status = {
          'id': '408',
          'name': 'bdm-access-control.xml',
          'type': 'BDM_ACCESS_CTRL',
          'state': 'INSTALLED',
          'lastUpdatedBy': '4',
          'lastUpdateDate': '2018-01-17T14:28:19.118'
        };
        getUserRequest.reject();
        scope.$apply();

        expect(element.find('.glyphicon-ok-circle').length).toBe(1);
        expect(element.find('.glyphicon-ban-circle').length).toBe(0);
        expect(element.find('.glyphicon-cog').length).toBe(0);
        expect(element.find('#displayState')[0].innerHTML).toBe('installed');
        expect(element.find('#lastUpdate')[0].innerHTML).toBe('January 17, 2018 2:28 PM');
        expect(element.find('#updatedBy')[0].innerHTML).toBe('-');
      });
    });

    describe('Not installed status', function(){

      it('should be display default data when status is not installed', function () {
        scope.status = {
          'id': '0',
          'name': '',
          'type': null,
          'state': null,
          'lastUpdatedBy': '0',
          'lastUpdateDate': '1970-01-01T00:00:00'
        };
        scope.$apply();

        expect(element.find('.glyphicon-ok-circle').length).toBe(0);
        expect(element.find('.glyphicon-ban-circle').length).toBe(1);
        expect(element.find('.glyphicon-cog').length).toBe(0);
        expect(element.find('#displayState')[0].innerHTML).toBe('Not installed');
        expect(element.find('#lastUpdate')[0].innerHTML).toBe('-');
        expect(element.find('#updatedBy')[0].innerHTML).toBe('-');
      });
    });

    describe('Installing status', function(){
      it('should be display default data when status is not installing', function () {
        scope.status = {
          'state': 'INSTALLING'
        };
        scope.$apply();

        expect(element.find('.glyphicon-ok-circle').length).toBe(0);
        expect(element.find('.glyphicon-ban-circle').length).toBe(0);
        expect(element.find('.glyphicon-cog').length).toBe(1);
        expect(element.find('#displayState')[0].innerHTML).toBe('installing');
        expect(element.find('#lastUpdate')[0].innerHTML).toBe('-');
        expect(element.find('#updatedBy')[0].innerHTML).toBe('-');
      });
    });

    it('should be show N/A in state field when data is empty', function () {
      scope.status = null;
      scope.$apply();

      expect(element.find('.glyphicon-ok-circle').length).toBe(0);
      expect(element.find('.glyphicon-ban-circle').length).toBe(1);
      expect(element.find('.glyphicon-cog').length).toBe(0);
      expect(element.find('#lastUpdate')[0].innerHTML).toBe('-');
      expect(element.find('#updatedBy')[0].innerHTML).toBe('-');
      expect(element.find('#displayState')[0].innerHTML).toBe('N/A');
    });
  });
})();
