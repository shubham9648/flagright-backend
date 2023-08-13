exports.search = (filter, pagination) => {
    console.log("pagination is", pagination);
    const baseQuery = [{
        $match: {
            ...filter,
            active: true
        }
    }];

    
    const dataQuery = [
        ...baseQuery,
    {
        $sort: {
            createdAt: -1
        }
    }, {
        $skip: pagination?.skip
    }, {
        $limit : pagination?.limit
    }];

    const countQuery = [
        ...baseQuery,
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
