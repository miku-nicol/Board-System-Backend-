// tests/unit/cardService.test.js
const mongoose = require('mongoose');
const cardService = require('../../src/modules/card/cardService');
const cardRespository = require('../../src/modules/card/cardRespository');
const columnModel = require('../../src/modules/column/columnModel');
const boardModel = require('../../src/modules/board/boardModel');

// Mock IDs
const mockOldColumnId = "507f1f77bcf86cd799439013";
const mockNewColumnId = "507f1f77bcf86cd799439014";

const mockOldBoardId = "board1";
const mockNewBoardId = "board2";

const mockCardId = "507f1f77bcf86cd799439012";
const mockUserId = "user1";

// Mock card data
const mockCard = {
    _id: mockCardId,
    columnId: mockOldColumnId,
    position: 2,
    save: jest.fn().mockResolvedValue(true)
};

// Mock session
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    inTransaction: jest.fn().mockReturnValue(true),
    endSession: jest.fn()
};

// Mock Mongoose startSession
mongoose.startSession = jest.fn().mockResolvedValue(mockSession);

// Mock columns
columnModel.findById = jest.fn((id) => {
    if (id === mockOldColumnId) return Promise.resolve({ _id: mockOldColumnId, boardId: mockOldBoardId });
    if (id === mockNewColumnId) return Promise.resolve({ _id: mockNewColumnId, boardId: mockNewBoardId });
    return Promise.resolve(null);
});

// Mock boards
boardModel.findOne = jest.fn((query) => {
    if (query._id === mockOldBoardId &&
        query.$or.some(o => o.ownerId === mockUserId || o.members === mockUserId)) {
        return Promise.resolve({ _id: mockOldBoardId });
    }
    // Unauthorized board
    if (query._id === mockNewBoardId) return Promise.resolve(null);
    return Promise.resolve(null);
});

// Mock repository methods
cardRespository.findById = jest.fn((id) => {
    if (id === mockCardId) return Promise.resolve({ ...mockCard });
    return Promise.resolve(null);
});

cardRespository.positionDelete = jest.fn().mockResolvedValue(true);
cardRespository.positionInsert = jest.fn().mockResolvedValue(true);
cardRespository.save = jest.fn().mockResolvedValue(mockCard);

describe("Card Service - moveCard", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should move a card within the same column successfully", async () => {
        const result = await cardService.moveCard({
            cardId: mockCardId,
            newColumnId: mockOldColumnId,
            newPosition: 5,
            userId: mockUserId
        });

        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();

        expect(result).toEqual({
            card: expect.any(Object),
            boardId: mockOldBoardId
        });
    });

    it("should throw error if user is not authorized for new column", async () => {
        await expect(
            cardService.moveCard({
                cardId: mockCardId,
                newColumnId: mockNewColumnId,  // This column is unauthorized
                newPosition: 3,
                userId: mockUserId
            })
        ).rejects.toThrow("Unauthorized");

        expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it("should throw error if card does not exist", async () => {
        cardRespository.findById.mockResolvedValueOnce(null);

        await expect(
            cardService.moveCard({
                cardId: "invalidCardId",
                newColumnId: mockOldColumnId,
                newPosition: 1,
                userId: mockUserId
            })
        ).rejects.toThrow("Card not found");

        expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it("should handle errors during positionDelete and rollback transaction", async () => {
        cardRespository.positionDelete.mockRejectedValueOnce(new Error("Position delete failed"));

        await expect(
            cardService.moveCard({
                cardId: mockCardId,
                newColumnId: mockOldColumnId,
                newPosition: 1,
                userId: mockUserId
            })
        ).rejects.toThrow("Position delete failed");

        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(cardRespository.save).not.toHaveBeenCalled();
    });

    it("should handle errors during positionInsert and rollback transaction", async () => {
        cardRespository.positionInsert.mockRejectedValueOnce(new Error("Position insert failed"));

        await expect(
            cardService.moveCard({
                cardId: mockCardId,
                newColumnId: mockOldColumnId,
                newPosition: 1,
                userId: mockUserId
            })
        ).rejects.toThrow("Position insert failed");

        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(cardRespository.save).not.toHaveBeenCalled();
    });

    it("should handle errors during save and rollback transaction", async () => {
        cardRespository.save.mockRejectedValueOnce(new Error("Save failed"));

        await expect(
            cardService.moveCard({
                cardId: mockCardId,
                newColumnId: mockOldColumnId,
                newPosition: 1,
                userId: mockUserId
            })
        ).rejects.toThrow("Save failed");

        expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
});