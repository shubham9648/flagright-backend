exports.search = (filter, pagination, sort) => {
    console.log("pagination is", pagination);



    let search = {};
    if (filter['search']) {
        search = {
            $or: [{
                'originUser.fullName': { $regex: filter['search'], $options: 'i' }
            }, {
                'destinationUser.fullName': { $regex: filter['search'], $options: 'i' }
            }, {
                'originAmountDetails.currency.name': { $regex: filter['search'], $options: 'i' }
            }, {
                'destinationAmountDetails.currency.name': { $regex: filter['search'], $options: 'i' }
            }]
        }
        delete filter['search'];
    }

    if (Object.keys(sort).length === 0) {
        sort = { createdAt: -1 }
    }

    const baseQuery = [{
        $match: {
            ...filter,
            active: true
        }
    },
    {
        $sort: sort
    }];

    const dataQuery = [
        ...baseQuery,
        {
            '$lookup': {
                'from': 'users',
                'localField': 'originUserId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'fullName': 1,
                            'email': 1
                        }
                    }
                ],
                'as': 'originUser'
            }
        }, {
            '$unwind': {
                'path': '$originUser',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'destinationUserId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'fullName': 1,
                            'email': 1
                        }
                    }
                ],
                'as': 'destinationUser'
            }
        }, {
            '$unwind': {
                'path': '$destinationUser',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'mastercurrencies',
                'localField': 'originAmountDetails.currency',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'name': 1
                        }
                    }
                ],
                'as': 'originAmountDetails.currency'
            }
        }, {
            '$unwind': {
                'path': '$originAmountDetails.currency',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'mastercurrencies',
                'localField': 'destinationAmountDetails.currency',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'name': 1
                        }
                    }
                ],
                'as': 'destinationAmountDetails.currency'
            }
        }, {
            '$unwind': {
                'path': '$destinationAmountDetails.currency',
                'preserveNullAndEmptyArrays': true
            }
        },{
            $match: search
        },{
            $skip: pagination?.skip
        }, {
            $limit: pagination?.limit
        }];


    const countQuery = [
        ...baseQuery,
        {
            $match: search
        },
        {
            $count: 'count'
        }];


    return [{
        $facet: {
            data: dataQuery,
            count: countQuery
        }
    }];
}

exports.analytics = (filter) => {
    const amountQuery = [
        {
            $match: filter
        },
        {
            '$group': {
                '_id': null,
                'totalAmount': {
                    '$sum': '$amount'
                }
            }
        }
    ]

    const transactionCountQuery = [
        {
            $match: filter
        },
        {
            $count: 'count'
        }];
    

        return [{
            $facet: {
                totalAmount: amountQuery,
                totalCount: transactionCountQuery
            }
        }];
}