const model = require("../models/users");
const dal = require("../helpers/dal");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/generateId");
const bcryptjs = require("bcryptjs");
const { ObjectId } = require("mongodb")



let getToken = async (body) => {
  return await jwt.sign(body, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

const loginUser = async ({ email, password }) => {
  const projection = {
    email: 1,
    password: 1,
    fullName: 1,
  };
  var token;
  const user = await dal.findOne(model, { email }, projection);
  if (!user) {
    return { userData: null, token };
  }
  const userData = {
    userId: user._id,
    email: user.email,
    fullName: user?.fullName,
  };

  const result = await bcryptjs.compare(password, user.password);

  if (!result) {
    return { userData, token };
  };

  token = await getToken(userData);

  //   console.log({ userData, token });
  return { userData, token };
};


const registerUser = async (body) => {
  body["password"] = await bcryptjs.hash(body.password, 10);

  const response = await dal.create(model, body);

  const userData = {
    userId: response._id,
    email: response.email,
    fullName: response?.fullName,
  };

  const token = await getToken(userData);
  return { userData, token };
};


const search = async (query) => {
  const data = await dal.aggregate(model, query);

  return {
    data: data[0].data,
    totalCount: data[0].count[0] ? data[0].count[0].count : 0
  };
};


const getUser = async (id) => await dal.findOne(model, { _id: new ObjectId(id)});

module.exports = {
  loginUser,
  registerUser,
  search,
  getToken,
  getUser
}