const prompts = require("prompts");
const fs = require('fs');

const TIME = 24;
const FILTER_INTERVAL = 100;

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

        let textLines = buff.toString().split("\n");
        let sum = 0;
        
        console.log("Hold tight: this may take a while.");

        for (const l of textLines) {
            let blueprint = l.match(/.+ (\d+).+costs (\d+).+costs (\d+).+costs (\d+).+and (\d+).+costs (\d+).+and (\d+)/mi).map((e) => parseInt(e));
            let ctr = 0;
            let highTime = 0;
            let maxGeodes = 0;
            let cost = [[blueprint[2], 0, 0], [blueprint[3], 0, 0], [blueprint[4], blueprint[5], 0], [blueprint[6], 0, blueprint[7]]];
            let queue = [{time: 0, prod: [1, 0, 0, 0], supply: [0, 0, 0, 0]}];
            while (queue.length > 0) {
                let curr = queue.shift();
                let timeChange = highTime != curr.time;
                ctr++;
                if (curr.time >= TIME) {
                    // update maximum geode production
                    maxGeodes = Math.max(curr.supply[3], maxGeodes);
                } else {
                    // determine possible robot building actions
                    let makeList = [-1];
                    for (let i = 0; i < cost.length; i++) {
                        if (cost[i].every((e, idx) => e <= curr.supply[idx]))
                            makeList.push(i);
                    }
                    // collect resources
                    for (let i = 0; i < 4; i++) {
                        curr.supply[i] += curr.prod[i];
                    }
                    // build robots + push new states
                    for (const action of makeList) {
                        let newState = {time: curr.time + 1, prod: curr.prod.slice(), supply: curr.supply.slice()};
                        switch (action) {
                            case -1: break; // do not build
                            default: {
                                for (let i = 0; i <= 2; i++)
                                    newState.supply[i] -= cost[action][i];
                                newState.prod[action]++;
                                break;
                            }
                        }
                        queue.push(newState);
                    }

                    // filter queue
                    if (ctr % FILTER_INTERVAL == 0 || timeChange) {
                        queue = queue.filter((e, ei) => {
                            let resourceFind = queue.findIndex((s) => e != s && e.time == s.time && s.prod.every((v, i) => v >= e.prod[i])
                                && s.supply.every((v, i) => v >= e.supply[i]) && (s.prod.some((v, i) => v > e.prod[i]) || s.supply.some((v, i) => v > e.supply[i])));
                            let geodeFind = queue.findIndex((s) => e != s && s.prod[3]*(TIME-s.time) + s.supply[3] > (e.prod[3]+TIME-e.time)*(TIME-e.time) + e.supply[3]);
                            let inefficientSpending = e.prod.some((r, ri) => ri <= 2 && r > cost.reduce((max, curr) => max = Math.max(curr[ri], max), 0));
                            return !inefficientSpending && resourceFind == -1 && geodeFind == -1;
                        });
                        highTime = curr.time;
                    }
                }
            }
            sum += blueprint[1] * maxGeodes;
            console.log(`Blueprint ${blueprint[1]}/${textLines.length} complete`);
        }
        console.log(sum);
    });
}

exports.info = {
    name: "sumBlueprintQuality",
    desc: "Sum the qualities of all the robot blueprints!",
    day: 19,
    defaultData: "blueprints.txt",
}