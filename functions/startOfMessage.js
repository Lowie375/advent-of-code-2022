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

    fs.readFile(`./inputs/${input.file}`, (e, buff) => {
        if (e) throw e;

        // we're using the buffer today, yeah!
        let signalChars = [];
        let i = 1;
        for (const byte of buff) {
            // add to comparison array + check for matches
            if (signalChars.includes(byte)) {
                let index = signalChars.indexOf(byte);
                signalChars.splice(0, index+1);
            }
            signalChars.push(byte);
            // check for 14 unique characters
            if (signalChars.length == 14) {
                return console.log(i);
            }
            i++;
        }
        console.log("Start of transmission not found");
    });
}

exports.info = {
    name: "startOfMessage",
    desc: "Find the start-of-message marker in the elves' signal buffer!",
    day: 6,
    defaultData: "signalbuff.txt",
}