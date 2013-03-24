// regulate.js

(function (W, _, $, undefined) {

  /*
   * @private 
   * Object containing all validation rules.
   */
  var Rules = {
    max_length: function (str, rule) {   
      return rule.max_length ? (str.length <= rule.max_length) : false;
    },

    min_length: function (str, rule) {
      return rule.min_length ? (str.length >= rule.min_length) : false;
    },

    exact_length: function (str, rule) {
      return rule.exact_length ? (str.length === rule.exact_length) : false;
    },    

    email: function (str) {
      var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return re.test(str);
    },
    
    match_field: function(str, rules, fields) {
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
    },

    min_checked: function(none, rules, fields) {
      console.log('Min checked called!');
      if (!'min_checked' in rules) return false;

      console.log('fields: ', fields);

      var cbs = _.filter(fields, function(field) {        
        return field.name === rules.name;
      }); 
      console.log("checkboxes", cbs.length);
      return cbs.length >= rules.min_checked;
    }
  };

  /*
   * @private
   * @constructor
   * Represents a form with validation requirements.
   */
  var Form = function (name, formRules) {    
    var self = this;
    self.name = name;
    self.rules = self._transformRules(formRules);
    self.cbs = [];
  };

  /* 
   * @private
   * Calls all registered callbacks.
   */
  Form.prototype._notifySubmission = function (error, data) {
    var self = this;
    _.each(self.cbs, function (cb) {
      cb(error, data);
    });
  };

  /*
   * @public
   * Applies the validation rules on the given array (formFields) and 
   * calls back (cb) with `error` and `data` arguments.
   * 
   * @param formFields - Array - [{name: fieldName, value: fieldValue}]
   * @param cb - Function - The callback to be called after validation.
   *    @argument error
   *    @agument data
   */
  Form.prototype.validate = function (formFields, cb) {
    var self = this;
    var errors = {};

    if (cb) {
      self.cbs.push(cb);
    }

    // What to do when checkboxes are not checked and as such, are not included in the formFields?
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


  /* 
   * @private
   * Transforms the user defined rules into a data structure that's easier to 
   * work with.
   */
  Form.prototype._transformRules = function (userStyleRules) {
    var self = this;
    var rules = {};
    _.each(userStyleRules, function (userRule) {
      var fieldRule = {};
      for (var p in userRule) {
        if (userRule.hasOwnProperty(p)) {
          fieldRule[p] = userRule[p];
        }        
      }
      if (userRule.name) {
        rules[userRule.name] = fieldRule;
      }
    });    
    return rules;
  };

  /*
   * @private
   * Adds a callback to be called after validation.
   * @param cb - Function - callback.
   */
  Form.prototype._addCb = function (cb) {
    var self = this;
    self.cbs.push(cb);
  };

  /*
   * @public
   * Registers a callback to be called after form submission and its validation.
   * @param cb - Function - The callback to be called with validation results.
   *    @argument error
   *    @agument data
   */
  Form.prototype.onSubmit = function (cb) {
    var self = this;
    self._addCb(cb);

    $(W.document).on('submit', ('#'+self.name), function (e) {
      e.preventDefault();
      var formData = $(this).serializeArray();    
      self.validate(formData);
    });    
  };

  /*
   * @public
   * Creates a form with validation requirements. Exposes the form as a 
   * property namespaced by the Regulate object (ie: Regulate.<name of form>).
   * @param name - String - The name of the form to be validated.
   * @param formRules - Array - The required rules for validation.
   */
  var Regulate = function (name, formRules) {
    Regulate[name] = new Form(name, formRules);
    Regulate.Rules = Rules;
  };

  /*
   * @public
   * Registers an user defined rule.
   * @param ruleName - String - The name of the rule.
   * @param testFn - Function - The function to be executed during validation.
   *    @return A boolean value that represents the validation result.
   */
  Regulate.registerRule = function (ruleName, testFn) {
    if (ruleName in Rules) {
      throw new Error(ruleName + " is already defined as a rule.");
    }
    Rules[ruleName] = testFn;
  };

  W.Regulate = Regulate;

})(window, _, jQuery);