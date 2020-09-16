import TaskList from './../tasklist.page.js';

(function() {

  'use strict';

  describe('tasklist custom page with localization', function() {

      var tasklist;

      afterEach(function() {
          browser.executeScript('window.localStorage.clear();');
          browser.manage().deleteAllCookies();
          browser.restart();
      });

      it('should be localized', function() {
          tasklist = TaskList.get();
          browser.sleep(500);
          browser.manage().addCookie({name:'BOS_Locale', value:'fr'});
          browser.refresh();
          browser.sleep(500);
          tasklist = TaskList.get();
          browser.sleep(500);
          expect(element(by.css('.TaskFilters #todo-tasks')).getText()).toEqual('A faire');
          expect(element(by.css('#form-tab')).getText()).toEqual('Formulaire');
          expect(element(by.css('#btn-group-assigntome')).getText()).toMatch(/Prendre/i);
      });
  });
})();
