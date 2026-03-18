const cardModel = require("./cardModel")


const createCard = async (data, session = null) => {

    if (session) {
        const [card] = await cardModel.create([data], { session });
        return card;
    }
    return await cardModel.create(data);
};

const findById = async(id, session) => { 
    return await cardModel.findById(id).session(session);
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

const findByColumn = async (columnId, skip, limit) => {
    return await cardModel.find({ columnId})
    .sort({ position: 1 })
    .skip(skip)
    .limit(limit)
    .select("title position description")
};

const countByColumn = async (columnId) => {
    return await cardModel.countDocuments({ columnId });
}

const save = async(card, session) => {
    return await card.save({ session });
};

const positionInsert = async (columnId, position, session) => {
    console.log("shifting card in column:", columnId)
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

module.exports = { createCard, findById, updateById, deleteById, findByColumn, save, positionDelete, positionInsert, countByColumn }