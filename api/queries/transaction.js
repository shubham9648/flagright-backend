exports.search = (filter, pagination, sort) => {
    console.log("pagination is", pagination);

    let originSearch;
    if (filter['originName']) {
        originSearch = {
            $or: [{
                'originPaymentDetails.nameOnCard.firstName': { $regex: filter['originName'], $options: 'i' }
            }, {
                'originPaymentDetails.nameOnCard.middleName': { $regex: filter['originName'], $options: 'i' }
            }, {
                'originPaymentDetails.nameOnCard.lastName': { $regex: filter['originName'], $options: 'i' }
            }]
        }
        delete filter['originName'];
    }

    let destinationSearch;
    if (filter['destinationName']) {
        destinationSearch = {
            $or: [{
                'destinationPaymentDetails.nameOnCard.firstName': { $regex: filter['destinationName'], $options: 'i' }
            }, {
                'destinationPaymentDetails.nameOnCard.middleName': { $regex: filter['destinationName'], $options: 'i' }
            }, {
                'destinationPaymentDetails.nameOnCard.lastName': { $regex: filter['destinationName'], $options: 'i' }
            }]
        }
        delete filter['destinationName'];
    }

    const baseQuery = [{
        $match: {
            ...filter,
            active: true
        }
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
        }, {
            '$lookup': {
                'from': 'mastercurrencies',
                'localField': 'destinationPaymentDetails.cardIssuedCountry',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'country': 1
                        }
                    }
                ],
                'as': 'destinationPaymentDetails.cardIssuedCountry'
            }
        }, {
            '$unwind': {
                'path': '$destinationPaymentDetails.cardIssuedCountry',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'mastercurrencies',
                'localField': 'originPaymentDetails.cardIssuedCountry',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'country': 1
                        }
                    }
                ],
                'as': 'originPaymentDetails.cardIssuedCountry'
            }
        }, {
            '$unwind': {
                'path': '$originPaymentDetails.cardIssuedCountry',
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            $sort: sort
        }, {
            $skip: pagination?.skip
        }, {
            $limit: pagination?.limit
        }];


    const countQuery = [
        ...baseQuery,
        {
            $count: 'count'
        }];

    if (originSearch) {
        dataQuery.push({
            $match: originSearch
        });
        countQuery[0]['$match'] = { ...baseQuery[0]['$match'], ...originSearch }
    };

    if (destinationSearch) {
        dataQuery.push({
            $match: destinationSearch
        });
        countQuery[0]['$match'] = { ...baseQuery[0]['$match'], ...destinationSearch }
    };

    return [{
        $facet: {
            data: dataQuery,
            count: countQuery
        }
    }];
}
