# KnowledgeBase - COMP4711 Group Assingment

# Classes

## user

    - id (num)
    - name
    - picture
    - statement_of_intent (status)
    - last_active
    - followers

## question

    - id (num)
    - subject
    - details (hmtl? RTE?)
    - creator (user.id)
    - tags
    - points
    - timestamp

## answer

    - id (num)
    - parent {parent, answer} # differece between comment and answer on SO
    - details (hmtl? RTE?)
    - creator (user.id)
    - points
    - is_correct_answer (NULL if parent is another answer, as a comment cant be an answer)
    - timestamp

# message

    - id
    - sender
    - reciever
    - details
    - timestamp
