CREATE TABLE IF NOT EXISTS userauth (
	id int auto_increment NOT NULL,
    password varchar(20) NOT NULL,
    email varchar(30) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(email)
    );

CREATE TABLE IF NOT EXISTS userinfo (
	id int auto_increment NOT NULL,
    name varchar(20) NOT NULL,
    profileurl varchar(150),
    statement_of_intent varchar(150) DEFAULT " ",
    posts int DEFAULT 0,
    stars int DEFAULT 0,
    threads int DEFAULT 0,
    dateofbirth varchar(10) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(id) REFERENCES userauth(id)
    );
    
CREATE TABLE IF NOT EXISTS post (
	id int auto_increment NOT NULL,
    title varchar(150) NOT NULL,
    details varchar(60000) NOT NULL,
    creator int NOT NULL,
    tags varchar(150) DEFAULT "none",
    replycount int DEFAULT 0,
    timeposted timestamp DEFAULT current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(creator) REFERENCES userinfo(id)
    );

CREATE TABLE IF NOT EXISTS reply (
	id int auto_increment NOT NULL,
    parent int NOT NULL,
    details varchar(60000) NOT NULL,
    creator int NOT NULL,
    timeposted timestamp DEFAULT current_timestamp,
    PRIMARY KEY(id, parent),
    FOREIGN KEY(parent) REFERENCES post(id),
    FOREIGN KEY(creator) REFERENCES userinfo(id)
    );
    
CREATE TABLE IF NOT EXISTS message (
	id int auto_increment NOT NULL,
    sender int NOT NULL,
    details varchar(60000) NOT NULL,
    timeposted timestamp DEFAULT current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(sender) REFERENCES userinfo(id)
    );
    
CREATE TABLE IF NOT EXISTS thread (
	id int auto_increment NOT NULL,
    user1 int NOT NULL,
    user2 int NOT NULL,
    PRIMARY KEY(id, user1, user2),
    FOREIGN KEY(user1) REFERENCES userinfo(id),
    FOREIGN KEY(user2) REFERENCES userinfo(id)
    );
    
CREATE TABLE IF NOT EXISTS thread_message (
    thread int NOT NULL,
    message int NOT NULL,
    PRIMARY KEY(thread, message),
    FOREIGN KEY(thread) REFERENCES thread(id),
    FOREIGN KEY(message) REFERENCES message(id)
    );
    
CREATE TABLE IF NOT EXISTS post_reply (
	post int NOT NULL,
    reply int NOT NULL,
    PRIMARY KEY(post, reply),
    FOREIGN KEY(post) REFERENCES post(id),
    FOREIGN KEY(reply) REFERENCES reply(id)
    );
    
CREATE TABLE IF NOT EXISTS user_post (
	id int NOT NULL,
    post int NOT NULL,
    PRIMARY KEY(id, post),
    FOREIGN KEY(id) REFERENCES userinfo(id),
    FOREIGN KEY(post) REFERENCES post(id)
    );
    
CREATE TABLE IF NOT EXISTS user_thread (
    id int NOT NULL,
    thread int NOT NULL,
    PRIMARY KEY(id, thread),
    FOREIGN KEY(id) REFERENCES userinfo(id),
    FOREIGN KEY(thread) REFERENCES thread(id)
    );
    


