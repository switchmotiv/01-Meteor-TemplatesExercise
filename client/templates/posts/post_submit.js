Template.postSubmit.events ({
  // submit is better than click because it covers all ways of submitting such as hitting 'enter'
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

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
        return alert(error.reason);

      if (result.postExists)
        alert('This link has already been posted');

      Router.go('postPage', {_id: result._id});
    });
    // The insert() function on a collection returns the generated _id for the object that has been
    // inserted into the database, which the Router's go() function will use to construct a URL for us to browse to.

  }
  // The net result is the user hits submit, a post is created, and the user is instantly taken to the
  // discussion page for that new post.
});
