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
        let visited = [NONE];
        let nodes = new Array(10);
        for (let i = 0; i < nodes.length; i++) {
            nodes[i] = {x: 0, y: 0};
        }

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
                // move head
                nodes[0].x += instruction.x;
                nodes[0].y += instruction.y;

                for (let n = 1; n < nodes.length; n++) {
                    if (Math.abs(nodes[n-1].x - nodes[n].x) >= 2 || Math.abs(nodes[n-1].y - nodes[n].y) >= 2) {
                        // move node
                        if (nodes[n-1].x !== nodes[n].x) {
                            // node and predecessor in different columns, move left/right
                            nodes[n].x += Math.sign(nodes[n-1].x - nodes[n].x);
                        }
                        if (nodes[n-1].y !== nodes[n].y) {
                            // node and predecessor in different rows, move up/down
                            nodes[n].y += Math.sign(nodes[n-1].y - nodes[n].y);
                        }
                    }
                }
                // add new tail position to visited positions if not already visited
                if (!visited.some((e) => e.x === nodes[nodes.length-1].x && e.y === nodes[nodes.length-1].y)) {
                    visited.push({x: nodes[nodes.length-1].x, y: nodes[nodes.length-1].y});
                }
            }
        }
        console.log(visited.length);
    });
}

exports.info = {
    name: "followLongRope",
    desc: "Count the number of unique positions the 10-node rope's tail visits!",
    day: 9,
    defaultData: "rope.txt",
}