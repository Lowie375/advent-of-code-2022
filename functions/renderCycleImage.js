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

        let regX = 1;
        let cycle = 0;
        let image = [];

        let increment = (count) => {
            for (let i = 1; i <= count; i++) {
                if (Math.floor(cycle/40) >= image.length)
                    image.push("");

                let px = (cycle % 40);
                if (regX - 1 <= px && px <= regX + 1)
                    image[Math.floor(cycle/40)] += "█";
                else
                    image[Math.floor(cycle/40)] += " ";
                cycle++;
            }
        }

        let textLines = text.toString().split("\n");
        for (const l of textLines) {
            if (l.startsWith("noop")) {
                increment(1);
            } else if (l.startsWith("addx")) {
                let val = parseInt(l.slice(5));
                increment(2);
                regX += val;
            }
        }
        for (const row of image) {
            console.log(row);
        }
    });
}

exports.info = {
    name: "renderCycleImage",
    desc: "Render the image produced by running the provided instructions on the CPU!",
    day: 10,
    defaultData: "assembly.txt",
}