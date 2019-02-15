const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

const getSearch = (res, resp) => {
    const grouped = groupBy(res, r => r.name);
    const rs = grouped.get(resp);
    return JSON.stringify(rs);
}

module.exports = getSearch