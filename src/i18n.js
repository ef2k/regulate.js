/*
  Sample internationalization.
 */

 /*

var pirate = {
  required: function() {
    return '\'Tis field's required';
  },
  min_length: function() {
    return 'A'
  }
}

  Regulate.addLanguage('pirate', pirate);
  Regulate.addLanguage('en', messages)
  Regulate.useLanguage('arabic');

  Regulate('formName', daRules);
  Regulate.formName.onSubmit = function (error, data) {

  };
  */

var Messages_es = {
  required: function (fieldName, fieldReqs, formReqs) {
    var singular = fieldName + ' esta requirido.';
    var plural = fieldName + 'estan requiridos.';
    var last = fieldName.charAt(fieldName.length - 1)
    return fieldName
  },
  min_length: function () {
    return '{fieldName} debe de tener un minimo de {min_length} caracteres.';
  },
  max_length: function (fieldName, fieldReqs) {
    return '{fieldName} debe de tener un maximo de {max_length} caracteres.';
  },
  exact_length: function (fieldName, fieldReqs) {
    return '{fieldName} debe de tener exactamente {1} caracters.';
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