const db = require('../database/db.js');
const postModel = require('./post');

function getMessages(threadID) {
    return db.execute(`SELECT messageID FROM thread_message WHERE threadID = '${threadID}';`);
}

function getMessage(messageID) {
    return db.execute(`SELECT * FROM message WHERE messageID = '${messageID}';`);
}

function insertMessage(threadID, senderID, details) {
    return db.execute(`INSERT INTO message (senderID, details) VALUES ('${senderID}', '${details}');`)
        .then((resp) => {
            const messageID = resp[0].insertId;
            return db.execute(`INSERT INTO thread_message (threadID, messageID) VALUES ('${threadID}', '${messageID}');`);
        })
}

function insertMessageID(threadID, messageID) {
    return db.execute(`INSERT INTO thread_message (threadID', messageID) VALUES ('${threadID}', '${messageID}')`);
}

module.exports = {
    getMessages,
    getMessage,
    insertMessageID,
    insertMessage
};
