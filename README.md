# advent-of-code-2022

A collection of my 2022 Advent of Code problem solutions

## Repository Overview

The code I've created to solve each puzzle is stored in the [`functions`](/functions) folder - one file per puzzle. That means that each day has two associated files: one of which solves part 1, the other of which solves part 2.  
Additionally, this folder contains the [`quit.js`](/functions/quit.js) file, which is not associated with any puzzle and simply exits the program.

The inputs I was given for each problem are stored in the [`inputs`](/inputs) folder. These contain the raw text I was given from the Advent of Code website - nothing else.

The [`index.js`](index.js) file contains a command handler which serves as the main interface for running the code I've created. You can search for functions by their name or release date.  
Each function is configured to run with a specific input file by default, but you can add new files to the `inputs` folder and specify those instead of the defaults when running each function (assuming they're suitable for the given problem). You can see which input file a puzzle uses by default by looking at its *`exports.info.defaultData`* field.

### Code Breakdown

- **DAY 1**: Calorie Counting
  - code: [`[P1]` **`calorieCount.js`**](/functions/calorieCount.js) + [`[P2]` **`calorieCountThree.js`**](/functions/calorieCountThree.js)
  - input: [`calories.txt`](/inputs/calories.txt)
- **DAY 2**: Rock Paper Scissors
  - code: [`[P1]` **`rps.js`**](/functions/rps.js) + [`[P2]` **`rpsResult.js`**](/functions/rpsResult.js)
  - input: [`rps.txt`](/inputs/rps.txt)
- **DAY 3**: Rucksack Reorganization
  - code: [`[P1]` **`sortPriority.js`**](/functions/sortPriority.js) + [`[P2]` **`badgePriority.js`**](/functions/badgePriority.js)
  - input: [`rucksack.txt`](/inputs/rucksack.txt)
- **DAY 4**: Camp Cleanup
  - code: [`[P1]` **`pairOverlap.js`**](/functions/pairOverlap.js) + [`[P2]` **`partialPairOverlap.js`**](/functions/partialPairOverlap.js)
  - input: [`cleaning.txt`](/inputs/cleaning.txt)
- **DAY 5**: Supply Stacks
  - code: [`[P1]` **`supplyStack.js`**](/functions/supplyStack.js) + [`[P2]` **`supplyStack9001.js`**](/functions/supplyStack9001.js)
  - input: [`crates.txt`](/inputs/crates.txt)
- **DAY 6**: Tuning Trouble
  - code: [`[P1]` **`startOfSignal.js`**](/functions/startOfSignal.js) + [`[P2]` **`startOfMessage.js`**](/functions/startOfMessage.js)
  - input: [`signalbuff.txt`](/inputs/signalbuff.txt)
- **DAY 7**: No Space Left On Device
  - code: [`[P1]` **`sumSmallDirectories.js`**](/functions/sumSmallDirectories.js) + [`[P2]` **`findDeletableDirectory.js`**](/functions/findDeletableDirectory.js)
  - input: [`filesystem.txt`](/inputs/filesystem.txt)
