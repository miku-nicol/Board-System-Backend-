const cardModel = require("./cardModel")


const createCard = async (data, session = null) => {

    if (session) {
        const [card] = await cardModel.create([data], { session });
        return card;
    }
    return await cardModel.create(data);
};

const findById = async(id) => { 
    return await cardModel.findById(id);
};


const updateById = async (id, version, updateData) => {
    return await cardModel.findByIdAndUpdate(
        {
            _id: id,
            __v: version
        },
        {
            ...updateData,
            $inc: { __v: 1 }
        },
        { returnDocument: "after", runValidators: true }
    );
};

const deleteById = async(id) => {
    return await cardModel.findByIdAndDelete(id);
};

const findByColumn = async (columnId) => {
    return await cardModel.find({ columnId}).sort({ position: 1 });
};

const save = async(card) => {
    return await card.save();
};

const positionInsert = async (columnId, position, session) => {
    return await cardModel.updateMany(
        {
            columnId,
            position: { $gte: position }
        },
        {
            $inc: { position: 1 }
        },
        { session }
    )
}

const positionDelete = async (columnId, position, session) => {
    return await cardModel.updateMany(
        {
            columnId,
            position: { $gt: position }
        },
        {
            $inc: { position: -1 }
        },
        { session }
    )
}

module.exports = { createCard, findById, updateById, deleteById, findByColumn, save, positionDelete, positionInsert }