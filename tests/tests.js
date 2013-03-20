// tests.js

describe('Rules',  function () {

  it('should check for the given minimum length', function () {
    expect(Regulate.Rules.min_length('foobar', {min_length:5})).toBe(true);
    expect(Regulate.Rules.min_length('foobar', {min_length:7})).toBe(false);    
  });

  it('should check for the given maximum length', function () {
    expect(Regulate.Rules.max_length('foobar', {max_length:10})).toBe(true);
    expect(Regulate.Rules.max_length('foobar', {max_length:5})).toBe(false);
  });

  it('should check for a correctly formatted email', function () {
    expect(Regulate.Rules.email('foo@bar.com', {email: true})).toBe(true);
    expect(Regulate.Rules.email('foo@bar', {email: true})).toBe(false);    
  });

  it('should check that the value matches a value in another field', function () {
    var rules = {match_field: 'baz'};
    var fields = [{name: 'baz', value: 'foobar'}];
    expect(Regulate.Rules.match_field('foobar', rules, fields)).toBe(true);
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

  it('should validate the given object and report back the results', function () {
    var cbs = {
      validate: function (error, data) {
        // TODO Write spec for handling error/data
      }
    };
      
    spyOn(cbs, 'validate');

    Regulate.jobPost.validate(objData, cbs.validate);
  });
});