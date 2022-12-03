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
        let calTracker = [];
        let calCount = 0;
        for (const l of textLines) {
            if (l == "") {
                calTracker.push(calCount);
                calCount = 0;
            } else if (parseInt(l)) {
                calCount += parseInt(l);
            }
        }
        console.log(calTracker.reduce((max, curr) => Math.max(max, curr), calTracker[0]));
    });
}

exports.info = {
    name: "calorieCount",
    desc: "Find the elf carrying the most calories!",
    day: 1,
    defaultData: "calories.txt",
}