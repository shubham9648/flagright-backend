exports.generateID = (type, count) => {
    if (count < 10) {
        return type + "-000000" + count.toString();
    } else if (count < 100) {
        return type + "-00000" + count.toString();
    } else if (count < 1000) {
        return type + "-0000" + count.toString();
    } else if (count < 10000) {
        return type + "-000" + count.toString();
    } else if (count < 100000) {
        return type + "-00" + count.toString();
    } else if (count < 1000000) {
        return type + "-0" + count.toString();
    } else {
        return type + '-'+ count.toString();
    }
};