const express = require('express');
const dataEndlessTower = require('./scraping')
const app = express();
const port = 9090;

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});

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

let data = async () => {
    let rs = await dataEndlessTower.scraping()
    return rs
}

data().then((result) => {
    const util = require('util')
    console.log(util.inspect(result, { maxArrayLength: null }))

    // console.log(getSearch(result, "DRAKE"))
});