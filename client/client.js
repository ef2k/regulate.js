Template.jobform.rendered = function () {

  Regulate.registerRule('starts_with', function(str, rules) {
    if ('starts_with' in rules) {
      return str[0] === rules.starts_with;
    } else {
      return false;
    }
  });

  Regulate.registerRule('match_field', function(str, rules, fields) {
    var result = false;
    if ('match_field' in rules) {  
      var targetField = rules.match_field;
      _.each(fields, function (field) {
        if (field.name === targetField) {
          result = field.value === str;
        }        
      });
    }
    return result;
  });

  Regulate('jobform', [{
      name: 'jobtitle',
      max_length: 20,
      min_length: 5,
      starts_with: 'a',
      match_field: 'jobemail'
    }, 
    {
      name: 'jobemail',
      email: true
    }
  ]);

  Regulate.jobform.onSubmission(function(error, data) {
    if (error) {
      console.error('The form didnt validate, this are the errors: ', error);
    } else {
      console.log('Validation passed, this is the data: ', data);
    }
  });
};
