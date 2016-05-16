Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

Template.error.onRendered(function() {
  // this.data lets us access the data of the object that is currently being rendered (in our case, an error)
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
});
