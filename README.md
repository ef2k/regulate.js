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

Regulate('myFormId',
[{
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

By default, any field listed in the requirements for your form will be required.
That is, the field will not pass validation if it's empty, unchecked, or unselected.

For more control, the following field rules are included with Regulate:

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

As the included rules are rather sparse. If needed, you can register custom field rules by passing a test function with an arity of 3 (the field value, the field requirements, all of the field requirments). Here's an example:

```js
Regulate.registerRule('unique', function (fieldValue, fieldReqs, fields) {
  var isUnique = myFnThatChecksUniqueness(fieldValue);
  return isUnique; // true or false.
});
```

Internationalization (i18n)
---------------------------

By default, Regulate ships with its error messages in english. If you wish
to introduce other translations, you can do so via `Regulate.addTranslation`.
A complete example in spanish is available in `languages/regulate_es.js`. For the
sake of illustration, here's a quick example:

```js
// A translation should map rule names to functions that return an error message.
var fooTranslation = {
  required: function (fieldName, fieldReqs, formReqs) {
    return "Yo, " + fieldName + " can't be blank.";
  },
  min_length: function (fieldName, fieldReqs, formReqs) {
    return "Yo, min length for " + fieldName + " is " + fieldReqs.min_length;
  },
  max_length: function (fieldName, fieldReqs, formReqs) {
    return "Yo, max length for " + fieldName + " is " + fieldReqs.max_length;
  },
  //...
};

// Add the translation...
Regulate.addTranslation('foo', fooTranslation);
```

Or if you're adding more than one translation...

```js
Regulate.addTranslations({
  foo: fooTranslation,
  bar: barTranslation,
  // ...
});
```

So this has added the `foo` translation. Before we start using `foo` we probably
want to translate the individual forms as well. This can be done via
`Regulate.<yourForm>.addTranslation`.

```js
// Make note of the display_as values which will be translated.
Regulate('myForm', [
  {
    name: 'firstName',
    display_as: 'First name'
  },
  {
    name: 'lastName',
    display_as: 'Last name'
  }
]);

// Add a translation for the display_as values.
Regulate.myForm.addTranslation('foo', {
  firstName: "Yo, first name",
  lastName: "Yo, last name"
});
```

If you're adding more than one translation to your form. You can leave out the
`display_as` fields and declare here instead:

```js
Regulate.myForm.addTranslations({
  en: {
    firstName: "First name", // alternative to display_as
    lastName: "Last name"
  },
  foo: {
    firstName: "Yo, first name",
    lastName: "Yo, last name"
  },
  //...
});
```

To start using the `foo` translation make a call to `Regulate.useTranslation`.

```js
// Use the foo translation
Regulate.useTranslation('foo');
```

This will present error messages using the `foo` translation as well as the corresponding
translation for the individual forms.


TODO
----

* Internationalization (request).
* A cleaner way to add custom error messages.
* Validations that trigger onChange.
* Partial form validations (request).
* Complete documentation.
* Moar rules.
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