// usage.js

/*global Regulate */

var Messages_es = {
  required: function (fieldName, fieldReqs) {
    var singular = fieldName + ' esta requerido.';
    var plural = fieldName + ' estan requeridos.';
    var last = fieldName.charAt(fieldName.length - 1);
    return (last === 's') ? plural : singular;
  },

  email: function (fieldName, fieldReqs) {
    return fieldName + " debe ser un correo valido.";
  },

  match_field: function (fieldName, fieldReqs, formReqs) {
    var matchName, displayName, matchField;
    matchField = fieldReqs.match_field;
    matchName = formReqs[matchField].display_as || matchField;
    displayName = fieldReqs.display_as || fieldReqs.name;
    return displayName + " debe coincidir con " + matchName;
  },

  min_length: function (fieldName, fieldReqs) {
    return fieldName + ' debe tener un mínimo de ' + fieldReqs.min_length + ' caracteres.';
  },
  max_length: function (fieldName, fieldReqs) {
    return fieldName + ' debe tener un máximo de ' + fieldReqs.max_length + ' caracteres.';
  },

  exact_length: function (fieldName, fieldReqs) {
    var exactLength = fieldReqs.exact_length;
    return fieldName + ' debe tener ' + exactLength + ' caracteres.';
  },

  min_checked: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.min_checked;
    singular = "Marque al menos " + reqValue + " casilla";
    message += (reqValue !== 1) ? "s" : ".";
    return message;
  },

  max_checked: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.max_checked;
    message = "Marque un máximo de " + reqValue + " casilla";
    message += (reqValue !== 1) ? "s" : ".";
    return message;
  },

  exact_checked: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.exact_checked;
    message = "Marque " + reqValue + " casilla";
    message += (reqValue !== 1) ? "s" : ".";
    return message;
  },

  min_selected: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.min_selected;
    message = "Seleccione al menos " + reqValue + " opcion";
    message += (reqValue !== 1) ? "es" : ".";
    return message;
  },

  max_selected: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.max_selected;
    message = "Seleccione un maximo de " + reqValue + " opcion";
    message += (reqValue !== 1) ? "es" : ".";
    return message;
  },

  exact_selected: function (fieldName, fieldReqs) {
    var reqValue, message;
    reqValue = fieldReqs.exact_selected;
    message = "Seleccione " + reqValue + " opcion";
    message += (reqValue !== 1) ? "es" : ".";
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

  Regulate.sampleForm.addTranslation('es', {
    username: 'Nombre de Usuario',
    email: 'Email',
    password1: 'Clave',
    password2: 'Confirmacion',
    newsletters: 'Periodicos',
    multivalues: 'MultiValores'
  });

  Regulate.sampleForm.onSubmit(function(error, data) {
    if (error) {
      console.error('Validation failed.');
      console.log("These are the errors");
    } else {
      console.log('Validation passed');
    }
  });
});