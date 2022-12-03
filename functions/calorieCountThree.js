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

        // get calorie counts
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

        // find top 3
        let max = [];
        let cap = 3;
        for (const i of calTracker) {
            if (max.length < cap || i > max[cap - 1]) {
                if (max.length >= cap)
                    max.pop();
                max.push(i);
                max.sort((a, b) => a === b ? 0 : b - a);
            }
        }
        console.log(max.reduce((sum, curr) => sum + curr, 0));
    });
}

exports.info = {
    name: "calorieCountThree",
    desc: "Find the three elves carrying the most calories in total!",
    day: 1,
    defaultData: "calories.txt",
}