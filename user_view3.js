$(function() {
  window.TeeMail = Ember.Application.create();

  TeeMail.tagLine = Ember.Object.create({
    text: ""
  });

  TeeMail.user = Ember.Object.create({
    teeId: "",
    fullName: ""
  });

  var groupsView = Ember.View.create({
    templateName: "groups-template",
    groups: []
  });

  var currentUser = "james";
  var firebaseServer = "http://gamma.firebase.com";
  var firebaseLocation = firebaseServer + "/xxxxxxx";
  var myDataReference = new Firebase(firebaseLocation);
  var tagLineReference = myDataReference.child("tagLine");
  var userDataRef = myDataReference.child("users");

  tagLineReference.once("value", function(snapshot) {
    TeeMail.tagLine.set("text", snapshot.val());
  });

  userDataRef.child(currentUser).once("value", function(snapshot) {
    var user = snapshot.val();
    TeeMail.user.set("teeId", snapshot.name());

    var groups = [];
    var i = 0;
    for (var key in user.groups) {
      groups[i] = {name: user.groups[key].name};
      i++;
    }

    groupsView.groups = groups;
    groupsView.appendTo(".groups");
  });

});
