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
        for (const l of textLines) {
            let chars = l.split("");
            let sack1 = chars.slice(0, (chars.length)/2);
            let sack2 = chars.slice((chars.length)/2);

            let duplicates = sack1.filter(i => sack2.includes(i));
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
    name: "sumSortPriority",
    desc: "Sum the sorting priorities of the badly-sorted rucksack items!",
    day: 3,
    defaultData: "rucksack.txt",
}