

module.exports.corsOptions = {
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
};

module.exports.PORT = 3001; // Get this from env file

module.exports.bodyParser = {
  limit: "50mb",
  urlencoded: {
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  },
};