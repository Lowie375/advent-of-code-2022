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
        let sum = 0;
        for (let i = 0; i < textLines.length; i += 3) {
            let elves = [textLines[i].split(""), textLines[i+1].split(""), textLines[i+2].split("")];

            let duplicates = elves[0].filter(i => elves[1].includes(i) && elves[2].includes(i));
            let filtered = [];
            for (const c of duplicates) {
                if (!filtered.includes(c))
                    filtered.push(c);
            }

            for (const c of filtered) {
                let charNum = c.charCodeAt(0);
                if (97 <= charNum && charNum <= 122) {
                    // lowercase letters
                    sum += (charNum - 96);
                } else if (65 <= charNum && charNum <= 90) {
                    // uppercase letters
                    sum += (charNum - 64 + 26);
                }
            }
        }
        console.log(sum);
    });
}

exports.info = {
    name: "sumBadgePriority",
    desc: "Sum the priorities of the badges of each group of elves!",
    day: 3,
    defaultData: "rucksack.txt",
}