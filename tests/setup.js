const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = "testsecret";
    process.env.NODE_ENV = "test";

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterEach( async () => {
    const collections = mongoose.connect.collections;

    for(let key in collections) {
        await collections[key].deleteMany(); //delete collection with keyname as model name
    }
})

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
})