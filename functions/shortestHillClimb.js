const prompts = require("prompts");
const fs = require('fs');

function withinBounds(l, dl, max) {
    return l+dl >= 0 && l+dl < max
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
        let foundPoints = 0;
        let end = {x: -1, y: -1};
        let grid = [];
        let visited = [];
        let queue = [];

        // populate grid
        for (let y = 0; y < textLines.length; y++) {
            let gridLine = textLines[y].split("");
            let visitedLine = new Array(gridLine.length).fill(false);
            grid.push(gridLine);
            visited.push(visitedLine);
            if (foundPoints < 2) {
                for (let x = 0; x < gridLine.length; x++) {
                    if (grid[y][x] == "S") {
                        grid[y][x] = "a";
                        foundPoints++;
                    } else if (grid[y][x] == "E") {
                        grid[y][x] = "z";
                        end.x = x;
                        end.y = y;
                        foundPoints++;
                    }
                    if (foundPoints >= 2) break;
                }
            }
        }

        // reverse BFS
        queue.push({pos: end, len: 0});
        visited[end.y][end.x] = true;
        while (queue.length > 0) {
            let curr = queue.shift();

            if (grid[curr.pos.y][curr.pos.x] == "a")
                return console.log(curr.len); // end of BFS

            // add valid neighbours to queue
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (Math.abs(dx) != Math.abs(dy) && withinBounds(curr.pos.x, dx, grid[0].length) && withinBounds(curr.pos.y, dy, grid.length) && !visited[curr.pos.y+dy][curr.pos.x+dx]) {
                        // check adjacent positions
                        if (grid[curr.pos.y][curr.pos.x].charCodeAt(0) - 1 <= grid[curr.pos.y+dy][curr.pos.x+dx].charCodeAt(0)) {
                            queue.push({pos: {x: curr.pos.x+dx, y: curr.pos.y+dy}, len: curr.len + 1});
                            visited[curr.pos.y+dy][curr.pos.x+dx] = true;
                        }
                    }
                }
            }
        }
    });
}

exports.info = {
    name: "shortestHillClimb",
    desc: "Find the length of the shortest journey from any point at elevation a to point E!",
    day: 12,
    defaultData: "heightmap.txt",
}