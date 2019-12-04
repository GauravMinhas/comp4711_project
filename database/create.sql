CREATE TABLE IF NOT EXISTS userauth (
	userAuthID int auto_increment NOT NULL,
    userPassword varchar(20) NOT NULL,
    email varchar(30) NOT NULL,
    PRIMARY KEY(userAuthID),
    UNIQUE(email)
    );

CREATE TABLE IF NOT EXISTS userinfo (
	userInfoID int auto_increment NOT NULL,
    userAuthID int NOT NULL UNIQUE,
    userName varchar(20),
    profileUrl varchar(150),
    statementOfIntent varchar(150) DEFAULT " ",
    country varchar(30) DEFAULT "Canada",
    posts int DEFAULT 0,
    stars int DEFAULT 0,
    threads int DEFAULT 0,
    dateOfBirth varchar(10) NOT NULL,
    PRIMARY KEY(userInfoID),
    FOREIGN KEY(userAuthID) REFERENCES userauth(userAuthID)
    );
    
CREATE TABLE IF NOT EXISTS post (
	postID int auto_increment NOT NULL,
    title varchar(150) NOT NULL,
    details varchar(60000) NOT NULL,
    creatorID int NOT NULL,
    creatorProfileUrl varchar(150),
    tags varchar(150) DEFAULT "none",
    replyCount int DEFAULT 0,
    timePosted timestamp DEFAULT current_timestamp,
    PRIMARY KEY(postID),
    FOREIGN KEY(creatorID) REFERENCES userinfo(userInfoID)
    );

CREATE TABLE IF NOT EXISTS reply (
	replyID int auto_increment NOT NULL,
    parent int NOT NULL,
    details varchar(60000) NOT NULL,
    creatorID int NOT NULL,
    creatorProfileUrl varchar(150),
    timePosted timestamp DEFAULT current_timestamp,
    PRIMARY KEY(replyID),
    FOREIGN KEY(parent) REFERENCES post(postID),
    FOREIGN KEY(creatorID) REFERENCES userinfo(userInfoID)
    );
    
CREATE TABLE IF NOT EXISTS message (
	messageID int auto_increment NOT NULL,
    senderID int NOT NULL,
    details varchar(60000) NOT NULL,
    timePosted timestamp DEFAULT current_timestamp,
    PRIMARY KEY(messageID),
    FOREIGN KEY(senderID) REFERENCES userinfo(userInfoID)
    );
    
CREATE TABLE IF NOT EXISTS thread (
	threadID int auto_increment NOT NULL,
    user1ID int NOT NULL,
    user2ID int NOT NULL,
    PRIMARY KEY(threadID, user1ID, user2ID),
    FOREIGN KEY(user1ID) REFERENCES userinfo(userInfoID),
    FOREIGN KEY(user2ID) REFERENCES userinfo(userInfoID)
    );
    
CREATE TABLE IF NOT EXISTS thread_message (
    threadID int NOT NULL,
    messageID int NOT NULL,
    PRIMARY KEY(threadID, messageID),
    FOREIGN KEY(threadID) REFERENCES thread(threadID),
    FOREIGN KEY(messageID) REFERENCES message(messageID)
    );
    
CREATE TABLE IF NOT EXISTS post_reply (
	postID int NOT NULL,
    replyID int NOT NULL,
    PRIMARY KEY(postID, replyID),
    FOREIGN KEY(postID) REFERENCES post(postID),
    FOREIGN KEY(replyID) REFERENCES reply(replyID)
    );
    
CREATE TABLE IF NOT EXISTS user_post (
	userID int NOT NULL,
    postID int NOT NULL,
    PRIMARY KEY(userID, postID),
    FOREIGN KEY(userID) REFERENCES userinfo(userInfoID),
    FOREIGN KEY(postID) REFERENCES post(postID)
    );
    
CREATE TABLE IF NOT EXISTS user_thread (
    userID int NOT NULL,
    threadID int NOT NULL,
    PRIMARY KEY(userID, threadID),
    FOREIGN KEY(userID) REFERENCES userinfo(userInfoID),
    FOREIGN KEY(threadID) REFERENCES thread(threadID)
    );