const prompts = require("prompts");
const fs = require('fs');

// get functions
const functionFiles = fs.readdirSync('./functions').filter(f => f.endsWith('.js')).sort();
const selections = [];
const fxnMap = new Map();
for (const file of functionFiles) {
    const fxn = require(`./functions/${file}`);
    selections.push({title: `${fxn.info.day ? `D${fxn.info.day}: ` : ""}${fxn.info.name}`, description: `${fxn.info.desc ? fxn.info.desc : ""}`, value: fxn.info.name});
    fxnMap.set(fxn.info.name, fxn);
}

// debug
//prompts.inject(["calorieCountThree", "calorieCount.txt"]);

// prompt
(async () => {
    const input = await prompts({
        type: "autocomplete",
        name: "function",
        message: "Pick a function to run!",
        choices: selections,
        limit: 5,
        initial: 1,
    });

    const fxn = fxnMap.get(input.function);
    if (!fxn) return;
    try {
        fxn.run();
    } catch (e) {
        console.error(e);
    }
})();