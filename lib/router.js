Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {return Meteor.subscribe('posts');}
});

Router.route('/', {name: 'postsList'});

Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {name: 'postSubmit'});

var requireLogin = function() {
  if(! Meteor.user()) {
    // This conditional will prevent the previous state from rendering while the user logs in
    // sometimes the user will quickly see a render of the previous screen.
    if(Meteor.loggingIn()){
      this.render('this.loadingTemplate');
    }
    this.render('accessDenied');
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
// What we need to do is check if the user is logged in, and if they're not, render the accessDenied
// template instead of the expected postSubmit template (we then stop the router from doing anything else).
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
