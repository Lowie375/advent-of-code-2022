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

            if (!(Math.max(range1[0], range1[1]) < range2[0]) && !(Math.min(range1[0], range1[1]) > range2[1])) {
                overlaps++;
            }
        }
        console.log(overlaps);
    });
}

exports.info = {
    name: "partialPairOverlap",
    desc: "Count the number of sets of pairs with at least one overlapping section!",
    day: 4,
    defaultData: "cleaning.txt",
}