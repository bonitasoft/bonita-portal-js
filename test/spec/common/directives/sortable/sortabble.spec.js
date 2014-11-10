'use strict';

describe('sortable directive', function(){
  var element;
  var scope;
  var $timeout;

  var click = function (el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(
        'click',
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
  };

  beforeEach(module('bonitable'));
  beforeEach(module('bonita.sortable'));
  beforeEach(module('bonita.templates'));

  beforeEach(inject(function($rootScope, $compile, $httpBackend, _$timeout_) {
    scope = $rootScope.$new();
    $timeout =  _$timeout_;

    $httpBackend.whenGET(/^template/).respond('');

    var markup =
        '<table>'+
        '  <thead>'+
        '    <tr>'+
        '       <th bo-sorter="id" sort-options="sortOptions" on-sort="onSortFunction(options)">ID</th>'+
        '       <th bo-sorter="name" sort-options="sortOptions" on-sort="onSortFunction(options)">Name</th>'+
        '    </tr>'+
        '  </thead>'+
        '</table>';

    scope.sortOptions = {
      ascendant:true,
      property:'name'
    };

    scope.onSort = function(){};
    spyOn(scope, 'onSort');
    scope.onSortFunction = function(){
      return scope.onSort;
    };
    element = $compile(markup)(scope);
    scope.$digest();
  }));


  it('should create clickable columns header', function(){
    var headers = element.find('th');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent.trim()).toBe('ID');
    expect(headers[1].textContent.trim()).toBe('Name');
  });

  describe('sortIcon', function() {
    it('should reflect sort direction', function(){
      var icon = element.find('.glyphicon').get(1);
      expect(icon.classList.contains('glyphicon-chevron-up')).toBe(true);
      scope.sortOptions.ascendant =  false;
      scope.$digest();
      expect(icon.classList.contains('glyphicon-chevron-down')).toBe(true);
    });
  });

  describe('sorter', function() {
    it('should trigger onSort when click', function(){
      var idHeader = element.find('[ng-transclude]');
      click(idHeader.get(0));
      expect(scope.onSort).toHaveBeenCalledWith({property:'id', ascendant:true});
    });

    it('should reverse order if active th is clicked', function(){
      var nameHeader = element.find('[ng-transclude]')[1];
      expect(scope.sortOptions).toEqual({property:'name', ascendant:true});
      click(nameHeader);
      expect(scope.sortOptions).toEqual({property:'name', ascendant:false});
      expect(scope.onSort).toHaveBeenCalledWith({property:'name', ascendant:false});
    });
  });

  describe('icon class', function(){
    it('should reflect initial sortOption', function(){
      var button = element.find('[ng-transclude]');
      expect(button.get(1).textContent.trim()).toEqual('Name');
    });

    it('should reflect sortOption when reverse order', function(){
      var button = element.find('[ng-transclude]')[1];

      click(button);
      expect(scope.sortOptions.ascendant).toBe(false);
    });
  });

});
