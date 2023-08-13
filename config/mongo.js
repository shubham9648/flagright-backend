module.exports.mongoOptions = {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };
  
  module.exports.mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_ATLAS_PW}@${process.env.MONGO_CLUSTER}/${process.env.DB_NAME}`;
  
  module.exports.mongoUrlProd = `mongo connect url production database`;