Regulate.js
===========

Regulate is a versatile form validation library (still in the works).

Dependencies
------------

* Underscore 1.0.0+
* jQuery 1.7.0+

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
* `max_size`
* `accepted_files`

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
