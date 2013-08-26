// usage.js

/*global Regulate, $ */

$(function () {

  // Register the form and its requirements.
  Regulate('sampleForm',
  [{
    name: 'username',
    min_length: 6,
    max_length: 18,
    display_as: 'Username',
    display_error: '#username-error',
    unique: true,
    error: {
      required: "The username is required.",
      min_length: "The minimum length is 6 characters.",
      max_length: "The maximum length is 18 characters. Use a shorter username."
    }
  }, {
    name: 'email',
    email: true,
    display_as: 'Email',
    display_error: '#email-error',
    error: "Enter a valid email address"
  }, {
    name: 'password1',
    min_length: 6,
    max_length: 12,
    display_as: 'Password',
    display_error: '#password1-error'
  }, {
    name: 'password2',
    match_field: 'password1',
    display_as: 'Confirmation',
    display_error: '#password2-error'
  }, {
    name: 'newsletters',
    min_checked: 1,
    max_checked: 2,
    display_as: 'Newspapers',
    display_error: '#newsletters-error'
  }, {
    name: 'multivalues',
    exact_selected: 2,
    display_as: 'Multiselect',
    display_error: '#multivalues-error',
  }, {
    name: 'profileImage',
    max_size: 1024 * 1024,
    accepted_files: 'jpeg|png|gif',
    display_as: 'Profile image',
    display_error: '#profileImage-error'
  }, {
    name: 'readmeFile',
    max_size: 1024 * 100,
    accepted_files: 'text|markdown|pdf',
    display_as: 'Readme file',
    display_error: '#readmeFile-error'
  }]);

  
  // Create a custom rule that checks for uniqueness.
  Regulate.registerRule('unique', function (fieldValue) {
    var taken = 'administrator';
    return fieldValue !== taken;
  });

  // Assign an error message to the unique rule.
  Regulate.registerMessage('unique', function (fieldName) {
    return fieldName + " is already taken.";
  });

  // Add a translated version of this form's display_as fields.
  Regulate.sampleForm.addTranslations({
    es: {
      username: 'Nombre de usuario',
      email: 'Correo electrónico',
      password1: 'Clave',
      password2: 'Confirmacion',
      newsletters: 'Periódicos',
      multivalues: 'Multivalores'
    }
  });

  // Register a handler for the onSubmit event of the form.
  Regulate.sampleForm.onSubmit(function (error, data) {
    if (error) {
      console.error('Validation failed.', error);
    } else {
      console.log('Validation passed.', data);
      alert("Success!");
    }
  });
});