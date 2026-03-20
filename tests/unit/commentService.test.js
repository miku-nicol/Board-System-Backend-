const { addComment } = require('../../src/modules/comment/commentService');
const commentRepository = require('../../src/modules/comment/commentRepository');
const cardModel = require('../../src/modules/card/cardModel');
const columnModel = require('../../src/modules/column/columnModel');
const boardModel = require('../../src/modules/board/boardModel');

// Mock all models and repository
jest.mock('../../src/modules/comment/commentRepository');
jest.mock('../../src/modules/card/cardModel');
jest.mock('../../src/modules/column/columnModel');
jest.mock('../../src/modules/board/boardModel');

describe('Comment Service - addComment', () => {
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockCardId = '507f1f77bcf86cd799439012';
    const mockColumnId = '507f1f77bcf86cd799439013';
    const mockBoardId = '507f1f77bcf86cd799439014';
    
    const mockCard = {
        _id: mockCardId,
        columnId: mockColumnId
    };
    
    const mockColumn = {
        _id: mockColumnId,
        boardId: mockBoardId
    };
    
    const mockBoard = {
        _id: mockBoardId,
        ownerId: mockUserId,
        members: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        

        cardModel.findById.mockResolvedValue(mockCard);
        columnModel.findById.mockResolvedValue(mockColumn);
        boardModel.findOne.mockResolvedValue(mockBoard);
    });

    it('should add a comment successfully', async () => {
        const mockCommentData = {
            content: 'Test comment',
            cardId: mockCardId,
            userId: mockUserId
        };

        const mockCreatedComment = {
            _id: '507f1f77bcf86cd799439015',
            ...mockCommentData,
            parentComment: null,
            createdAt: new Date()
        };
        
        commentRepository.create.mockResolvedValue(mockCreatedComment);

        const result = await addComment(mockCommentData);

        expect(result).toEqual({
            comment: mockCreatedComment,
            boardId: mockBoardId
        });
        
        
        expect(cardModel.findById).toHaveBeenCalledWith(mockCardId);
        expect(columnModel.findById).toHaveBeenCalledWith(mockColumnId);
        expect(boardModel.findOne).toHaveBeenCalledWith({
            _id: mockColumn.boardId,
            $or: [{ ownerId: mockUserId }, { members: mockUserId }]
        });
        expect(commentRepository.create).toHaveBeenCalledWith({
            cardId: mockCardId,
            userId: mockUserId,
            content: mockCommentData.content,
            parentComment: null
        });
    });

    it('should add a reply comment successfully', async () => {
        const mockParentCommentId = '507f1f77bcf86cd799439016';
        const mockCommentData = {
            content: 'Test reply',
            cardId: mockCardId,
            userId: mockUserId,
            parentComment: mockParentCommentId
        };

        // Mock parent comment exists
        commentRepository.findById.mockResolvedValue({
            _id: mockParentCommentId,
            cardId: mockCardId,
            userId: '507f1f77bcf86cd799439017'
        });

        const mockCreatedComment = {
            _id: '507f1f77bcf86cd799439018',
            ...mockCommentData,
            createdAt: new Date()
        };
        
        commentRepository.create.mockResolvedValue(mockCreatedComment);

        const result = await addComment(mockCommentData);

        expect(result).toEqual({
            comment: mockCreatedComment,
            boardId: mockBoardId
        });
        
        expect(commentRepository.findById).toHaveBeenCalledWith(mockParentCommentId);
        expect(commentRepository.create).toHaveBeenCalledWith({
            cardId: mockCardId,
            userId: mockUserId,
            content: mockCommentData.content,
            parentComment: mockParentCommentId
        });
    });

    it('should throw an error if parent comment does not exist', async () => {
        const mockCommentData = {
            content: 'Test comment with parent',
            cardId: mockCardId,
            userId: mockUserId,
            parentComment: '507f1f77bcf86cd799439016'
        };

        
        commentRepository.findById.mockResolvedValue(null);

        await expect(addComment(mockCommentData)).rejects.toThrow("Parent comment not found");
        
        expect(commentRepository.findById).toHaveBeenCalledWith(mockCommentData.parentComment);
        expect(commentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if parent comment belongs to different card', async () => {
        const mockCommentData = {
            content: 'Test comment with parent',
            cardId: mockCardId,
            userId: mockUserId,
            parentComment: '507f1f77bcf86cd799439016'
        };

        // Mock parent comment belongs to different card
        commentRepository.findById.mockResolvedValue({
            _id: mockCommentData.parentComment,
            cardId: 'different-card-id',
            userId: '507f1f77bcf86cd799439017'
        });

        await expect(addComment(mockCommentData)).rejects.toThrow("Parent comment does not belong to this card");
        
        expect(commentRepository.findById).toHaveBeenCalledWith(mockCommentData.parentComment);
        expect(commentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if card is not found', async () => {
        const mockCommentData = {
            content: 'Test comment',
            cardId: mockCardId,
            userId: mockUserId
        };

        
        cardModel.findById.mockResolvedValue(null);

        await expect(addComment(mockCommentData)).rejects.toThrow("Card not found");
        
        expect(cardModel.findById).toHaveBeenCalledWith(mockCardId);
        expect(columnModel.findById).not.toHaveBeenCalled();
        expect(boardModel.findOne).not.toHaveBeenCalled();
        expect(commentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if column is not found', async () => {
        const mockCommentData = {
            content: 'Test comment',
            cardId: mockCardId,
            userId: mockUserId
        };

        columnModel.findById.mockResolvedValue(null);

        await expect(addComment(mockCommentData)).rejects.toThrow("Column not found");
        
        expect(cardModel.findById).toHaveBeenCalledWith(mockCardId);
        expect(columnModel.findById).toHaveBeenCalledWith(mockColumnId);
        expect(boardModel.findOne).not.toHaveBeenCalled();
        expect(commentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not authorized (board not found)', async () => {
        const mockCommentData = {
            content: 'Test comment',
            cardId: mockCardId,
            userId: mockUserId
        };

        
        boardModel.findOne.mockResolvedValue(null);

        await expect(addComment(mockCommentData)).rejects.toThrow("Unauthorized");
        
        expect(cardModel.findById).toHaveBeenCalledWith(mockCardId);
        expect(columnModel.findById).toHaveBeenCalledWith(mockColumnId);
        expect(boardModel.findOne).toHaveBeenCalled();
        expect(commentRepository.create).not.toHaveBeenCalled();
    });
});