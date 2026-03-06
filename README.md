## Database Schema
![Database schema](./doc/db-schema.png)

## Architecture and folder reasoning
*doc for my db-diagram
inside my src I have my config i.e for my dbConnection, middleware for my authentication and other request level  then the modules, each module(user, board, column, card, tags)has its own controller, model and routes. This keeps feature encapsulated and esay to access

## Key engineering decision
used JWT stored in req.user for validating requests.
Ensured users can only access resources they own 
## Schema Relationship
user->board : one to many
board->column : one to many
column->card : one to many
card->tags : many to many
