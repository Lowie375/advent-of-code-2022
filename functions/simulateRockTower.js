const prompts = require("prompts");
const fs = require('fs');

const ROCK = "█";
const VOID = " ";

const LEFT = "<".charCodeAt(0);
const LEN = 7;
const LIMIT = 2022;

const ROCKS = [
    {w: 4, h: 1,
        pattern: [[ROCK, ROCK, ROCK, ROCK]]},
    {w: 3, h: 3,
        pattern: [[VOID, ROCK, VOID],
                  [ROCK, ROCK, ROCK],
                  [VOID, ROCK, VOID]]},
    {w: 3, h: 3,
        pattern: [[ROCK, ROCK, ROCK],
                  [VOID, VOID, ROCK],
                  [VOID, VOID, ROCK]]},
    {w: 1, h: 4,
        pattern: [[ROCK],
                  [ROCK],
                  [ROCK],
                  [ROCK]]},
    {w: 2, h: 2,
        pattern: [[ROCK, ROCK],
                  [ROCK, ROCK]]}
];

function newRow() {
    let row = new Array(LEN + 2).fill(VOID, 1, -1);
    row[0] = ROCK;
    row[LEN + 1] = ROCK;
    return row;
}

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

        // we're using the buffer today because it's simpler! yeah!
        let grid = [new Array(LEN + 2).fill(ROCK), newRow(), newRow(), newRow(), newRow()];
        let rockCount = 0;
        let high = 4;
        let currType = 0;
        let currLLPos = {x: 3, y: high};

        while (rockCount < LIMIT) {
            for (const b of buff) {
                // handle jetstream movement
                let shift = (b == LEFT ? -1 : 1);
                let shiftSafe = true;
                for (let dy = 0; dy < ROCKS[currType].h; dy++) {
                    for (let dx = 0; dx < ROCKS[currType].w; dx++) {
                        if (currLLPos.y + dy < grid.length && ROCKS[currType].pattern[dy][dx] == ROCK && grid[currLLPos.y + dy][currLLPos.x + dx + shift] == ROCK) {
                            shiftSafe = false;
                            break;
                        }
                    }
                }
                if (shiftSafe)
                    currLLPos.x += shift;

                // handle downwards movement
                let downSafe = true;
                for (let dy = 0; dy < ROCKS[currType].h; dy++) {
                    for (let dx = 0; dx < ROCKS[currType].w; dx++) {
                        if (currLLPos.y + dy < grid.length && ROCKS[currType].pattern[dy][dx] == ROCK && grid[currLLPos.y + dy - 1][currLLPos.x + dx] == ROCK) {
                            downSafe = false;
                            break;
                        }
                    }
                }
                if (downSafe) {
                    currLLPos.y -= 1;
                } else {
                    // place rock
                    for (let dy = 0; dy < ROCKS[currType].h; dy++) {
                        for (let dx = 0; dx < ROCKS[currType].w; dx++) {
                            if (ROCKS[currType].pattern[dy][dx] == ROCK)
                                grid[currLLPos.y + dy][currLLPos.x + dx] = ROCK;
                        }
                    }

                    // increase grid height, if necessary
                    let origHeight = grid.length;
                    for (let i = origHeight - 4; i < origHeight; i++) {
                        if (grid[i].filter((e) => e == ROCK).length > 2) {
                            grid.push(newRow());
                            high++;
                        }
                    }

                    // generate next rock
                    rockCount++;
                    currType = (currType + 1) % ROCKS.length;
                    currLLPos = {x: 3, y: high};

                    // check if loop needs to be broken
                    if (rockCount >= LIMIT) break;
                }
            }
        }
        console.log(high - 4);
    });
}

exports.info = {
    name: "simulateRockTower",
    desc: "Determine how high the rock tower will be after 2022 rocks have fallen!",
    day: 17,
    defaultData: "jetstream.txt",
}