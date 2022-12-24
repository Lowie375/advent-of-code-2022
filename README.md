# advent-of-code-2022

[![Version][version]](package.json)
[![MIT License][license]](LICENSE)

A collection of my [2022 Advent of Code](https://adventofcode.com/2022) problem solutions

All content in this repository is licenced under the [MIT License](LICENSE)

## Repository Overview

The code I've created to solve each puzzle is stored in the [`functions`](/functions) folder - one file per puzzle. That means that each day has two associated files: one of which solves part 1, the other of which solves part 2.  
Additionally, this folder contains the [`quit.js`](/functions/quit.js) file, which is not associated with any puzzle and simply exits the program.

The [`index.js`](index.js) file contains a command handler which serves as the main interface for running the code I've created to solve each problem. You can search for functions by name or problem release date.

Each function is configured to run with a specific input file by default (see [`inputs/README`](inputs/README.md) or individual functions' *`exports.info.defaultData`* fields).  
Input data is not provided in this repository [due to copyright](https://www.reddit.com/r/adventofcode/wiki/faqs/copyright/inputs/): if you want input data, you should grab it directly from the [Advent of Code website](https://adventofcode.com/) and paste it into a text file, then put that file in the [`inputs`](/inputs) folder.  
You can specify other files in the `inputs` folder to use as inputs when running functions. Do be warned, however, that the functions in this repository are *not* guaranteed to be robust (i.e. bad inputs may throw errors or yield unexpected results!)

### Code Breakdown

- **`DAY 01`**: Calorie Counting
  - `[P1]`: [**`calorieCount.js`**](/functions/calorieCount.js)
  - `[P2]`: [**`calorieCountThree.js`**](/functions/calorieCountThree.js)
- **`DAY 02`**: Rock Paper Scissors
  - `[P1]`: [**`rps.js`**](/functions/rps.js)
  - `[P2]`: [**`rpsResult.js`**](/functions/rpsResult.js)
- **`DAY 03`**: Rucksack Reorganization
  - `[P1]`: [**`sortPriority.js`**](/functions/sortPriority.js)
  - `[P2]`: [**`badgePriority.js`**](/functions/badgePriority.js)
- **`DAY 04`**: Camp Cleanup
  - `[P1]`: [**`pairOverlap.js`**](/functions/pairOverlap.js)
  - `[P2]`: [**`partialPairOverlap.js`**](/functions/partialPairOverlap.js)
- **`DAY 05`**: Supply Stacks
  - `[P1]`: [**`supplyStack.js`**](/functions/supplyStack.js)
  - `[P2]`: [**`supplyStack9001.js`**](/functions/supplyStack9001.js)
- **`DAY 06`**: Tuning Trouble
  - `[P1]`: [**`startOfSignal.js`**](/functions/startOfSignal.js)
  - `[P2]`: [**`startOfMessage.js`**](/functions/startOfMessage.js)
- **`DAY 07`**: No Space Left On Device
  - `[P1]`: [**`sumSmallDirectories.js`**](/functions/sumSmallDirectories.js)
  - `[P2]`: [**`findDeletableDirectory.js`**](/functions/findDeletableDirectory.js)
- **`DAY 08`**: Treetop Tree House
  - `[P1]`: [**`skyscraperTrees.js`**](/functions/skyscraperTrees.js)
  - `[P2]`: [**`scenicTrees.js`**](/functions/scenicTrees.js)
- **`DAY 09`**: Rope Bridge
  - `[P1]`: [**`followRope.js`**](/functions/followRope.js)
  - `[P2]`: [**`followLongRope.js`**](/functions/followLongRope.js)
- **`DAY 10`**: Cathode-Ray Tube
  - `[P1]`: [**`getCycles.js`**](/functions/getCycles.js)
  - `[P2]`: [**`renderCycleImage.js`**](/functions/renderCycleImage.js)
- **`DAY 11`**: Monkey in the Middle
  - `[P1]`: [**`monkeyBusiness.js`**](/functions/monkeyBusiness.js)
  - `[P2]`: [**`worryingMonkeyBusiness.js`**](/functions/worryingMonkeyBusiness.js)
- **`DAY 12`**: Hill Climbing Algorithm
  - `[P1]`: [**`optimalHillClimb.js`**](/functions/optimalHillClimb.js)
  - `[P2]`: [**`shortestHillClimb.js`**](/functions/shortestHillClimb.js)
- **`DAY 13`**: Distress Signal
  - `[P1]`: [**`findOrderedPackets.js`**](/functions/findOrderedPackets.js)
  - `[P2]`: [**`decodePackets.js`**](/functions/decodePackets.js)
- **`DAY 14`**: Regolith Reservoir
  - `[P1]`: [**`simulateSand.js`**](/functions/simulateSand.js)
  - `[P2]`: [**`simulateFloorSand.js`**](/functions/simulateFloorSand.js)
- **`DAY 15`**: Beacon Exclusion Zone
  - `[P1]`: [**`noBeaconCount.js`**](/functions/noBeaconCount.js)
  - `[P2]`: [**`findDistressBeacon.js`**](/functions/findDistressBeacon.js)
- **`DAY 16`**: Proboscidea Volcanium
  - `[P1]`: [**`releaseVolcanoPressure.js`**](/functions/releaseVolcanoPressure.js) (INCOMPLETE)
- **`DAY 17`**: Pyroclastic Flow
  - `[P1]`: [**`simulateRockTower.js`**](/functions/simulateRockTower.js)
  - `[P2]`: [**`simulateGiantRockTower.js`**](/functions/simulateGiantRockTower.js) (INCOMPLETE)
- **`DAY 18`**: Boiling Boulders
  - `[P1]`: [**`computeDropletSurface.js`**](/functions/computeDropletSurface.js)
  - `[P2]`: [**`computeDropletExterior.js`**](/functions/computeDropletExterior.js)
- **`DAY 19`**: Not Enough Minerals
  - `[P1]`: [**`sumBlueprintQuality.js`**](/functions/sumBlueprintQuality.js)
  - `[P2]`: [**`getLongBlueprintOutput.js`**](/functions/getLongBlueprintOutput.js) (INCOMPLETE)
- **`DAY 20`**: Grove Positioning System
  - `[P1]`: [**`sumGroveCoordinates.js`**](/functions/sumGroveCoordinates.js) (INCOMPLETE)
- **`DAY 21`**: Monkey Math
  - `[P1]`: [**`monkeyMath.js`**](/functions/monkeyMath.js)
  - `[P2]`: [**`calculateHumanNumber.js`**](/functions/calculateHumanNumber.js)

<!-- TEMPLATE
- **`DAY XX`**: jiji
  - `[P1]`: [**`baba.js`**](/functions/baba.js)
  - `[P2]`: [**`keke.js`**](/functions/keke.js)
-->

<!-- Badges -->
[version]: https://img.shields.io/github/package-json/v/Lowie375/advent-of-code-2022
[license]: https://img.shields.io/github/license/Lowie375/advent-of-code-2022
