const prompts = require("prompts");
const fs = require('fs');

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;

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

// debug
function print(name, offset = "") {
    let monkey = monkeys.get(name);
    console.log(`${offset}${name}: ${monkey.oper ? monkey.oper : monkey.number}${monkey.human == LEFT ? " (L)" : monkey.human == RIGHT ? " (R)" : ""}`);
    if (monkey.left && monkey.right) {
        print(monkey.left, offset + "  ");
        print(monkey.right, offset + "  ");
    }
}

function findHuman(name) {
    let monkey = monkeys.get(name);
    if (!monkey.oper)
        return name === "humn";

    if (findHuman(monkey.left)) {
        monkey.human = LEFT;
        monkeys.set(name, monkey);
        return true;
    } else if (findHuman(monkey.right)) {
        monkey.human = RIGHT;
        monkeys.set(name, monkey);
        return true;
    }
}

function unwindMath(name, target) {
    if (name == "humn")
        return target;

    let monkey = monkeys.get(name);
    let operand = getNum(monkey.human == LEFT ? monkey.right : monkey.left);
    switch (monkey.oper) {
        case "+":
            return unwindMath(monkey.human == LEFT ? monkey.left : monkey.right, target - operand);
        case "*":
            return unwindMath(monkey.human == LEFT ? monkey.left : monkey.right, target / operand);         
        case "-":
            if (monkey.human == LEFT)
                return unwindMath(monkey.left, operand + target);
            else
                return unwindMath(monkey.right, operand - target);
        case "/":
            if (monkey.human == LEFT)
                return unwindMath(monkey.left, operand * target);
            else
                return unwindMath(monkey.right, operand / target);
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
                    number: monkey[1] === "humn" ? 0 : parseInt(monkey[5]),
                });
            } else {
                monkeys.set(monkey[1], {
                    left: monkey[2],
                    oper: monkey[1] === "root" ? "=" : monkey[3],
                    right: monkey[4],
                    human: NONE,
                })
            }
        }

        if (findHuman("root")) {
            let root = monkeys.get("root");
            switch(root.human) {
                case LEFT: console.log(unwindMath(root.left, getNum(root.right))); break;
                case RIGHT: console.log(unwindMath(root.right, getNum(root.left))); break;
                default: console.log("Human not found!"); break;
            }
        } else {
            console.log("Human not found!")
        }

        //print("root");
    });
}

exports.info = {
    name: "calculateHumanNumber",
    desc: "Determine what number you need to yell so that the root monkey's equality check passes!",
    day: 21,
    defaultData: "monkeymath.txt",
}