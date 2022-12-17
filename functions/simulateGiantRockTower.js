const prompts = require("prompts");
const fs = require('fs');

const ROCK = "█";
const WALL = "|";
const VOID = " ";

const LEFT = "<".charCodeAt(0);
const LEN = 7;
const LIMIT = 1000000000000;

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
    row[0] = WALL;
    row[LEN + 1] = WALL;
    return row;
}

function tracePath() {

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
        let grid = [new Array(LEN + 2).fill(WALL), newRow(), newRow(), newRow(), newRow()];
        let rockCount = 0;
        let high = 4;
        let trueHeight = high - 4;
        let currType = 0;
        let currLLPos = {x: 3, y: high};

        while (rockCount < LIMIT) {
            for (const b of buff) {
                // handle jetstream movement
                let shift = (b == LEFT ? -1 : 1);
                let shiftSafe = true;
                for (let dy = 0; dy < ROCKS[currType].h; dy++) {
                    for (let dx = 0; dx < ROCKS[currType].w; dx++) {
                        if (currLLPos.y + dy < grid.length && ROCKS[currType].pattern[dy][dx] != VOID && grid[currLLPos.y + dy][currLLPos.x + dx + shift] != VOID) {
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
                        if (currLLPos.y + dy < grid.length && ROCKS[currType].pattern[dy][dx] != VOID && grid[currLLPos.y + dy - 1][currLLPos.x + dx] != VOID) {
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
                            if (ROCKS[currType].pattern[dy][dx] != VOID)
                                grid[currLLPos.y + dy][currLLPos.x + dx] = ROCK;
                        }
                    }

                    // remove "blocked" sections from bottom to reduce grid size
                    let lowY = 0;
                    let stack = [];
                    let vis = [];
                    for (let y = grid.length - 1; y >= 1; y--) {
                        if (grid[y][1] == ROCK) {
                            stack.push(`1,${y},${y}`);
                            vis.push(`1,${y}`);
                            break;
                        }
                    }
                    while (stack.length > 0) {
                        let curr = stack.pop().split(",").map((e) => parseInt(e));
                        if (curr[0] == 7 || curr[2] == 0) {
                            lowY = curr[2];
                            break;
                        }

                        // traverse rock positions
                        if (grid[curr[1]][curr[0]-1] == ROCK && !vis.includes(`${curr[0]-1},${curr[1]}`)) {
                            stack.push(`${curr[0]-1},${curr[1]},${Math.min(curr[2], curr[1])}`);
                            vis.push(`${curr[0]-1},${curr[1]}`);
                        }
                        if (grid[curr[1]-1][curr[0]] == ROCK && !vis.includes(`${curr[0]},${curr[1]-1}`)) {
                            stack.push(`${curr[0]},${curr[1]-1},${Math.min(curr[2], curr[1]-1)}`);
                            vis.push(`${curr[0]},${curr[1]-1}`);
                        }
                        if (curr[1]+1 < grid.length && grid[curr[1]+1][curr[0]] == ROCK && !vis.includes(`${curr[0]},${curr[1]+1}`)) {
                            stack.push(`${curr[0]},${curr[1]+1},${Math.min(curr[2], curr[1]+1)}`);
                            vis.push(`${curr[0]},${curr[1]+1}`);
                        }
                        if (grid[curr[1]][curr[0]+1] == ROCK && !vis.includes(`${curr[0]+1},${curr[1]}`)) {
                            stack.push(`${curr[0]+1},${curr[1]},${Math.min(curr[2], curr[1])}`);
                            vis.push(`${curr[0]+1},${curr[1]}`);
                        }
                    }
                    for (let i = 0; i < lowY; i++) {
                        grid.shift();
                    }
                    high -= lowY;

                    // increase grid height, if necessary
                    let origHeight = grid.length;
                    for (let i = origHeight - 4; i < origHeight; i++) {
                        if (grid[i].filter((e) => e != VOID).length > 2) {
                            grid.push(newRow());
                            high++;
                            trueHeight++;
                        }
                    }

                    // generate next rock
                    rockCount++;
                    currType = (currType + 1) % ROCKS.length;
                    currLLPos = {x: 3, y: high};

                    // check if loop needs to be broken
                    if (rockCount >= LIMIT) break;
                    if (rockCount % 100000 == 0)
                        console.log(`${rockCount} rocks placed`);
                }
            }
        }
        console.log(trueHeight);
    });
}

exports.info = {
    name: "simulateGiantRockTower",
    desc: "(INCOMPLETE) Determine how high the rock tower will be after 1000000000000 rocks have fallen!",
    day: 17,
    defaultData: "jetstream.txt",
}