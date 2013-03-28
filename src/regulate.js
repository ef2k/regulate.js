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

  var Helpers, Rules, Messages, Form, Regulate;

  /*
   * @private
   * A Namespace for helper functions.
   */
  Helpers = {
    /*
     * Formats a string. ie: format("{0} {1}", "hello", "world") => hello world
     */
    format: function (str) {
      var i;
      for (i = 0; i < arguments.length; i += 1) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
      }
      return str;
    }
  };

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

    min_count: function (fieldName, fieldReqs, fields) {
      if (!fieldReqs[fieldName]) {
        return false;
      }

      var items = _.filter(fields, function (field) {
        return field.name === fieldReqs.name;
      });

      return items.length >= fieldReqs[fieldName];
    },

    exact_count: function (fieldName, fieldReqs, fields) {
      if (!fieldReqs[fieldName]) {
        return false;
      }

      var items = _.filter(fields, function (field) {
        return field.name === fieldReqs.name;
      });

      return items.length === fieldReqs[fieldName];
    },

    max_count: function (fieldName, fieldReqs, fields) {
      if (!fieldReqs[fieldName]) {
        return false;
      }

      var items = _.filter(fields, function (field) {
        return field.name === fieldReqs.name;
      });

      return items.length <= fieldReqs[fieldName];
    },

    min_checked: function (fieldValue, fieldReqs, fields) {
      return this.min_count('min_checked', fieldReqs, fields);
    },

    exact_checked: function (fieldValue, fieldReqs, fields) {
      return this.exact_count('exact_checked', fieldReqs, fields);
    },

    max_checked: function (fieldValue, fieldReqs, fields) {
      return this.max_count('max_checked', fieldReqs, fields);
    },

    min_selected: function (fieldValue, fieldReqs, fields) {
      return this.min_count('min_selected', fieldReqs, fields);
    },

    exact_selected: function (fieldValue, fieldReqs, fields) {
      return this.exact_count('exact_selected', fieldReqs, fields);      
    },

    max_selected: function (fieldValue, fieldReqs, fields) {
      return this.max_count('max_selected', fieldReqs, fields);
    }
  };
  
  /*
   * @private
   * The following messages are generated after a failed validation.
   */
  Messages = {
    email: function (fieldName, fieldReqs) {
      var message = "The {0} must be valid";
      return Helpers.format(message, fieldName);      
    },

    max_length: function (fieldName, fieldReqs) {
      var message = "The {0} must have a maximum length of {1}.";
      return Helpers.format(message, fieldName, fieldReqs.max_length);
    },
    
    min_length: function (fieldName, fieldReqs) {
      console.log("min_length --> ", arguments);
      var message = "The {0} must have a minimum length of {1}";
      return Helpers.format(message, fieldName, fieldReqs.min_length);
    },
    
    exact_length: function (fieldName, fieldReqs) {
      var message = "The {0} must have an exact length of {1}";
      return Helpers.format(message, fieldName, fieldReqs.exact_length);
    },
    
    min_checked: function (fieldName, fieldReqs) {
      var reqValue = fieldReqs.min_checked;      
      var message = "Check atleast {0} checkbox";
      message += (reqValue !== 1) ? "es" : ".";      
      return Helpers.format(message, reqValue);
    },    
    
    max_checked: function (fieldName, fieldReqs) {
      var reqValue = fieldReqs.max_checked;
      var message = "Check a maximum of {0} checkbox";
      message += (reqValue !== 1) ? "es" : ".";
      return message;
    },
    
    exact_checked: function (fieldName, fieldReqs) {
      var reqValue = fieldReqs.max_checked;
      var message = "Check exactly {0} checkboxes";      
      message += (reqValue !== 1) ? "es" : ".";
      return message;
    }
  };
   
  /*
   * @private
   * @constructor
   * Represents a form with validation requirements.
   */
  Form = function (name, requirements) {
    var self = this;
    self.name = name;
    self.reqs = self.transformReqs(requirements);
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
    var self = this, errors = {}, transformedFieldValues = {};

    if (cb) {
      self.cbs.push(cb);
    }

    // Restructure the form values so it's easier to check against the rules
    // ie: {fieldName: [fieldVal, ...], ...}    
    _.each(formFields, function (formField) {
      var name = formField.name, value = formField.value;
      transformedFieldValues[name] = transformedFieldValues[name] || [];
      transformedFieldValues[name].push(value);
    });

    /* check against the validation requirements */
    _.each(self.reqs, function (fieldReqs, fieldName) {
      var fieldVals, fieldErrors = [];

      fieldVals = transformedFieldValues[fieldName];

      _.each(fieldReqs, function (reqVal, reqName) {
        var error;
        if (!fieldVals && reqName !== 'name') {
          if (Messages[reqName]) {
            error = Messages[reqName](fieldName, fieldReqs);
          } else {
            error = reqName;
          }
          fieldErrors.push(error);
          return;
        }

        if (reqName !== 'name' && Rules.hasOwnProperty(reqName)) {
          _.each(fieldVals, function (fieldVal) {
            var error, testResult;
            testResult = Rules[reqName](fieldVal, fieldReqs, formFields);
            if (!testResult) {
              if (Messages[reqName]) {
                error = Messages[reqName](fieldName, fieldReqs);
              } else {
                error = reqName;
              }
              fieldErrors.push(error);              
            }
          });
        }
      });

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
   * Transforms the user requirements into a data structure that's easier to 
   * work with. ie: {formName1: [{fieldRequirements}, ...], formName2: ...}
   */
  Form.prototype.transformReqs = function (userRequirements) {
    var transformedReqs = {};

    _.each(userRequirements, function (userReq) {
      var reqName, fieldReq = {};
      for (reqName in userReq) {
        if (userReq.hasOwnProperty(reqName)) {
          fieldReq[reqName] = userReq[reqName];
        }
      }
      if (userReq.name) {
        transformedReqs[userReq.name] = fieldReq;
      }
    });
    return transformedReqs;
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
   * Rules exposes all validation rules.
   */
  Regulate.Rules = Rules;
  
  /*
   * @public
   * Messages exposes all error message generators.
   */
  Regulate.Messages = Messages;

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