Regulate.js
===========

Regulate is a versatile form validation library (usable, but still under development).

Dependencies
------------

* Underscore 1.0.0+
* jQuery 1.7.0+

What it does
------------
Regulate intercepts the onSubmit event for your forms and validates them according to your requirements.
It then reports back with the data if validation passed or with the errors if validation failed.

What it doesn't do
------------------
* Regulate does not submit the data, it merely validates it and reports back with a result.
* Regulate supports validations for fields that should match (like for passwords), but doesn't support
fields whose validation requirements depend on the value of other fields.

Usage
-----

Note: Any field that's referenced is `required` by default. This means that validation
will fail if the field's associated value is a falsy type (null, "", undefined, etc.).

```html

<form id='myForm'>
  <input type='text' name='foo'/>
  <p id='foo-error'></p>

  <input type='text' name='bar'/>
  <p id='bar-error'></p>

  <input type='file' name='anImage'/>
  <p id='anImage-error'></p>

  <input type='submit'/>
</form>

```

The validation metrics for `myForm`:

```js

Regulate('myForm', [
  {
    name: "foo",
    display_as: "Foo"
    display_error: "#foo-error"
  },
  {
    name: "bar",
    min_length: 3,
    max_length: 10,
    display_as: "Bar"
    display_error: "#bar-error"
  },
  {
    name: "anImage",
    max_length: 1024 * 1024, // in bytes
    accepted_files: "jpeg|png",
    display_as: "An image",
    display_error: "#anImage-error"
  }
]);

```

Register an `onSubmit` callback that accepts `error` & `data` arguments:

```js

Regulate.myForm.onSubmit(function (error, data) {
  if (error) {
    console.log('Validation failed! These are the error messages: ', error);
  } else {
    console.log('Validation passed! This is the data: ', data);
  }
});

```

What the data argument looks like
---------------------------------

The data argument for the onSubmit callback is an array of objects. Each object
corresponds to its form element. This includes fields that were not validated
through Regulate. All data objects have `name` and `value` properties. They
can also contain additional information unique to the corresponding element type.

```js

// The data array for the sample form above would look like this:

data => [
  {
    name: 'foo',
    value: 'foosVal'
  },
  {
    name: 'bar',
    value: 'barsVal'
  },
  {
    name: 'anImage',
    value: 100, // the size in bytes
    fileType: 'image/jpeg', // the media type
    files: FileList // this is the FileList object for the element
  }
]


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
* `max_size`
* `accepted_files`

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
**Next**

* Validations that trigger onChange.

**Soon**

* A cleaner way to add/override custom error messages.
* Partial form validations (request).
* Complete documentation.
* Moar rules.


Contibute
---------
I appreciate your feedback, feel free to report issues, suggestions, and PRs.