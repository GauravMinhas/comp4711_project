const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const messages = require('../models/message');
const threads = require('../models/thread');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

function getMessagesForThreads(threadID) {
  if (!threadID) {
    // maybe an empty Promise ??
    return Promise.resolve(null);
  }
  const list = [];
  return messages.getMessages(threadID)
    .then(([data]) => {
      data.forEach(({ messageID }, index) => {
        list[index] = messages.getMessage(messageID)
          .then(([row]) => {
            // eslint-disable-next-line max-len
            const message = { senderID: row[0].senderID, text: row[0].details, timePosted: row[0].timePosted };
            return message;
          });
      });
      return Promise.all(list);
    });
}

function getThreadsForUser(id) {
  let list = [];
  return threads.getThreads(id)
    .then(([data]) => {
      data.forEach(({ threadID }, index) => {
        list[index] = threads.getThread(threadID)
          .then(([row]) => {
            const other = (row[0].user1ID === id ? row[0].user2ID : row[0].user1ID);
            return { userID: other, threadID };
          });
      });
      list = [{ userID: id, threadID: 0 }, ...list];
      return Promise.all(list).then((userList) => {
        const nameAndPhoto = [];
        userList.forEach((user, index) => {
          nameAndPhoto[index] = userProfile.getNameAndPhoto(user.userID).then(([namePhoto]) => {
            const person = {
              userName: namePhoto[0].userName,
              profileURL: namePhoto[0].profileURL,
              threadID: user.threadID,
              userID: user.userID,
            };
            return getMessagesForThreads(user.threadID)
              .then((messageData) => {
                person.messages = messageData;
                return person;
              })
          });
        });
        return Promise.all(nameAndPhoto);
      });
    });
}

exports.getThreads = (req, res) => {
  const { userID } = req.cookies;
  getThreadsForUser(userID)
    .then((finalList) => {
      const [currentUser, ...users] = finalList;
      users.forEach((user) => {
        // sort by latest
        user.messages.sort((a, b) => ((new Date(b.timePosted)) - (new Date(a.timePosted))));
        const latest = new Date(user.messages[0].timePosted);
        // eslint-disable-next-line no-param-reassign
        user.latestMessageTime = `${latest.toLocaleString('default', { month: 'short' })} ${latest.getDate()}`;
      });
      res.render('threads', {
        pageTitle: 'Threads',
        threadpageCSS: true,
        threads: users,
        hasMessages: false,
      });
    });
};

function hhmmxm(time) {
  return (new Date(time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function makeGroups(messages) {
  const object = messages.reduce((groups, message) => {
    let date = new Date(message.timePosted);
    date = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    if (!groups[date]) {
      groups[date] = [];
    }
    message.timePosted = hhmmxm(message.timePosted);
    groups[date].push(message);
    return groups;
  }, {});
  return Object.entries(object).map(([key, value]) => ({ date: key, messages: value }));
}

exports.getThread = (req, res) => {
  const senderID = req.cookies.userID;
  const { id: threadID } = req.params;
  getThreadsForUser(senderID)
    .then(finalList => {
      const [currentUser, ...users] = finalList;
      users.forEach(user => {
        // sort by latest
        // user.messages.sort((a, b) => ((new Date(b.timePosted)) - (new Date(a.timePosted))));
        const latest = new Date(user.messages[user.messages.length - 1].timePosted);
        user.latestMessageTime = `${latest.toLocaleString('default', { month: 'short' })} ${latest.getDate()}`;
        user.latestMessageSubject = user.messages[user.messages.length - 1].text.split('\n')[0];
      });
      const other = users.find(user => user.threadID == threadID);
      const messages = other.messages;
      messages.forEach(message => {
        if (message.senderID == senderID) {
          message.senderURL = currentUser.profileURL;
          message.userName = currentUser.userName;
        } else {
          message.senderURL = other.profileURL;
          message.userName = other.userName;
        }
      })

      const groups = makeGroups(messages);
      res.render('threads', {
        pageTitle: 'Threads',
        threadpageCSS: true,
        threads: users,
        senderID,
        groups,
        hasMessages: true,
        recieverID: other.userID,
      });
    });

  // const { id: recieverID } = req.params;
  // senderID = req.cookies.userID;
  // userProfile.retrieveUserInfo(recieverID).then(([data]) => {
  //     const userData = data[0];
  //     res.render('direct-message', {
  //         pageTitle: `Message ${userData.userName}`,
  //         dmpageCSS: true,
  //         userInfo: userData,
  //     });
  // });
};

exports.postdirectMessage = (req, res) => {
  const { id: recieverID } = req.params;
  senderID = req.cookies.userID;
  const message = req.body.subject + "\n" + req.body.message;
  threads.getThreadIDFromUsersID(senderID, recieverID).then(([data]) => {
    if (!data.length) {
      threads.insertThread(senderID, recieverID)
        .then(threadID => {
          messages.insertMessage(threadID, senderID, message)
            .then(() => res.redirect(301, `/user/${recieverID}`))
        });
    } else {
      messages.insertMessage(data[0].threadID, senderID, message)
        .then(() => res.redirect(301, `/user/${recieverID}`))
    }
  })
};