const db = require('../database/db.js');


function getThreads(userID) {
    return db.execute(`SELECT threadID FROM user_thread WHERE userID = '${userID}';`);
}

function getThread(threadID) {
    return db.execute(`SELECT * FROM thread WHERE threadID = '${threadID}';`);
}

function insertThread(user1ID, user2ID) {
    return db.execute(`INSERT INTO thread (user1ID, user2ID) VALUES ('${user1ID}', '${user2ID}');`)
        .then((resp) => {
            const threadID = resp[0].insertId;
            return db.execute(`INSERT INTO user_thread (userID, threadID) VALUES ('${user1ID}', '${threadID}'), ('${user2ID}', '${threadID}');`)
                .then(() => threadID);
        })
}

function insertMessageID(threadID, messageID) {
    return db.execute(`INSERT INTO thread_message (threadID, messageID) VALUES ('${threadID}', '${messageID}')`);
}


function getThreadIDFromUsersID(user1ID, user2ID) {
    return db.execute(`SELECT * from thread WHERE (user1ID = '${user1ID}' AND user2ID = ${user2ID}) OR (user1ID = '${user2ID}' AND user2ID = ${user1ID} )`);
}



module.exports = {
    getThreads,
    insertThread,
    insertMessageID,
    getThread,
    getThreadIDFromUsersID,
};
