(() => {
  'use strict';

  describe('comments directive', ()=> {

    var element, scope;

    beforeEach(module('org.bonitasoft.features.user.tasks.list.comments', 'org.bonitasoft.portalTemplates'));

    beforeEach(inject(($compile, $rootScope, $httpBackend) => {
      scope = $rootScope.$new();
      scope.currentCase = { id: 2 };

      $httpBackend.whenGET('../API/bpm/comment?c=2147483647&d=userId&f=processInstanceId%3D2&o=postDate+ASC&p=0').respond(
        [{ content: 'comment 1' }, { content: 'comment 2' }]
      );

      element = $compile('<comments case="currentCase"></comments>')(scope);
      scope.$apply();
    }));

    it('should not allow to add an empty comment', () => {
      element.find('textarea').val('').trigger('input');
      scope.$apply();

      expect(element.find('button[type=submit]').attr('disabled')).toEqual('disabled');
      expect(element.find('div.form-group').hasClass('has-error')).toBeFalsy(); // no error class for required
    });

    it('should not allow to add a comment greater than 255 chars', () => {
      let tooLongComment =
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sagittis sodales ipsum,
        in imperdiet enim viverra id. Ut facilisis neque at augue rutrum, pretium auctor metus auctor.
        Ut eu ornare nisi, et consectetur nulla. Phasellus tristique volutpat. it sit amet`;

      element.find('textarea').val(tooLongComment).trigger('input');
      scope.$apply();

      expect(element.find('button[type=submit]').attr('disabled')).toEqual('disabled');
      expect(element.find('div.form-group').hasClass('has-error')).toBeTruthy();
    });
  });
})();
