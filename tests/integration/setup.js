const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

let mongoServer;

module.exports = {
    connect: async () => {
        // Start an in-memory replica set to support transactions
        mongoServer = await MongoMemoryReplSet.create({
            replSet: { count: 1, storageEngine: 'wiredTiger' }
        });

        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            // useNewUrlParser/useUnifiedTopology are default in mongoose >=6
        });
    },

    closeDatabase: async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
        }
    },

    clearDatabase: async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    },
};