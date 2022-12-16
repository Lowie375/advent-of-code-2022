const prompts = require("prompts");
const fs = require('fs');

function checkDistress(s, checkFunc) {
    for (let x = s.x - s.d - 1, y = s.y; x < s.x; x++, y--) {
        if (checkFunc(x, y))
            return [x, y];
    }
    for (let x = s.x, y = s.y - s.d - 1; y < s.y; x++, y++) {
        if (checkFunc(x, y))
            return [x, y];
    }
    for (let x = s.x + s.d + 1, y = s.y; x > s.x; x--, y++) {
        if (checkFunc(x, y))
            return [x, y];
    }
    for (let x = s.x, y = s.y + s.d + 1; y > s.y; x--, y--) {
        if (checkFunc(x, y))
            return [x, y];
    }
    return [null, null];
}

exports.run = async function() {
    const input = await prompts([{
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    }, {
        type: "number",
        name: "limit",
        message: "Grid rows to check up to:",
        initial: 4000000
    }]);

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        let textLines = text.toString().split("\n");
        let limit = input.limit;
        let signals = [];

        // extract coordinates
        for (const l of textLines) {
            let coords = l.match(/.+x=(-?\d+), ?y=(-?\d+): .+x=(-?\d+), ?y=(-?\d+)/mi);
            let sensor = [parseInt(coords[1]), parseInt(coords[2])];
            let beacon = [parseInt(coords[3]), parseInt(coords[4])];
            let dist = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]); 
            signals.push({x: sensor[0], y: sensor[1], d: dist});
        }
        // find distress beacon
        for (const s of signals) {
            let res = checkDistress(s, (x, y) => {
                return x >= 0 && x <= limit && y >= 0 && y <= limit && signals.every((s) => Math.abs(s.x - x) + Math.abs(s.y - y) > s.d);
            }, limit);
            if (res[0] !== null && res[1] !== null)
                return console.log((res[0] * 4000000) + res[1]);
        }
        console.log("Distress beacon not found.");
    });
}

exports.info = {
    name: "findDistressBeacon",
    desc: "Locate and determine the tuning frequency of the distress beacon!",
    day: 15,
    defaultData: "sensors.txt",
}