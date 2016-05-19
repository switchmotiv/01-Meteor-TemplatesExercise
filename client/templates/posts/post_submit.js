// We'll use the Session to store a postSubmitErrors object containing any potential error message.
// As the user interacts with the form, this object will change, which in turn will reactively
// update the form's markup and contents.

// First, we'll initialize the object whenever the postSubmit template is created.
// This ensures that the user won't see old error messages left over from a previous visit to this page.
Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

// We then define our two template helpers. They both look at the field property of
// Session.get('postSubmitErrors') (where field is either url or title depending on where
// we're calling the helper from).
Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postSubmit.events ({
  // submit is better than click because it covers all ways of submitting such as hitting 'enter'
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);


    // The Meteor.call function calls a Method named by its first argument.
    // You can provide arguments to the call (in this case, the post object we constructed from the form),
    // and finally attach a callback, which will execute when the server-side Method is done.

    // Meteor method callbacks always have two arguments, error and result.
    // If for whatever reason the error argument exists, we'll alert the user (using return to abort the callback).
    // If everything's working as it should, we'll redirect the user to the freshly created post's discussion page.
    // postInsert is defined in lib/collections/posts.js
    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user an abort
      if (error)
        return Errors.throw(error.reason);

      // show this result but route anyway
      if (result.postExists)
        Errors.throw('This link has already been posted');

      Router.go('postPage', {_id: result._id});
    });
    // The insert() function on a collection returns the generated _id for the object that has been
    // inserted into the database, which the Router's go() function will use to construct a URL for us to browse to.

  }
  // The net result is the user hits submit, a post is created, and the user is instantly taken to the
  // discussion page for that new post.
});
