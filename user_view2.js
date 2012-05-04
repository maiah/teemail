$(function() {
  var firebaseLocation = 'http://gamma.firebase.com/teemail',
    currentUser = 'james';

  // Get a reference to the root of the teeMail data.
  var myDataReference = new Firebase(firebaseLocation);

  // create taglilne child location
  var tagLineReference = myDataReference.child('tagLine');

  // create user child locations.
  var userDataRef = myDataReference.child('users');

  // create mail child locations
  var mailsDataRef = myDataReference.child('mails');
  var topicsDataRef = mailsDataRef.child('topics');
  var messagesDataRef = mailsDataRef.child('messages');

  tagLineReference.once('value', function(snapshot) {
    $('.tagLine').append(snapshot.val());
  });

  userDataRef.child(currentUser).once('value', function(snapshot) {
    addUserToScreen(snapshot.name());
  });

  topicsDataRef.on('child_added', function(snapshot) {
    var topic = snapshot.val();
    var participantsDataRef = topicsDataRef.child(snapshot.name() + '/participants');

    participantsDataRef.on('child_added', function(participantSnapshot) {
      var participant = participantSnapshot.val();
      if (participant.id === currentUser) {
        addConversionToScreen(snapshot.name(), topic);
      }
    });
  });

  var addUserToScreen = function(teeId) {
    var p = document.createElement('p');

    // create the mail creator
    var teeIdLabel = document.createTextNode(teeId);
    p.appendChild(teeIdLabel);

    // create recipient input textbox
    var recipientInput = document.createElement('input');
    recipientInput.setAttribute('type', 'text');
    p.appendChild(recipientInput);

    // create recipient input textbox
    var subjectInput = document.createElement('input');
    subjectInput.setAttribute('type', 'text');
    p.appendChild(subjectInput);

    // create message input textbox
    var msgInputTextBox = document.createElement('textarea');
    p.appendChild(msgInputTextBox);

    // create send mail button
    var sendMailButton = document.createElement('button');
    var buttonText = document.createTextNode('Send mail');
    sendMailButton.appendChild(buttonText);
    sendMailButton.setAttribute('id', teeId);
    p.appendChild(sendMailButton);

    // put everything in the userList div
    $('.userDetails').append(p);

    // add click event handler
    $('#' + teeId).click(function() {
      validateMailDetails(teeId, recipientInput.value, msgInputTextBox.value, subjectInput.value);
    });
  };

  var validateMailDetails = function(from, to, msg, subj) {
    if (to !== '') {
      userDataRef.child(to).once('value', function(snapshot) {
        if (snapshot.val() !== null)
          sendMail(from, to, msg, subj);
        else
          alert('Recipient not found!');
      });

    } else {
      alert('Recipient not found!');
    }
  };

  var sendMail = function(from, to, msg, subj) {
    var topic = topicsDataRef.push();
    topic.set({sbj: subj});

    var participantsDataRef = topicsDataRef.child(topic.name() + '/participants');
    participantsDataRef.push({id: from});
    participantsDataRef.push({id: to});

    var msgTopicDataRef = messagesDataRef.child(topic.name());
    msgTopicDataRef.push({'frm': from, 'msg': msg});
  };

  var addConversionToScreen = function(topicLocation, topic) {
    var messagesByTopicDataRef = messagesDataRef.child(topicLocation);

    messagesByTopicDataRef.on('child_added', function(snapshot) {
      var mail = snapshot.val();
      var p = document.createElement('p');
      var msgNode = document.createTextNode('From: ' + mail.frm +
        ', Subject: ' + topic.sbj + ', Message: ' + mail.msg);

      p.appendChild(msgNode);

      $('.conversations').append(p);

      if (currentUser === mail.frm) {
        var pSent = document.createElement('p');
        var msgNodeSent = document.createTextNode('From: ' + mail.frm +
          ', Subject: ' + topic.sbj + ', Message: ' + mail.msg);

        pSent.appendChild(msgNodeSent);
        $('.sentMail').append(pSent);
      }
    });
  };

});
