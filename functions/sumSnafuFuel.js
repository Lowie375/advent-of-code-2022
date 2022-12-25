const prompts = require("prompts");
const fs = require('fs');

function snafuToDec(num) {
    let digits = num.split("");
    let dec = 0;
    for (let x = 0, d = digits.length - 1; x < digits.length; x++, d--) {
        let base = Math.pow(5, x);
        let digit;
        switch (num[d]) {
            case "-": digit = -1; break;
            case "=": digit = -2; break;
            default: digit = parseInt(num[d]); break;
        }
        dec += digit*base;
    }
    return dec;
}

function decToSnafu(num) {
    let snafu = "";
    for (let currNum = num; currNum > 0; currNum /= 5) {
        // take constrained modulo
        let mod = currNum % 5;
        while (mod > 2) mod -= 5;
        while (mod < -2) mod += 5;
        
        // encode result as character
        let char = "";
        switch (mod) {
            case -2: char = "="; break;
            case -1: char = "-"; break;
            default: char = mod.toString(); break;
        }
        snafu = char + snafu;
        currNum -= mod;
    }
    return snafu;
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

        // we love balanced quinary in this household!
        let textLines = buff.toString().split("\n");
        let sum = 0;

        for (const l of textLines)
            sum += snafuToDec(l);
        console.log(decToSnafu(sum));
    });
}

exports.info = {
    name: "sumSnafuFuel",
    desc: "Total the amount of fuel the elves have using SNAFU numbers!",
    day: 25,
    defaultData: "snafu.txt",
}