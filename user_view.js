$(function() {
  var currentUser = 'james';

  // Get a reference to the root of the teeMail data.
  var myDataReference = new Firebase('http://gamma.firebase.com/teemail');

  // create child locations.
  var userDataRef = myDataReference.child('users');
  var mailDataRef = myDataReference.child('mail');

  userDataRef.on('child_added', function(snapshot) {
    var teeUser = snapshot.val();
    if (currentUser === teeUser.teeId)
      addUserToScreen(teeUser);
  });

  mailDataRef.on('child_added', function(snapshot) {
    var teeMail = snapshot.val();
    if (currentUser === teeMail.to)
      addMailToScreen(teeMail);
    else if (currentUser === teeMail.from)
      addSentMailToScreen(teeMail);
  });

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
    $('.userDetails').append(p);

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

    $('.inbox').append(p);
  };

  var addSentMailToScreen = function(mail) {
    var p = document.createElement('p');
    var msgNode = document.createTextNode('From: ' + mail.from + ', To: ' +
      mail.to + ', Message: ' + mail.msg);
    p.appendChild(msgNode);

    $('.sentMail').append(p);
  };
});
