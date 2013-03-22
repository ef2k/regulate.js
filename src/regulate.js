// regulate.js

(function (W, _, $, undefined) {

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
    },
    
    match_field: function(str, rules, fields, foobar) {
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
    }
  };


  var Form = function (name, formRules) {    
    var self = this;
    self.name = name;
    self.rules = self._transformRules(formRules);
    self.cbs = [];
  };

  Form.prototype._notifySubmission = function (error, data) {
    var self = this;
    _.each(self.cbs, function (cb) {
      cb(error, data);
    });
  }

  Form.prototype.validate = function (formFields, cb) {
    var self = this;
    var errors = {};

    if (cb) {
      self.cbs.push(cb);
    }

    _.each(formFields, function (formField) {
      var fieldName = formField.name;
      var fieldErrors = [];

      if (!fieldName) return;

      var fieldRules = self.rules[fieldName];

      for (var ruleName in fieldRules) {
        if (fieldRules.hasOwnProperty(ruleName) && ruleName in Rules) {
          var ruleTest = Rules[ruleName];
          var testPassed = ruleTest(formField.value, fieldRules, formFields);
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

  Form.prototype._addCb = function (cb) {
    var self = this;
    self.cbs.push(cb);
  };

  Form.prototype.onSubmit = function (cb) {
    var self = this;
    self._addCb(cb);

    $(document).on('submit', ('#'+self.name), function (e) {
      console.log('submit was clicked!');
      e.preventDefault();
      var formFields = $(this).serializeArray();
      self.validate(formFields);
    });    
  };

  var Regulate = function (name, formRules) {
    Regulate[name] = new Form(name, formRules);
    Regulate.Rules = Rules;
  };

  Regulate.registerRule = function (ruleName, testFn) {
    Rules[ruleName] = testFn;
  };

  W.Regulate = Regulate;

})(window, _, jQuery);