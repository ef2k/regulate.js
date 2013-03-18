// Regulate.js

(function (W, H, _, $, undefined) {

  var Rules = {
    max_length: function (str, rule) {      
      return rule.max_length ? (str.length <= rule.max_length) : false;
    },

    min_length: function (str, rule) {
      return rule.min_length ? (str.length >= rule.min_length) : false;
    },

    email: function (str) {
      var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return re.test(str);
    }    
  };

  var Form = function (name, formRules) {
    var self = this;
    self.rules = self._transformRules(formRules);
    self.cbs = [];

    $(W.document).on('submit', '#'+name, function (e) {
      e.preventDefault();
      var formFields = $(this).serializeArray();
      self._validate(formFields);
    });
  };

  Form.prototype._notifySubmission = function (error, data) {
    var self = this;
    _.each(self.cbs, function (cb) {
      cb(error, data);
    });
  }

  Form.prototype._validate = function (formFields) {
    var self = this;
    var errors = {};

    _.each(formFields, function (formField) {
      var fieldName = formField.name;
      var fieldErrors = [];

      if (!fieldName) return;

      var fieldRules = self.rules[fieldName];

      for (var ruleName in fieldRules) {
        if (fieldRules.hasOwnProperty(ruleName) && ruleName in Rules) {
          var ruleTest = Rules[ruleName];
          var testPassed = ruleTest(formField.value, fieldRules);
          if (!testPassed) {
            fieldErrors.push(ruleName);
          }
        }
      }
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
      }
    });

    if (_.isEmpty(errors)) {
      self._notifySubmission(null, formFields);
    } else {
      self._notifySubmission(errors, null);      
    }
  };

  Form.prototype._transformRules = function (userStyleRules) {
    var self = this;
    var rules = {};
    _.each(userStyleRules, function (userRule) {      
      var fieldRule = {};
      for (var p in userRule) {
        if (userRule.hasOwnProperty(p) && p !== 'name') {
          fieldRule[p] = userRule[p];
        }        
      }
      if (userRule.name) {
        rules[userRule.name] = fieldRule;
      }
    });    
    return rules;
  };

  Form.prototype.onSubmission = function(cb) {
    this.cbs.push(cb);
  };

  var Regulate = function (name, formRules) {
    Regulate[name] = new Form(name, formRules);
  };

  W.Regulate = Regulate;

})(window, Handlebars, _, jQuery);