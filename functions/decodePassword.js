const prompts = require("prompts");
const fs = require('fs');

const DIR_U = {r: -1, c: 0};
const DIR_D = {r: 1, c: 0};
const DIR_L = {r: 0, c: -1};
const DIR_R = {r: 0, c: 1};

const VOID = false;
const PATH = " ";
const WALL = "█";

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
        let grid = [];
        for (let i = 0; i < textLines.length - 2; i++) {
            let gridLine = textLines[i].split("").map((e) => {
                switch(e) {
                    case ".": return PATH;
                    case "#": return WALL;
                    default:  return VOID;
                }
            });
            grid.push(gridLine);
        }

        let pos = {r: 0, c: grid[0].findIndex((e) => e === PATH)};
        let facing = DIR_R;
        let iter = textLines[textLines.length - 1].matchAll(/\d+|L|R/gi);

        for (const instruction of iter) {
            switch (instruction[0]) {
                case "L":
                case "R": {
                    switch (facing) {
                        case DIR_U: facing = (instruction[0] == "L" ? DIR_L : DIR_R); break;
                        case DIR_R: facing = (instruction[0] == "L" ? DIR_U : DIR_D); break;
                        case DIR_D: facing = (instruction[0] == "L" ? DIR_R : DIR_L); break;
                        case DIR_L: facing = (instruction[0] == "L" ? DIR_D : DIR_U); break;
                    }
                    break;
                }
                default: {
                    let moves = parseInt(instruction[0]);
                    while (moves > 0) {
                        let newPos = {r: pos.r + facing.r, c: pos.c + facing.c}
                        // void check
                        if (!grid[newPos.r] || !grid[newPos.r][newPos.c]) {
                            let wrapPos = {r: pos.r, c: pos.c};
                            while (grid[wrapPos.r] && grid[wrapPos.r][wrapPos.c]) {
                                wrapPos.r -= facing.r;
                                wrapPos.c -= facing.c;
                            }
                            newPos.r = wrapPos.r + facing.r;
                            newPos.c = wrapPos.c + facing.c;
                        }

                        // wall check
                        if (grid[newPos.r][newPos.c] === WALL) {
                            break;
                        } else {
                            pos.r = newPos.r;
                            pos.c = newPos.c;
                            moves--;
                        }
                    }
                    break;
                }
            }
        }

        console.log(1000*(pos.r + 1) + 4*(pos.c + 1) + (facing == DIR_R ? 0 : facing == DIR_D ? 1 : facing == DIR_L ? 2 : 3));
    });
}

exports.info = {
    name: "decodePlanarPassword",
    desc: "Decode the flat force field's password!",
    day: 22,
    defaultData: "password.txt",
}