const model = require("../models/transaction");
const dal = require("../helpers/dal");
const helper = require("../helpers/generateId");
const { ObjectId } = require("mongodb")


exports.create = async (body) => {
    let count = await dal.find(model, {}, { limit: 1 }, { createdAt: -1 }, { srNo: 1 });
    let srNo = count[0]?.srNo + 1 || 1;
    body.srNo = srNo
    body.ID = helper.generateID("TRAN", srNo);
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