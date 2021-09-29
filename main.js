const api = require("./api");
const greedySolver = require("./greedySolver");

const apiKey = ""; //TODO: Your api key here
//The different map names can be found on considition.com/rules
const currentMap = "training1"; //Todo: Your map choice here


async function main(){
    let response = await api.getMap(apiKey, currentMap)
    let solution = greedySolver.solve(response,10)
    let score = await api.submitGame(apiKey, currentMap, solution)
    console.log(score)
}

main();