const model = require("../../models/master/currency");
const dal = require("../../helpers/dal");
const { ObjectId } = require("mongodb");

exports.create = async (body) => {
    return await dal.create(model, body);
};


exports.search = async (query) => {
    const data = await dal.aggregate(model, query);
    return {
        data: data[0].data,
        totalCount: data[0].count[0] ? data[0].count[0].count : 0
    };
};

exports.update = async (filter, body) => {
    return await dal.findOneAndUpdate(model, filter, body);
};

exports.delete = async (id) => {
    return await dal.findOneAndUpdate(model, {_id: id}, {active: false});
};