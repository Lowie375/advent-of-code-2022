const prompts = require("prompts");
const fs = require('fs');

exports.run = async function() {
    const input = await prompts([{
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    }, {
        type: "number",
        name: "row",
        message: "Grid row to check:",
        initial: 2000000
    }]);

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        let textLines = text.toString().split("\n");
        let checkRow = parseInt(input.row);
        let visited = new Map();

        for (const l of textLines) {
            // extract coordinates
            let coords = l.match(/.+x=(-?\d+), ?y=(-?\d+): .+x=(-?\d+), ?y=(-?\d+)/mi);
            let sensor = [parseInt(coords[1]), parseInt(coords[2])];
            let beacon = [parseInt(coords[3]), parseInt(coords[4])];
            let dist = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]); 

            // map visited positions
            if (beacon[1] == checkRow)
                visited.set(beacon[1], true);
            for (let i = 0; i <= dist - Math.abs(checkRow - sensor[1]); i++) {
                if (!visited.has(sensor[0] + i))
                    visited.set(sensor[0] + i, false);
                if (!visited.has(sensor[0] - i))
                    visited.set(sensor[0] - i, false);
            }
        }
        // determine positions in row 2000000 that can not contain beacon
        let ctr = 0;
        for (const item of visited) {
            if (item[1] === false)
                ctr++;
        }
        console.log(ctr);
    });
}

exports.info = {
    name: "noBeaconCount",
    desc: "Determine the number of positions in row 2000000 than can't contain a beacon!",
    day: 15,
    defaultData: "sensors.txt",
}