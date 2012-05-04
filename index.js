$(function() {
  // Get a reference to the root of the teeMail data.
  var myDataReference = new Firebase('http://gamma.firebase.com/teemail');

  // create child locations.
  var tagLineDataRef = myDataReference.child('tagLine');
  var userDataRef = myDataReference.child('users');
  var mailDataRef = myDataReference.child('mail');

  // populate locations.
  var populateLocations = function() {
    // populate app tagline
    tagLineDataRef.set('Let there be new internet mailing');

    // populate users
    userDataRef.push({teeId: 'maiah', firstName: 'Jeremiah', lastName: 'Macariola'});
    userDataRef.push({teeId: 'james', firstName: 'James', lastName: 'Aaron'});
  };

  // Setup location queries
  tagLineDataRef.on('value', function(snapshot) {
    createScreenMessage(snapshot.val());
  });

  userDataRef.on('child_added', function(snapshot) {
    var teeUser = snapshot.val();
    addUserToScreen(teeUser);
  });

  mailDataRef.on('child_added', function(snapshot) {
    addMailToScreen(snapshot.val());
  });

  var createScreenMessage = function(msg) {
    var h3 = document.createElement('h3');
    var msgNode = document.createTextNode(msg);
    h3.appendChild(msgNode);

    $('.tagLine').append(h3);
  };

  var addUserToScreen = function(teeUser) {
    var p = document.createElement('p');

    // create the mail creator
    var teeId = document.createTextNode(teeUser.teeId);
    p.appendChild(teeId);

    // create recipient input textbox
    var recipientInput = document.createElement('input');
    recipientInput.setAttribute('type', 'text');
    p.appendChild(recipientInput);

    // create message input textbox
    var msgInputTextBox = document.createElement('textarea');
    p.appendChild(msgInputTextBox);

    // create send mail button
    var sendMailButton = document.createElement('button');
    var buttonText = document.createTextNode('Send mail');
    sendMailButton.appendChild(buttonText);
    sendMailButton.setAttribute('id', teeUser.teeId);
    p.appendChild(sendMailButton);

    // put everything in the userList div
    $('.userList').append(p);

    // add click event handler
    $('#' + teeUser.teeId).click(function() {
      validateMailDetails(teeUser.teeId, recipientInput.value, msgInputTextBox.value);
    });
  };

  var validateMailDetails = function(from, to, msg) {
    userDataRef.once('value', function(snapshots) {
      var teeUserFound = false;

      snapshots.forEach(function(snapshot) {
        var teeUser = snapshot.val();
        if (to === teeUser.teeId) {
          sendMail(from, to, msg);
          teeUserFound = true;
        }
      });

      if (!teeUserFound)
        alert('Recipient not found!');
    });
  };

  var sendMail = function(from, to, msg) {
    mailDataRef.push({'from': from, 'to': to, 'msg': msg});
  };

  var addMailToScreen = function(mail) {
    var p = document.createElement('p');
    var msgNode = document.createTextNode('From: ' + mail.from + ', To: ' +
      mail.to + ', Message: ' + mail.msg);
    p.appendChild(msgNode);

    $('.allMails').append(p);
  };

});
