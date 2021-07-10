const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports.client = client;

module.exports.connectDb = connectDb = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
   }
};
