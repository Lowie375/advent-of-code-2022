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
        let stacks = [[]];
        let dataLines = [];
        let instructionMode = false;
        for (const l of textLines) {
            if (!instructionMode) {
                // handle crate data creation
                if (l.trim() == "" && dataLines.length > 0) {
                    // import crate data
                    let numLine = dataLines[dataLines.length - 1];
                    let stackCount = numLine.split(/ +/).filter((e) => !isNaN(parseInt(e))).reduce((max, e) => max = Math.max(max, parseInt(e)), 0);
                    for (let i = 0; i < stackCount; i++)
                        stacks[i] = [];
                    for (let i = 0; i < dataLines.length - 1; i++) {
                        let splitLine = dataLines[i].concat(" ").matchAll(/(?: ( ) ) |(?:\[([A-Z])\]) /ig);
                        let j = 0;
                        for (const match of splitLine) {
                            if (match[2])
                                stacks[j].unshift(match[2]);
                            j++;
                        }
                    }
                    instructionMode = true;
                } else {
                    dataLines.push(l);
                }
            } else {
                // handle move instruction
                let instruction = l.split(" ").filter((e) => !isNaN(parseInt(e))); // count, fromStack, toStack
                let movedStack = [];
                for(let i = 1; i <= parseInt(instruction[0]); i++) {
                    let crate = stacks[parseInt(instruction[1]) - 1].pop();
                    movedStack.push(crate);
                }
                movedStack.reverse();
                for(let i = 0; i < movedStack.length; i++) {
                    stacks[parseInt(instruction[2]) - 1].push(movedStack[i]);
                }
            }
        }
        console.log(stacks.reduce((acc, arr) => acc += arr.pop(), ""));
    });
}

exports.info = {
    name: "supplyStack9001",
    desc: "Find the top crate in each supply stack after the crates have been moved using the multi-moving machine!",
    day: 5,
    defaultData: "crates.txt",
}