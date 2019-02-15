const express = require('express');
const dataEndlessTower = require('./scraping')
const searching = require('./searching')
const app = express();
const port = 9090;

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});

let data = async () => {
    let rs = await dataEndlessTower.scraping()
    return rs
}

data().then((result) => {
    // const util = require('util')
    // console.log(util.inspect(result, { maxArrayLength: null }))
    console.log(searching(result, "DRAKE"))
});