const prompts = require("prompts");
const fs = require('fs');

let monkeys = new Map();

function getNum(name) {
    let monkey = monkeys.get(name);
    switch (monkey.oper) {
        case "+": return getNum(monkey.left) + getNum(monkey.right);
        case "-": return getNum(monkey.left) - getNum(monkey.right);
        case "*": return getNum(monkey.left) * getNum(monkey.right);
        case "/": return getNum(monkey.left) / getNum(monkey.right);
        default: return monkey.number ? monkey.number : 0;
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

    fs.readFile(`./inputs/${input.file}`, (e, buff) => {
        if (e) throw e;

        let textLines = buff.toString().split("\n");
        for (const l of textLines) {
            let monkey = l.match(/(.{4}): (?:(.{4}) ([+\-\/*]) (.{4})|(\d+))/i);
            if (monkey[5] !== undefined) {
                monkeys.set(monkey[1], {
                    number: parseInt(monkey[5]),
                });
            } else {
                monkeys.set(monkey[1], {
                    left: monkey[2],
                    oper: monkey[3],
                    right: monkey[4],
                })
            }
        }

        console.log(getNum("root"));
    });
}

exports.info = {
    name: "monkeyMath",
    desc: "Determine what number the root monkey will yell!",
    day: 21,
    defaultData: "monkeymath.txt",
}