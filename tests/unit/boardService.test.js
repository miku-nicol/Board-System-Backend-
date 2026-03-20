const boardService = require("../../src/modules/board/boardService");
const boardRepository = require("../../src/modules/board/boardRespository")


jest.mock("../../src/modules/board/boardRespository");

describe("Board Service", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("should create a board successfully", async () => {
        const mockBoard = {
            id: "123",
            title: "Test Board",
            description: "Test description"
        };

        boardRepository.createBoard.mockResolvedValue(mockBoard);

        const result = await boardService.createBoard({
            title: "Test Board",
            description: "Test description"

        });

        expect(boardRepository.createBoard).toHaveBeenCalled();
        expect(result).toEqual(mockBoard);
    });


    it("should throw error if repository fails", async () => {
        boardRepository.createBoard.mockRejectedValue(new Error("DB error"));

        await expect(
            boardService.createBoard({ title: "Test", description: "Test description"})
        ).rejects.toThrow("DB error")
    });

    it("should throw error if title or description is missing", async () => {
        await expect(
            boardService.createBoard({ title: "Only title"})
        ).rejects.toThrow("Title and Description are required")
    })
});