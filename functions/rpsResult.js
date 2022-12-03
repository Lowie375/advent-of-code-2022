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
        let score = 0;
        for (const l of textLines) {
            let baseScore = 0;
            let playScore = 0;
            let choices = l.toUpperCase().split(" ");
            switch (choices[1]) {
                case "X": baseScore = 0; playScore = 2; break;
                case "Y": baseScore = 3; playScore = 0; break;
                default:  baseScore = 6; playScore = 1; break;
            }
            switch (choices[0]) {
                case "B": playScore += 1; break;
                case "C": playScore += 2; break;
                default:  playScore += 0; break;
            }
            playScore = (playScore % 3) + 1;
            score += (baseScore + playScore);
        }
        console.log(score);
    });
}

exports.info = {
    name: "rpsResult",
    desc: "Calculate the total expected score for your result-based rock-paper-scissors strategy!",
    day: 2,
    defaultData: "rps.txt",
}