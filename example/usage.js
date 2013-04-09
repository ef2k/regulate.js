// usage.js

/*global Regulate */

var Messages_es = {
  required: function (fieldName, fieldReqs, formReqs) {
    var singular = fieldName + ' esta requerido.';
    var plural = fieldName + ' estan requeridos.';
    var last = fieldName.charAt(fieldName.length - 1);
    return (last === 's') ? plural : singular;
  },

  min_length: function (fieldName, fieldReqs, formReqs) {
    return fieldName + ' debe tener un mínimo de ' + fieldReqs.min_length + ' caracteres.';
  },
  max_length: function (fieldName, fieldReqs) {
    return fieldName + ' debe tener un máximo de ' + fieldReqs.max_length + ' caracteres.';
  },

  exact_length: function (fieldName, fieldReqs) {
    var exactLength = fieldReqs.exact_length;
    return fieldName + ' debe tener exactamente ' + exactLength + ' caracteres.';
  },

  min_checked: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.min_checked;
    message = "Chequa por lo menos " + reqValue + " checkbox";
    message += (reqValue !== 1) ? "es" : ".";
    return message;
  },

  max_checked: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.max_checked;
    message = "Check a maximum of " + reqValue + " checkbox";
    message += (reqValue !== 1) ? "es" : ".";
    return message;
  },

  exact_checked: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.exact_checked;
    message = "Check exactly " + reqValue + " checkbox";
    message += (reqValue !== 1) ? "es" : ".";
    return message;
  },

  min_selected: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.min_selected;
    message = "Select atleast " + reqValue + " option";
    message += (reqValue !== 1) ? "s" : ".";
    return message;
  },

  max_selected: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.max_selected;
    message = "Select a maximum of " + reqValue + " option";
    message += (reqValue !== 1) ? "s" : ".";
    return message;
  },

  exact_selected: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.exact_selected;
    message = "Select exactly " + reqValue + " option";
    message += (reqValue !== 1) ? "s" : ".";
    return message;
  }
};

$(function() {
  Regulate.addTranslation('es', Messages_es);
  Regulate.useTranslation('es');

  Regulate('sampleForm',
  [{
    name: 'username',
    min_length: 6,
    max_length: 18,
    display_as: 'Username',
    display_error: '#username-error'
  }, {
    name: 'email',
    email: true,
    display_as: 'Email',
    display_error: '#email-error'
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
    display_error: '#multivalues-error',
    display_as: 'Multiselect'
  }]);

  Regulate.sampleForm.onSubmit(function(error, data) {
    if (error) {
      console.error('Validation failed.');
      console.log("These are the errors");
    } else {
      console.log('Validation passed');
    }
  });
});