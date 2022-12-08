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

        let textLines = text.toString().split("\n");
        let dim = {width: textLines[0].length, height: textLines.length};
        let verticalLines = [];
        let grid = [];
        for (let i = 0; i < dim.width; i++) {
            verticalLines[i] = [];
            grid[i] = new Array(dim.height);
            grid[i].fill(false);
        }

        // iterate over rows
        for (let y = 0; y < dim.height; y++) {
            let leftMax = -1;
            let rightMax = -1;
            let splitLine = textLines[y].split("");
            for (let x = 0; x < dim.width; x++) {
                // check left + right positions (if unmarked)
                if (leftMax < 9 && !grid[x][y] && parseInt(splitLine[x]) > leftMax) {
                    grid[x][y] = true;
                    
                }
                if (rightMax < 9 && !grid[dim.width-x-1][y] && parseInt(splitLine[dim.width-x-1]) > rightMax) {
                    grid[dim.width-x-1][y] = true;
                    
                }

                // update maximums
                leftMax = Math.max(leftMax, parseInt(splitLine[x]));
                rightMax = Math.max(rightMax, parseInt(splitLine[dim.width-x-1]));

                // push values to corresponding verticalLines columns
                verticalLines[x].push(splitLine[x]);
            }
        }
        // iterate over columns
        for (let x = 0; x < dim.width; x++) {
            let upperMax = -1;
            let lowerMax = -1;
            let splitLine = verticalLines[x];
            for (let y = 0; y < dim.height; y++) {
                // check left position (if unmarked)
                if (upperMax < 9 && !grid[x][y] && parseInt(splitLine[y]) > upperMax) {
                    grid[x][y] = true;
                }
                // check right position (if unmarked)
                if (lowerMax < 9 && !grid[x][dim.height-y-1] && parseInt(splitLine[dim.height-y-1]) > lowerMax) {
                    grid[x][dim.height-y-1] = true;
                }

                // update maximums
                upperMax = Math.max(upperMax, parseInt(splitLine[y]));
                lowerMax = Math.max(lowerMax, parseInt(splitLine[dim.height-y-1]));
            }
        }

        // reduce to return value
        let summedGrid = [];
        for (let i = 0; i < grid.length; i++) {
            summedGrid[i] = grid[i].reduce((acc, curr) => acc + (curr ? 1 : 0), 0)
        }
        console.log(summedGrid.reduce((acc, curr) => acc + curr, 0));
    });
}

exports.info = {
    name: "skyscraperTrees",
    desc: "Find the number of trees on the map that are visible according to skyscraper sudoku rules!",
    day: 8,
    defaultData: "trees.txt",
}