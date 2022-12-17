const prompts = require("prompts");
const fs = require('fs');

const START = "AA";

exports.run = async function() {
    const input = await prompts({
        type: "text",
        name: "file",
        message: "Name of file to read (from ./inputs):",
        initial: exports.info.defaultData,
        validate: (file) => {fileExists = fs.existsSync(`./inputs/${file}`); return fileExists ? true : "Invalid file name."},
    });

    fs.readFile(`./inputs/${input.file}`, (e, text) => {
        if (e) throw e;

        let textLines = text.toString().split("\n");
        let valves = new Map();
        let valvePaths = new Map();
        let searchStack = [START];

        // extract valve info
        for (const l of textLines) {
            let valve = l.match(/Valve (.+) has flow rate=(\d+);.+valves? (.+)/mi);
            valves.set(valve[1], {flow: parseInt(valve[2]), next: valve[3].split(", ")});
            if (parseInt(valve[2]) > 0)
                searchStack.push(valve[1]);
        }

        // use BFS to get shortest paths between each value and its nearest non-zero flow neighbours
        while (searchStack.length > 0) {
            let start = searchStack.pop();
            let ssQueue = [{v: start, len: 0}];
            let visited = [];
            let ssPairs = [];
            while (ssQueue.length > 0) {
                let curr = ssQueue.shift();
                let currValve = valves.get(curr.v);
                visited.push(curr.v);
                if (curr.v != start && currValve.flow > 0 && !ssPairs.some((p) => p[0] == curr.v)) {
                    ssPairs.push([curr.v, curr.len]);
                } else {
                    for (const next of currValve.next) {
                        if (!visited.includes(next))
                            ssQueue.push({v: next, len: curr.len + 1});
                    }
                }
            }
            valvePaths.set(start, ssPairs);
        }

        // find highest expected values
        // this is risky, but i'm willing to try it since a standard traversal is proving to be VERY inefficient
        /*let queue = [{v: START, time: 30, acc: 0, visited: []}];
        let maxRelease = 0;
        while (queue.length > 0) {
            let curr = queue.shift();
            let currValve = valves.get(curr.v);
            let paths = valvePaths.get(curr.v)
            paths = paths.filter((p) => !curr.visited.includes(p[0])).sort((a, b) => {
                let aValve = valves.get(a[0]);
                let bValve = valves.get(b[0]);
                return (curr.time-b[1]-1)*bValve.flow - (curr.time-a[1]-1)*aValve.flow;
            });

            let openValve = false;
            if (currValve.flow > 0 && curr.time >= 1 && !curr.visited.includes(curr.v))
                openValve = true;
            
            let newVis = curr.visited.slice();
            newVis.push(curr.v);
            if(curr.time >= 0 && paths.some((p) => !curr.visited.includes(p[0]))) {
                let ctr = 0;
                for (let i = 0, uniqueVals = []; i < paths.length && uniqueVals.length < 7; i++) {
                    let path = paths[i];
                    if (openValve)
                        queue.push({v: path[0], time: curr.time - 1 - path[1], acc: curr.acc + (curr.time - 1)*currValve.flow, visited: newVis});
                    else
                        queue.push({v: path[0], time: curr.time - path[1], acc: curr.acc, visited: newVis});

                    let sortVal = (curr.time - path[1] - 1) * valves.get(path[0]).flow;
                    if (!uniqueVals.includes(sortVal))
                        uniqueVals.push(sortVal);
                    ctr++;
                }
                //console.log(`${curr.v} added ${ctr} paths`);
            } else {
                if (openValve)
                    curr.acc += (curr.time - 1)*currValve.flow;
                if (curr.acc > maxRelease)
                    maxRelease = curr.acc;
            }
        }*/

        // do traversal using BFS paths (hopefully this will be more efficient)
        let queue = [{v: START, time: 30, acc: 0, visited: []}];
        let maxRelease = 0;
        let pushCtr = textLines.length;
        while (queue.length > 0) {
            let curr = queue.shift();
            let currValve = valves.get(curr.v);
            let newVis = curr.visited.slice();
            let openValve = false;
            if (currValve.flow > 0 && curr.time >= 1 && !curr.visited.includes(curr.v)) {
                openValve = true;
            }
            newVis.push(curr.v);
            
            let paths = valvePaths.get(curr.v);
            if (curr.time >= 0 && paths.some((p) => !curr.visited.includes(p[0]))) {
                for (const path of paths) {
                    if (!curr.visited.includes(path[0])) {
                        queue.push({v: path[0], time: curr.time - path[1], acc: curr.acc, visited: newVis});
                        if (openValve) {
                            queue.push({v: path[0], time: curr.time - 1 - path[1], acc: curr.acc + (curr.time - 1)*currValve.flow, visited: newVis});
                        }
                    }
                }
            } else {
                if (openValve)
                    curr.acc += (curr.time - 1)*currValve.flow;
                if (curr.acc > maxRelease)
                    maxRelease = curr.acc;
            }
        }
        console.log(maxRelease);
    });
}

exports.info = {
    name: "releaseVolcanoPressure",
    desc: "(INCOMPLETE) Determine the maximum amount of pressure that could be released from the volcano!",
    day: 16,
    defaultData: "volcano.txt",
}