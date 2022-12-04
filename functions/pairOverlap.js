const prompts = require("prompts");
const fs = require('fs');

exports.run = async function() {
    const input = await prompts({
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    })

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        let textLines = text.toString().split("\n");
        let overlaps = 0;
        for (const l of textLines) {
            let rawRange = l.split(",");
            let range1 = rawRange[0].split("-").map((e) => parseInt(e));
            let range2 = rawRange[1].split("-").map((e) => parseInt(e));

            if (range1[0] == range2[0] || range1[1] == range2[1]) {
                overlaps++;
            } else if (range1[0] < range2[0]) {
                overlaps += (range2[1] < range1[1] ? 1 : 0);
            } else {
                overlaps += (range1[1] < range2[1] ? 1 : 0);
            }
        }
        console.log(overlaps);
    });
}

exports.info = {
    name: "fullPairOverlap",
    desc: "Count the number of fully-overlapping sets of pairs!",
    day: 4,
    defaultData: "cleaning.txt",
}