const prompts = require("prompts");
const fs = require('fs');

const UP = {x: 0, y: 1};
const DOWN = {x: 0, y: -1};
const LEFT = {x: -1, y: 0};
const RIGHT = {x: 1, y: 0};
const NONE = {x: 0, y: 0};

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
        let head = {x: 0, y: 0};
        let tail = {x: 0, y: 0};
        let visited = [NONE];

        for (const l of textLines) {
            let rawIns = l.split(" ");
            let instruction;
            switch(rawIns[0]) {
                case "U": instruction = UP; break;
                case "D": instruction = DOWN; break;
                case "L": instruction = LEFT; break;
                case "R": instruction = RIGHT; break;
                default: instruction = NONE; break;
            }

            for (let i = 1; i <= rawIns[1]; i++) {
                head.x += instruction.x;
                head.y += instruction.y;
                if (Math.abs(head.x - tail.x) >= 2 || Math.abs(head.y - tail.y) >= 2) {
                    // move tail
                    if (head.x !== tail.x) {
                        // head and tail in different columns, move left/right
                        tail.x += Math.sign(head.x - tail.x);
                    }
                    if (head.y !== tail.y) {
                        // head and tail in different rows, move up/down
                        tail.y += Math.sign(head.y - tail.y);
                    }
                    // add new tail position to visited positions if not already visited
                    if (!visited.some((e) => e.x === tail.x && e.y === tail.y)) {
                        visited.push({x: tail.x, y: tail.y});
                    }
                }
            }
        }
        console.log(visited.length);
    });
}

exports.info = {
    name: "followShortRope",
    desc: "Count the number of unique positions the 2-node rope's tail visits!",
    day: 9,
    defaultData: "rope.txt",
}