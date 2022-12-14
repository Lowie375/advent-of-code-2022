const prompts = require("prompts");
const fs = require('fs');

// get functions
const functionFiles = fs.readdirSync('./functions').filter(f => f.endsWith('.js'));
const selections = [];
const fxnMap = new Map();
let highestDay = 0;

for (const file of functionFiles) {
    const fxn = require(`./functions/${file}`);
    selections.push({
        title: `${fxn.info.day ? `D${fxn.info.day}: ` : ""}${fxn.info.name}`,
        description: `${fxn.info.desc ? fxn.info.desc : ""}`,
        value: fxn.info.name,
        sortOrder: fxn.info.day ? fxn.info.day : 0,
    });
    fxnMap.set(fxn.info.name, fxn);
    highestDay = (fxn.info.day > highestDay ? fxn.info.day : highestDay);
}
selections.sort((a, b) => a.sortOrder - b.sortOrder);

// debug
//prompts.inject(["simulateFloorSand", "cavetrace.txt", true]);

// prompt
(async () => {
    const input = await prompts({
        type: "autocomplete",
        name: "function",
        message: `Pick a function to run (up to D${highestDay}), or quit`,
        choices: selections,
        limit: 9,
        initial: 0,
        fallback: "No matching function found",
        suggest: (input, choices) => Promise.resolve(choices.filter(i => i.title.toLowerCase().includes(input.toLowerCase())))
    });

    const fxn = fxnMap.get(input.function);
    if (!fxn) return;
    try {
        fxn.run();
    } catch (e) {
        console.error(e);
    }
})();