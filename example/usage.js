// usage.js

$(function() {

  Regulate('register', [{
    name: 'username',
    min_length: 6,
    max_length: 18
  }, {
    name: 'email',    
    email: true
  }, {
    name: 'password1',
    min_length: 6,
    max_length: 12
  }, {
    name: 'password2',
    match_field: 'password1'
  }, {
    name: 'newsletters'
  }]);

  Regulate.register.onSubmit(function(error, data) {
    if (error) {
      alert('Validation failed!');
      console.log(error);
    } else {
      alert('Validation passed!');
      console.log(data);
    }
  });
});