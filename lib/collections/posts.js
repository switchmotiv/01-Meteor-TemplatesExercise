Posts = new Mongo.Collection('posts');

Meteor.methods({
  postInsert: function(postAttributes){
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });



    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      // since we're triggering a return call, the method stops at that point without executing
      // the insert statement, thus elegantly preventing any duplicates.
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    };

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var postId = Posts.insert(post);

    return {_id: postId};
  }
});



// We call Posts.allow, which tells Meteor "this is a set of circumstances under which clients are
// allowed to do things to the Posts collection". In this case, we are saying
// "clients are allowed to insert posts as long as they have a userId".
Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
  // The userId of the user doing the modification is passed to the allow and deny calls
  // (or returns null if no user is logged in), which is almost always useful.
  // And as user accounts are tied into the core of Meteor, we can rely on userId always being correct.
});
