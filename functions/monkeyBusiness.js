const prompts = require("prompts");
const fs = require('fs');

function increaseWorry(oper, worry) {
    let val;
    switch (oper[1]) {
        case "old": val = worry; break;
        default: val = parseInt(oper[1]); break;
    }
    switch (oper[0]) {
        case "*": return worry * val;
        default: return worry + val;
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

        let monkeys = [];

        // initialize monkeys
        let textLines = text.toString().split("\n");
        for (let i = 0; i < textLines.length; i += 7) {
            let monkey = {
                inspections: 0,
                items: textLines[i+1].split(": ")[1].split(", ").map((e) => parseInt(e)),
                oper: textLines[i+2].match(/old [*+] (?:old|\d+)/i)[0].split(" "),
                test: parseInt(textLines[i+3].match(/divisible by (\d+)/i)[1]),
                throw: {
                    true: parseInt(textLines[i+4].match(/throw to monkey (\d+)/i)[1]),
                    false: parseInt(textLines[i+5].match(/throw to monkey (\d+)/i)[1]),
                }
            }
            monkey.oper.shift();
            monkeys.push(monkey);
        }

        // run monkey algorithm
        for (let n = 1; n <= 20; n++) {
            for (let m = 0; m < monkeys.length; m++) {
                while (monkeys[m].items.length > 0) {
                    let item = increaseWorry(monkeys[m].oper, monkeys[m].items.shift());
                    item = Math.floor(item/3);
                    if (item % monkeys[m].test == 0)
                        monkeys[monkeys[m].throw.true].items.push(item);
                    else
                        monkeys[monkeys[m].throw.false].items.push(item);
                    monkeys[m].inspections++;
                }
            }
        }

        // find top 2 monkeys
        let max = [];
        let cap = 2;
        for (const m of monkeys) {
            if (max.length < cap || m.inspections > max[cap - 1]) {
                if (max.length >= cap)
                    max.pop();
                max.push(m.inspections);
                max.sort((a, b) => a === b ? 0 : b - a);
            }
        }

        console.log(max.reduce((acc, curr) => acc *= curr, 1));
    });
}

exports.info = {
    name: "monkeyBusiness",
    desc: "Find the monkey business level after the monkeys throw things around for 20 rounds!",
    day: 11,
    defaultData: "monkeys.txt",
}