Regulate.js
===========

Regulate is a versatile form validation library (still in the works).

Dependencies
------------

* Underscore 1.0.0+
* jQuery 1.7.0+

Usage
-----

```js

Regulate('myFormId', [
  {
    name: "myRequiredFieldName",
  },
  {
    name: "myOtherFieldName",
    min_length: 3,
    max_length: 10
  }
]);

Regulate.myFormId.onSubmit(function (error, data) {
  if (error) {
    console.log('Validation failed! These are the error messages: ', error);
  } else {
    console.log('Validation passed! This is the data: ', data);
  }
});

```

Rules
-----

The following field rules are included with Regulate.

* `email`
* `match_field`
* `min_length`
* `max_length`
* `exact_length`
* `min_checked`
* `max_checked`
* `exact_checked`
* `min_selected`
* `max_selected`
* `exact_selected`

Custom Rules
------------

As the included rules are rather sparse. If needed, you can register
custom field rules by passing a test function with an arity of 3 (the field value, the field requirements, all of the field requirments). Here's an example:

```js
Regulate.registerRule('unique', function (fieldValue, fieldReqs, fields) {
  var isUnique = myFnThatChecksUniqueness(fieldValue);
  return isUnique; // true or false.
});
```

TODO
----

* Internationalization (request).
* A cleaner way to add custom error messages.
* Validations that trigger onChange.
* Partial form validations (request).
* Complete documentation.
* Moar rules.