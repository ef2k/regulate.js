// usage.js

/*global Regulate */

$(function() {

  // Regulate('sampleForm',
  // [{
  //   name: 'username',
  //   min_length: 6,
  //   max_length: 18,
  //   display_as: 'Username',
  //   display_error: '#username-error'
  // }, {
  //   name: 'email',
  //   email: true,
  //   display_as: 'Email',
  //   display_error: '#email-error'
  // }, {
  //   name: 'password1',
  //   min_length: 6,
  //   max_length: 12,
  //   display_as: 'Password',
  //   display_error: '#password1-error'
  // }, {
  //   name: 'password2',
  //   match_field: 'password1',
  //   display_as: 'Confirmation',
  //   display_error: '#password2-error'
  // }, {
  //   name: 'newsletters',
  //   min_checked: 1,
  //   max_checked: 2,
  //   display_as: 'Newspapers',
  //   display_error: '#newsletters-error'
  // }, {
  //   name: 'multivalues',
  //   exact_selected: 2,
  //   display_error: '#multivalues-error',
  //   display_as: 'Multiselect'
  // }]);

  Regulate('sampleForm',
  [{
    name: 'username',
    min_length: 6,
    max_length: 18,
    display_error: '#username-error'
  }, {
    name: 'email',
    email: true,
    display_error: '#email-error'
  }, {
    name: 'password1',
    min_length: 6,
    max_length: 12,
    display_error: '#password1-error'
  }, {
    name: 'password2',
    match_field: 'password1',
    display_error: '#password2-error'
  }, {
    name: 'newsletters',
    min_checked: 1,
    max_checked: 2,
    display_error: '#newsletters-error'
  }, {
    name: 'multivalues',
    exact_selected: 2,
    display_error: '#multivalues-error',
    display_as: 'Multiselect'
  }]);

  Regulate.sampleForm.addTranslations({
    en: {
      username: 'Username',
      email: 'Email',
      password1: 'Password',
      password2: 'Confirmation',
      newsletters: 'Newspapers',
      multivalues: 'multivalues'
    },
    es: {
      username: 'Nombre de usuario',
      email: 'Correo electrónico',
      password1: 'Clave',
      password2: 'Confirmacion',
      newsletters: 'Periódicos',
      multivalues: 'Multivalores'
    }
  });

  Regulate.sampleForm.onSubmit(function (error, data) {
    if (error) {
      console.error('Validation failed.');
    } else {
      console.log('Validation passed');
    }
  });
});