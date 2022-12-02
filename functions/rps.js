const prompts = require("prompts");
const fs = require('fs');

function validateFile(file) {
    fileExists = fs.existsSync(`./inputs/${file}`);
    return fileExists ? true : "Invalid file name."
}

exports.run = async function() {
    const input = await prompts({
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        validate: validateFile,
    })

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        let textLines = text.toString().split("\n");
        let score = 0;
        for (const l of textLines) {
            let roundScore = 0;
            let choices = l.toUpperCase().split(" ");
            switch (choices[0]) {
                case "A": roundScore = 3; break;
                case "B": roundScore = 0; break;
                default:  roundScore = 6; break;
            }
            switch (choices[1]) {
                case "Y": roundScore += 4; break;
                case "Z": roundScore += 8; break;
                default:  roundScore += 0; break;
            }
            roundScore = (roundScore % 9) + 1;
            score += roundScore;
        }
        console.log(score);
    });
}

exports.info = {
    name: "rpsShape",
    day: 2,
    desc: "Calculate the total expected score for your shape-based rock-paper-scissors strategy!"
}