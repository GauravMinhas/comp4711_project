# KnowledgeBase - COMP4711 Group Assingment

# Classes

## user

    - id (num)
    - name (string)
    - picture (string)
    - statement_of_intent (status - string)
    - posts (num)
    - stars (likes)
    - threads (num)

## post

    - id (num)
    - subject (string)
    - details (string)
    - creator (user.id)
    - tags (string)
    - replies (num)
    - timestamp

## reply

    - id (num)
    - parent (post.id)
    - details (string)
    - creator (user.id)
    - timestamp

## message

    - id (num)
    - sender (user.id)
    - details
    - timestamp

## thread

    - id (num)
    - user1 (user.id)
    - user2 (user.id)

## thread-messages (index)

    - thread (thread.id)
    - message (message.id)

## post-replies (index)

    - post (post.id)
    - reply (reply.id)

## user-posts (index)

    - user (user.id)
    - post (post.id)

## user-threads (index)

    - user (user.id)
    - thread (thread.id)

# Pages

- Login
- Signup
- Home '/'
- Profile
- Search
- Post
- Messages
