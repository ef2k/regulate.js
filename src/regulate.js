/*
 * Regulate.js
 * http://github.com/eddflrs/regulate.js
 * @author Eddie Flores
 * @license MIT License
 */

/*jslint indent: 2 */
/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global _ */
/*global jQuery */

(function (W, _, $) {
  "use strict";

  var Rules, Form, Regulate;

  /*
   * @private 
   * The object containing all validation rules.
   */
  Rules = {
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

    match_field: function (str, rules, fields) {
      var targetField, result = false;
      if (rules.match_field) {
        targetField = rules.match_field;
        _.each(fields, function (field) {
          if (field.name === targetField) {
            result = field.value === str;
          }
        });
      }
      return result;
    },

    min_checked: function (none, rules, fields) {
      if (!rules.min_checked) {
        return false;
      }

      console.log('fields: ', fields);

      var cbs = _.filter(fields, function (field) {
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
  Form = function (name, formRules) {
    var self = this;
    self.name = name;
    self.rules = self.transformRules(formRules);
    self.cbs = [];
  };

  /* 
   * @private
   * Calls all registered callbacks.
   */
  Form.prototype.notifySubmission = function (error, data) {
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
    var self = this, errors = {};

    if (cb) {
      self.cbs.push(cb);
    }

    _.each(formFields, function (formField) {
      var ruleName, fieldName, fieldErrors, fieldRules, ruleTest, testPassed;

      fieldName = formField.name;
      fieldErrors = [];

      if (!fieldName) {
        return;
      }

      fieldRules = self.rules[fieldName];

      for (ruleName in fieldRules) {
        if (fieldRules.hasOwnProperty(ruleName) && Rules[ruleName]) {

          ruleTest = Rules[ruleName];
          testPassed = ruleTest(formField.value, fieldRules, formFields);
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
      self.notifySubmission(null, formFields);
    } else {
      self.notifySubmission(errors, null);
    }
  };

  /* 
   * @private
   * Transforms the user defined rules into a data structure that's easier to 
   * work with.
   */
  Form.prototype.transformRules = function (userStyleRules) {
    var rules = {};

    _.each(userStyleRules, function (userRule) {
      var p, fieldRule = {};
      for (p in userRule) {
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
  Form.prototype.addCb = function (cb) {
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
    self.addCb(cb);

    $(W.document).on('submit', ('#' + self.name), function (e) {
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
  Regulate = function (name, formRules) {
    Regulate[name] = new Form(name, formRules);
  };

  /*
   * @public
   * The object containing all validation rules.
   */
  Regulate.Rules = Rules;

  /*
   * @public
   * Registers an user defined rule.
   * @param ruleName - String - The name of the rule.
   * @param testFn - Function - The function to be executed during validation.
   *    @return A boolean value that represents the validation result.
   */
  Regulate.registerRule = function (ruleName, testFn) {
    if (Regulate.Rules[ruleName]) {
      throw new Error(ruleName + " is already defined as a rule.");
    }
    Regulate.Rules[ruleName] = testFn;
  };

  W.Regulate = Regulate;

}(window, _, jQuery));