(function() {
  'use strict';

  describe('comment service', function() {

    var commentsService, $httpBackend;

    var systemComment =  {
      'processInstanceId': '123',
      'postDate': '2016-03-08 11:36:48.048',
      'id': '40001',
      'userId': {'icon': '/default/icon_user.png', 'userName': 'System'},
      'content': 'The task \'Étape1\' is now assigned to walter.bates'
    };

    var humanComment = {
      'processInstanceId': '123',
      'postDate': '2016-03-08 15:06:57.767',
      'id': '60001',
      'userId': {
        'firstname': 'Walter',
        'lastname': 'Bates',
        'icon': '/default/icon_user.png',
        'creation_date': '2016-01-25 08:20:32.860',
        'userName': 'walter.bates',
        'id': '4'
      },
      'content': 'Here is a comment'
    };

    var humanComment2 =
       {
        'processInstanceId': '123',
        'tenantId': '1',
        'postDate': '2016-03-08 15:07:04.391',
        'id': '60002',
        'userId': {
          'firstname': 'Walter',
          'lastname': 'Bates',
          'icon': '/default/icon_user.png',
          'userName': 'walter.bates',
          'id': '4'
        },
        'content': 'This is another comment'
      };

    var aComment = {'processInstanceId': '1002', 'tenantId': '1', 'postDate': '2016-03-08 16:49:45.768', 'id': '60004', 'userId': '4', 'content': 'coucou'};

    beforeEach(module('org.bonitasoft.features.user.tasks.list.comments'));

    beforeEach(inject(function(_$httpBackend_, _commentsService_) {
      $httpBackend = _$httpBackend_;

      commentsService = _commentsService_;
    }));

    it('should get human comments for a given case', function() {
      $httpBackend.expectGET('../API/bpm/comment?c=2147483647&d=userId&f=processInstanceId%3D123&o=postDate+ASC&p=0').respond([humanComment, humanComment2, systemComment]);

      commentsService.getHumanCommentsForCase(123).then(function(data) {
        expect(data).not.toContain(systemComment);
        expect(data).toContain(humanComment);
        expect(data).toContain(humanComment2);
      });

      $httpBackend.flush();
    });

    it('should get archived human comments for a given case', function() {
      $httpBackend.expectGET('../API/bpm/archivedComment?c=2147483647&d=userId&f=processInstanceId%3D123&o=postDate+ASC&p=0').respond([humanComment, humanComment2, systemComment]);

      commentsService.getArchivedHumanCommentsForCase(123).then(function(data) {
        expect(data).not.toContain(systemComment);
        expect(data).toContain(humanComment);
        expect(data).toContain(humanComment2);
      });

      $httpBackend.flush();
    });

    it('should add a comment for given case and author', function() {
      $httpBackend.expectPOST('../API/bpm/comment', {userId: 4, processInstanceId: 1002, content: 'coucou'}).respond(aComment);

      commentsService.add(4, 1002, 'coucou').then(function(data) {
        expect(data).toEqual(jasmine.objectContaining(aComment));
      });

      $httpBackend.flush();
    });
  });

})();
