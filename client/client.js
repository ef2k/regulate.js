Template.jobform.rendered = function () {

  Regulate('jobform', [{
      name: 'jobtitle',
      max_length: 20,
      min_length: 5 
    }, 
    {
      name: 'jobemail',
      email: true
    }
  ]);

  Regulate.jobform.onSubmission(function(error, data) {
    if (error) {
      console.error('The form didnt validate, this are the errors: ', error);
    } else {
      console.log('Validation passed, this is the data: ', data);
    }
  });
};
