# advent-of-code-2022

A collection of my 2022 Advent of Code problem solutions

## Repository Overview

The code I've created to solve each puzzle is stored in the [`functions`](/functions) folder - one file per puzzle. That means that each day has two associated files: one of which solves part 1, the other of which solves part 2.  
Additionally, this folder contains the [`quit.js`](/functions/quit.js) file, which is not associated with any puzzle and simply exits the program.

The inputs I was given for each problem are stored in the [`inputs`](/inputs) folder. These contain the raw text I was given from the Advent of Code website - nothing else.  
Each function is configured to run with a specific input file by default, but you can add new files to the `inputs` folder and run function using those inputs instead (assuming they're suitable for the given problem). You can see which input file is associated with each puzzle by looking at its *`exports.info.defaultData`* field.

The [`index.js`](index.js) file contains a command handler which serves as the main interface for running the code I've created. You can search for a specific function by name or release date.

### Code Breakdown

- **DAY 1**: [**`calorieCount.js`**](/functions/calorieCount.js) (1) + [**`calorieCountThree.js`**](/functions/calorieCountThree.js) (2)
  - *input: [`calories.txt`](/inputs/calories.txt)*
- **DAY 2**: [**`rps.js`**](/functions/rps.js) (1) + [**`rpsResult.js`**](/functions/rpsResult.js) (2)
  - *input: [`rps.txt`](/inputs/rps.txt)*
- **DAY 3**: [**`sortPriority.js`**](/functions/sortPriority.js) (1) + [**`badgePriority.js`**](/functions/badgePriority.js) (2)
  - *input: [`rucksack.txt`](/inputs/rucksack.txt)*
