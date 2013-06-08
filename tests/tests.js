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

  it('should check for a maximum file size', function () {
    var successReqs = {name: 'file', max_size: 1000};
    var failReqs = {name: 'file', max_size: 500};
    expect(Regulate.Rules.max_size(700, successReqs)).toBe(true);
    expect(Regulate.Rules.max_selected(700, failReqs)).toBe(false);
  });

  it('should check for correct file type', function () {
    var successReqs = {name: 'file', accepted_files: 'jpeg|gif|png'};
    var failReqs = {name: 'file', accepted_files: 'markdown'};
    var fields = [{name: 'file', value: 1000, fileType: 'image/jpeg'}];
    expect(Regulate.Rules.accepted_files(1000, successReqs, fields)).toBe(true);
    expect(Regulate.Rules.accepted_files(1000, failReqs, fields)).toBe(false);
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

  Regulate('allRequired', [
    {name: 'f1'},
    {name: 'f2'},
    {name: 'f3'},
    {name: 'f4'},
    {name: 'f5'},
    {name: 'f6'}
  ]);

  var nonTruthyData = [
    {name: 'f1', value: 0},
    {name: 'f2', value: null},
    {name: 'f3', value: false},
    {name: 'f4', value: undefined},
    {name: 'f5', value: ''},
    {name: 'f6', value: NaN}
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
    var spyCb = jasmine.createSpy();
    objData[3].value = "unmatched@email.com";
    Regulate.jobPost.validate(objData, spyCb);
    expect(spyCb).toHaveBeenCalled();
    objData[3].value = "foo@bar.com";
  });

  it ('should invalidate all fields that do not have truthy values', function () {
    var spyCb = jasmine.createSpy();
    Regulate.allRequired.validate(nonTruthyData, spyCb);
    var mockError = {
      f1: ["f1 is required."],
      f2: ["f2 is required."],
      f3: ["f3 is required."],
      f4: ["f4 is required."],
      f5: ["f5 is required."],
      f6: ["f6 is required."],
    };
    expect(spyCb).toHaveBeenCalledWith(mockError, null);
  });
});