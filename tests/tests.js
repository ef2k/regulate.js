// tests.js

/*global jasmine */
/*global it */
/*global describe */
/*global expect */
/*global Regulate*/

describe('Rules',  function () {

  it('should check for the given minimum length', function () {
    expect(Regulate.Rules.min_length('foobar', {min_length:5})).toBe(true);
    expect(Regulate.Rules.min_length('foobar', {min_length:7})).toBe(false);
  });

  it('should check for the given maximum length', function () {
    expect(Regulate.Rules.max_length('foobar', {max_length:10})).toBe(true);
    expect(Regulate.Rules.max_length('foobar', {max_length:5})).toBe(false);
  });

  it('should check for the exact length', function () {
    expect(Regulate.Rules.exact_length('foobar', {exact_length:6})).toBe(true);
    expect(Regulate.Rules.exact_length('foobar', {exact_length:5})).toBe(false);
  });

  it('should check for a correctly formatted email', function () {
    expect(Regulate.Rules.email('foo@bar.com', {email: true})).toBe(true);
    expect(Regulate.Rules.email('foo@bar', {email: true})).toBe(false);
  });

  it('should check that the value matches a value in another field', function () {
    var successReqs = {match_field: 'baz'};
    var failReqs = {match_field: 'zab'};
    var fields = [{name: 'baz', value: 'foobar'}];

    expect(Regulate.Rules.match_field('foobar', successReqs, fields)).toBe(true);
    expect(Regulate.Rules.match_field('foobar', failReqs, fields)).toBe(false);
  });

  it('should check for the minimum number of marked checkboxes', function () {
    var successReqs = {name: 'cbs', min_checked: 2};
    var failReqs = {name: 'cbs', min_checked: 3};
    var fields = [{name: 'cbs', value: 'foo'}, {name: 'cbs', value: 'boo'}];

    expect(Regulate.Rules.min_checked(null, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.min_checked(null, failReqs, fields)).toBe(false);
  });

  it('should check for the exact number of marked checkboxes', function () {
    var successReqs = {name: 'cbs', exact_checked: 2};
    var failReqs = {name: 'cbs', exact_checked: 1};
    var fields = [{name: 'cbs', value: 'foo'}, {name: 'cbs', value: 'boo'}];

    expect(Regulate.Rules.exact_checked(null, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.exact_checked(null, failReqs, fields)).toBe(false);
  });

  it('should check for the maximum number of marked checkboxes', function () {
    var successReqs = {name: 'cbs', max_checked: 2};
    var failReqs = {name: 'cbs', max_checked: 1};
    var fields = [{name: 'cbs', value: 'foo'}, {name: 'cbs', value: 'boo'}];

    expect(Regulate.Rules.max_checked(null, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.max_checked(null, failReqs, fields)).toBe(false);
  });

  it('should check for the minimum number of options selected', function () {
    var successReqs = {name: 'sel', min_selected: 1};
    var failReqs = {name: 'sel', min_selected: 3};
    var fields = [{name: 'sel', value: 'foo'}, {name: 'sel', value: 'boo'}];

    expect(Regulate.Rules.min_selected(null, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.min_selected(null, failReqs, fields)).toBe(false);
  });

  it('should check for the exact number of options selected', function () {
    var successReqs = {name: 'sel', exact_selected: 2};
    var failReqs = {name: 'sel', exact_selected: 3};
    var fields = [{name: 'sel', value: 'foo'}, {name: 'sel', value: 'boo'}];

    expect(Regulate.Rules.exact_selected(null, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.exact_selected(null, failReqs, fields)).toBe(false);
  });

  it('should check for the maximum number of options selected', function () {
    var successReqs = {name: 'sel', max_selected: 3};
    var failReqs = {name: 'sel', max_selected: 1};
    var fields = [{name: 'sel', value: 'foo'}, {name: 'sel', value: 'boo'}];

    expect(Regulate.Rules.max_selected(null, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.max_selected(null, failReqs, fields)).toBe(false);
  });
});

describe('Regulate', function () {
  Regulate('jobPost', [
    {
      name: 'title',
      max_length: 50
    },
    {
      name: 'company',
      min_length: 1
    },
    {
      name: 'email1',
      match_field: 'email2'
    },
    {
      name: 'email2'
    }
  ]);

  var objData = [
    {name: 'title', value: 'This is the Title of The Job Post'},
    {name: 'company', value: 'FooBar Inc.'},
    {name: 'email1', value: 'foo@bar.com'},
    {name: 'email2', value: 'foo@bar.com'}
  ];

  it('should namespace my regulate object as a property of itself', function () {
    expect(Regulate.jobPost).toBeDefined();
  });

  it('should validate the given object and callback with the data', function () {
    var spyCb = jasmine.createSpy();
    Regulate.jobPost.validate(objData, spyCb);
    expect(spyCb).toHaveBeenCalledWith(null, objData);
  });

  it('should invalidate the given object and callback with an error', function () {
    var spyCb2 = jasmine.createSpy();
    objData[3].value = "unmatched@email.com";
    Regulate.jobPost.validate(objData, spyCb2);
    expect(spyCb2).toHaveBeenCalledWith({email1: ['match_field']}, null);
    objData[3].value = "foo@bar.com";
  });
});