const prompts = require("prompts");
const fs = require('fs');

exports.run = async function() {
    const input = await prompts({
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    });

    fs.readFile(`./inputs/${input.file}`, (e, buff) => {
        if (e) throw e;

        let textLines = buff.toString().split("\n").map((v, i) => `${i}:${v}`);
        let mixed = textLines.slice();
        let sum = 0;
        let hits = 0;

        // mix
        for (const l of textLines) {
            let item = l.split(":");
            let currIndex = mixed.findIndex((e) => e == l);
            if (currIndex === -1) {
                return console.log("Uh oh, something went wrong!");
            } else {
                let shift = parseInt(item[1]);
                if (shift > 0 && (currIndex + shift) % mixed.length < currIndex) {
                    hits++;
                    shift = ((shift + 1) % mixed.length) - mixed.length;
                }

                let newIndex = (((currIndex + shift) % mixed.length) + mixed.length) % mixed.length; // true modulo
                if (newIndex != currIndex) {
                    let elem;
                    if (shift < 0)
                        elem = mixed.splice(currIndex, 1, null);
                    else
                        elem = mixed.splice(currIndex, 1);
                    
                    if (newIndex == 0)
                        mixed.push(elem[0]); // place at end instead
                    else
                        mixed.splice(newIndex, 0, elem[0]);
                    
                    mixed = mixed.filter((e) => e !== null);
                }
            }
        }

        console.log(hits);
        
        // compute sum
        let zeroIndex = mixed.findIndex((e) => parseInt(e.split(":")[1]) === 0);
        if (zeroIndex !== -1) {
            let sumArr = [];
            for (let i = 1000; i <= 3000; i += 1000) {
                let index = (zeroIndex + i) % mixed.length;
                sumArr.push(mixed[index].split(":")[1]);
                sum += parseInt(mixed[index].split(":")[1]);
            }
            console.log(`${sumArr.join(" + ")} = ${sum}`);
        } else {
            return console.log("No element with value 0 found!");
        }
    });
}

exports.info = {
    name: "sumGroveCoordinates",
    desc: "Mix and sum the coordinates of the star fruit grove!",
    day: 20,
    defaultData: "coordinates.txt",
}