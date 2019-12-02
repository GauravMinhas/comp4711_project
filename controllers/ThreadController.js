const express = require('express');
const bodyParser = require('body-parser');
const userProfile = require('../models/userProfile');
const messages = require('../models/message');
const threads = require('../models/thread');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

exports.getThreads = (req, res) => {
    userID = req.cookies.userID;
    const list = [];
    threads.getThreads(userID)
        .then(([data]) => {
            data.forEach(({ threadID }, index) => {
                list[index] = threads.getThread(threadID)
                    .then(([row]) => {
                        const other = (row[0].user1ID == userID ? row[0].user2ID : row[0].user1ID);
                        return { other, threadID };
                    });

            });
            Promise.all(list).then(userList => {
                const nameAndPhoto = []
                userList.forEach((user, index) => {
                    nameAndPhoto[index] = userProfile.getNameAndPhoto(user.other).then(([data]) => {
                        return { userName: data[0].userName, profileURL: data[0].profileURL, threadID: user.threadID };
                    });
                });
                Promise.all(nameAndPhoto).then(finalList => {
                    console.table(finalList);
                    res.render('threads', {
                        pageTitle: 'Threads',
                        threadpageCSS: true,
                        usersInfo: finalList,
                    });
                });
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