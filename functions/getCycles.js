const prompts = require("prompts");
const fs = require('fs');

const reg = {x: 1};
let cycle = 1;
let sum = 0;

function increment(count) {
    for (let i = 1; i <= count; i++) {
        if (cycle % 40 == 20) {
            sum += reg.x * cycle;
        }
        cycle++;
    }
}

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
        for (const l of textLines) {
            if (l.startsWith("noop")) {
                increment(1);
            } else if (l.startsWith("addx")) {
                let val = parseInt(l.slice(5));
                increment(2);
                reg.x += val;
            }
        }
        console.log(sum);
    });
}

exports.info = {
    name: "getCycles",
    desc: "Sum the \"interesting\" CPU cycle values!",
    day: 10,
    defaultData: "assembly.txt",
}