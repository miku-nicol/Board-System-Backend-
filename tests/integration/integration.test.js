const mongoose = require('mongoose');
const setup = require('./setup');

const boardService = require('../../src/modules/board/boardService');
const cardService = require('../../src/modules/card/cardService');
const commentService = require('../../src/modules/comment/commentService');

const boardModel = require('../../src/modules/board/boardModel');
const columnModel = require('../../src/modules/column/columnModel');
const cardModel = require('../../src/modules/card/cardModel');
const commentModel = require('../../src/modules/comment/commentModel');
const userModel = require('../../src/modules/User/userModel');

describe('Integration Test - Full Board System Flow', () => {
    jest.setTimeout(30000)
    let user, board, column1, column2, card;

    beforeAll(async () => {
        await setup.connect();
    });

    afterAll(async () => {
        await setup.closeDatabase();
    });

    afterEach(async () => {
        await setup.clearDatabase();
    });

    it('should create a board, move a card, and add a comment successfully', async () => {
        // ===== 1️⃣ Create Board =====
        user = await userModel.create({ 
            name: 'Daniel Jane', 
            email: 'danieljane34@gmail.com', 
            phoneNumber: '08056783764', 
            password: 'ILOVEYOU' 
        });

        const boardData = { 
            title: 'Integration Board', 
            description: 'Full flow test', 
            userId: user._id,
            members: []
        };
        board = await boardService.createBoard(boardData);

        expect(board).toBeDefined();
        expect(board.title).toBe('Integration Board');

        // Create columns
        column1 = await columnModel.create({ 
            title: 'To Do',
             boardId: board._id,
             position: 1
            });
        column2 = await columnModel.create({ 
            title: 'Done', 
            boardId: board._id,
            position: 2 
        });

        // Create card
        card = await cardModel.create({ title: 'Task 1', columnId: column1._id, position: 1 });

        // ===== 2️⃣ Move Card =====
        const moveResult = await cardService.moveCard({
            cardId: card._id,
            newColumnId: column2._id,
            newPosition: 1,
            userId: user._id
        });

        expect(moveResult.card.columnId.toString()).toBe(column2._id.toString());

        const cardInDb = await cardModel.findById(card._id);
        expect(cardInDb.columnId.toString()).toBe(column2._id.toString());

        // ===== 3️⃣ Add Comment =====
        const commentData = { content: 'This is a comment', cardId: card._id, userId: user._id };
        const commentResult = await commentService.addComment(commentData);

        expect(commentResult.comment.content).toBe('This is a comment');
        expect(commentResult.boardId.toString()).toBe(board._id.toString());

        const commentInDb = await commentModel.findById(commentResult.comment._id);
        expect(commentInDb).not.toBeNull();
        expect(commentInDb.content).toBe('This is a comment');
    });
});