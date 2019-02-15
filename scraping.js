require('dotenv').config({path:__dirname+'/.env'});
const rp = require('request-promise');
const $ = require('cheerio');

const mappingMiniChar = (endlessTowers) => {
    let res = [],
        id = 0,
        id_2 = 0,
        row = 0;

    for (let i = 0; i < endlessTowers.length; i++) {
        id_2 = 6

        if (i % 2 == 0) {
            id += 1;
            id_2 = 3
        }

        if ((i + 1) % 18 == 1) {
            id = 0
            row += 1;
        }


        for (let x = 0; x < endlessTowers[i].length; x++) {
            let eta = {
                "floor": parseInt(id.toString() + id_2.toString()),
                "channel": row,
                "type": "Mini",
                "name": endlessTowers[i][x].trim().toUpperCase()
            }
            res.push(eta)
        }
    }

    return res;
}

const mappingMVPChar = (endlessTowers) => {
    let res = [],
        id = 0,
        row = 0;
    for (let i = 0; i < endlessTowers.length; i++) {
        if ((i + 1) % 9 == 1) {
            id = 0
            row += 1;
        }
        id += 1;

        for (let x = 0; x < endlessTowers[i].length; x++) {
            let eta = {
                "floor": id * 10,
                "channel": row,
                "type": "MVP",
                "name": endlessTowers[i][x].trim().toUpperCase()
            }
            res.push(eta)
        }
    }

    return res;
}

  
const scraping = async () => {
    const url = process.env.URL_WEB;
    const ro = await rp(url)
        .then(function (html) {
            // MVP
            const arr = [];
            const className = "#et-mvp-list > .table-responsive > table.table-bordered > tbody > tr > td.align-middle"
            const content = $(className, html);
            const length = content.length;

            for (let i = 0; i < length; i++) {
                const children = content[i].children;
                let character = []

                for (let z = 0; z < children.length; z++) {
                    if (children[z].type == "tag" && children[z].name == "a") {
                        const att = children[z].attribs['data-content'];
                        const name = att.substring(att.indexOf('<strong>') + 8, att.indexOf('</strong>'))
                        character.push(name)
                    }
                }
                if (character.length > 0) arr.push(character)
            }

            const result = mappingMVPChar(arr)

            // Mini 
            const arrMini = [];
            const classNameMini = "#et-mini-list > .table-responsive > table.table-bordered > tbody > tr > td.align-middle"
            const contentMini = $(classNameMini, html);
            const lengthMini = contentMini.length;

            for (let y = 0; y < lengthMini; y++) {
                const getDiv = contentMini[y].children;

                let characterMini = []

                for (let c = 0; c < getDiv.length; c++) {
                    if (getDiv[c].type == "tag" && getDiv[c].name == "div") {
                        const childrenMini = getDiv[c].children;

                        for (let x = 0; x < childrenMini.length; x++) {

                            if (childrenMini[x].type == "tag" && childrenMini[x].name == "a") {

                                const attMini = childrenMini[x].attribs['data-content'];
                                const nameMini = attMini.substring(attMini.indexOf('<strong>') + 8, attMini.indexOf('</strong>'))
                                characterMini.push(nameMini)

                            }
                        }
                    }

                }

                if (characterMini.length > 0) arrMini.push(characterMini)
            }

            const miniResult = mappingMiniChar(arrMini);

            const res = result.concat(miniResult)
            return res;

        })
        .catch(function (err) {
            //handle error
            console.log(err);
        });

    return ro;
}

module.exports.scraping = scraping;