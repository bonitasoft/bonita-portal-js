describe('Directive: bootstrapFormControl', function () {
  'use strict';

  var $compile, scope;

  beforeEach(module('com.bonita.common.directives.bootstrap-form-control'));

  beforeEach(inject(function (_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();

    scope.fooForm = {
      $name: 'fooForm',
      bar: {
        $invalid: false,
        $dirty: false
      }
    };
  }));

  it('should wrap input a form-control div', function () {
    var dom = $compile('<bootstrap-form-control label="foo"><input id="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.find('input').closest('div').hasClass('form-group')).toBe(true);
  });

  it('should add form-control style to the input', function () {
    var dom = $compile('<bootstrap-form-control label="foo"><input id="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.find('input').hasClass('form-control')).toBe(true);
  });

  it('should add a label to the field', function () {
    var dom = $compile('<bootstrap-form-control label="foo"><input id="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.find('label').text()).toBe('foo');
  });

  it('should set the label \'for\' attribute to input id', function () {
    var dom = $compile('<bootstrap-form-control label="foo"><input id="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.find('label').attr('for')).toBe('bar');
  });

  it('should add mandatory symbol when the field is required', function () {
    var dom = $compile('<bootstrap-form-control label="foo"><input id="bar" type="text" required/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.find('span').text()).toBe(' *');
  });

  it('should not have the error style when field is still pristine', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm" errors="{ $invalid: \'foobar\' }"><input name="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.hasClass('has-error')).toBe(false);
  });

  it('should not have the error style when not configured', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm"><input name="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    expect(dom.hasClass('has-error')).toBe(false);
  });

  it('should not have the error style when field is still pristine even though the field is invalid', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm" errors="{ $invalid: \'foobar\' }"><input name="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    scope.fooForm.bar.$invalid = true;
    scope.$apply();

    expect(dom.hasClass('has-error')).toBe(false);
  });

  it('should add the error style when field is dirty & invalid', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm" errors="{ $invalid: \'foobar\' }"><input name="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    scope.fooForm.bar.$dirty = true;
    scope.fooForm.bar.$invalid = true;
    scope.$apply();

    expect(dom.hasClass('has-error')).toBe(true);
  });

  it('should not show the error message when field is valid', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm" errors="{ $invalid: \'foobar\' }"><input name="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    scope.fooForm.bar.$invalid = false;
    scope.$apply();

    expect(dom.find('.help-block').hasClass('ng-hide')).toBe(true);
  });

  it('should show the error message when field is dirty & invalid', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm" errors="{ $invalid: \'foobar\' }"><input name="bar" type="text"/></bootstrap-form-control>')(scope);
    scope.$apply();

    scope.fooForm.bar.$dirty = true;
    scope.fooForm.bar.$invalid = true;
    scope.$apply();

    expect(dom.find('.help-block').text()).toBe('foobar');
    expect(dom.find('.help-block').hasClass('ng-hide')).toBe(false);
  });

  it('should watch all configured errors', function () {
    var dom = $compile('<bootstrap-form-control form="fooForm" errors="{ mandatory: \'Mandatory error message\', duplicate: \'Duplicate error message\'}"><input name="bar" type="text"/></bootstrap-form-control>')(scope);

    scope.fooForm.bar.$dirty = true;
    scope.fooForm.bar.duplicate = true;
    scope.$apply();

    expect(dom.find('.help-block').text()).toBe('Duplicate error message');
  });
});
