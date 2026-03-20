## Database Schema
![Database schema](./doc/db-schema.png)

## Architecture and folder reasoning
 doc
 |
 |
 src/
 |
 |--config          # Database configuration
 |--middleware      # Custom middleware( error handling)
 |--modules/        # Feature-based modules
    |--board/
        |--boardController.js
        |--boardModel.js
        |--boardRespository.js
        |--boardRoutes.js
        |--boardService.js

   |--realtime
 |--test
 |--server.js   # Entry point                
 |--swagger.yaml    

 ## REQUSET FLOW
Client Request
    |
Route
    |
Controller
    |
Service
    |
Repository
    |
Response

This project follows a modular architecture with clear separation of concerns.Each layer is responsible for a single task, making the codebase easier to maintain, test, and scale in production environment 
    


## Key engineering decision
Used JWT stored in req.user for validating requests.
Ensured users and member can access resources when login


## Schema Relationship
user->board : one to many,
board->column : one to many,
column->card : one to many,
card->tags : many to many,

## CARD ORDERING STRATEGY
Card within a column maintain a numeric 'position' field.
when a card is moved:
*The source column reorders cards by decrementing position greater than the removed card
*The destination column creates space by incrementing positions greater than or equal to the position.
*MongoDB transaction ensure the entire move operation is atomic to prevent data corruption
This guarantees:
No duplicate positions
Consistent ordering
Safe concurrent updates
The card columnId and position are updated.

## CONFLICT STRATEGY
The API a "version" field to detect concurrent updates.
Each card has a version number that increment after every update.
*Client fetches a card and recevies its version
*When updating, the client must send the same 'version'
*The backend updates the card only if the version matches
*If the version does not match, the api return '409 conflict error', indicating that another users has modified the card.

This prevent users from overwritting changes made by other collaborators.

## PERFORMANCE IMPROVEMENTS FOR PAGINATION FOR BOARD AND CARDS
This API use offset-based pagination with page and limit,
GET/boards?page=1&limit=10
*Pagination prevents loading too many records into memory at once, improving response time and reducing server load.
*Sorting optimization
Boards-> sorted by createdAt
Cards-> sorted by position
*Using:
boardModel
.populate("members", name email)
.populate("ownerId","name")
cardModel
.select("title position columnId")
To aviod nested population and only fetch required fields to reduce query cost, improve response time and ensure scalability.

## link to deploy api
https://board-system-backend-project.onrender.com/
