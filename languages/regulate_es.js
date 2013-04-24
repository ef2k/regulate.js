(function (Regulate) {
  var es = {
    required: function (fieldName, fieldReqs) {
      var singular = fieldName + ' esta requerido.';
      var plural = fieldName + ' estan requeridos.';
      var last = fieldName.charAt(fieldName.length - 1);
      return (last === 's') ? plural : singular;
    },

    email: function (fieldName, fieldReqs) {
      return fieldName + " debe ser valido.";
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

  Regulate.addTranslation('es', es);
}(Regulate));