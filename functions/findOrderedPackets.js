const prompts = require("prompts");
const fs = require('fs');

function parseList(elem) {
    let base = elem.slice(1, -1).split("");
    let parsed = [];
    let parity = 0;
    let temp = "";
    for (const c of base) {
        switch (c) {
            case "[": parity++; temp += c; break;
            case "]": parity--; temp += c; break;
            case ",": {
                if (parity === 0) {
                    parsed.push(temp);
                    temp = "";
                    break;
                }
            }
            default: temp += c; break;
        }
    }
    if (temp !== "")
        parsed.push(temp);
    return parsed;
}
function isList(elem) {
    return elem.startsWith("[") && elem.endsWith("]");
}
function listify(elem) {
    return `[${elem}]`;
}

function compare(a, b) {
    if (isList(a) && isList(b)) {
        let list_a = parseList(a);
        let list_b = parseList(b);
        for (let i = 0; i < Math.min(list_a.length, list_b.length); i++) {
            let res = compare(list_a[i], list_b[i])
            if (res !== 0)
                return res;
        }
        return Math.sign(list_b.length - list_a.length)
    } else if (!isList(a) && !isList(b)) {
        let int_a = parseInt(a);
        let int_b = parseInt(b);
        return int_a === int_b ? 0 : (int_a < int_b ? 1 : -1);
    } else {
        if (!isList(a))
            return compare(listify(a), b);
        else
            return compare(a, listify(b));
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
        let sum = 0;
        for (let i = 0, j = 1; i < textLines.length; i += 3, j++) {
            if (compare(textLines[i], textLines[i+1]) === 1) {
                sum += j;
            }
        }
        console.log(sum);
    });
}

exports.info = {
    name: "findOrderedPackets",
    desc: "Sum the indices of the correctly-ordered packet pairs!",
    day: 13,
    defaultData: "signalpackets.txt",
}