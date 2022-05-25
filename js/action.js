const mobil = [
  { name: "mobil_A", rarity: "common" },
  { name: "mobil_B", rarity: "rare" },
  { name: "mobil_C", rarity: "legend" },
  { name: "mobil_D", rarity: "common" },
  { name: "mobil_E", rarity: "rare" },
  { name: "mobil_F", rarity: "common" },
];

function groupingRarity(data) {

}

console.log(groupingRarity(mobil));
// {
//     common:["mobil_A", "mobil_D", "mobil_F"],
//     rare:["mobil_B","mobil_E"],
//     legend:["mobil_C"]
// }

function determinePrize (rarity, dataGroup){
    if(dataGroup[rarity].length>1){
        return dataGroup[rarity][Math.floor(Math.random()*dataGroup[rarity].length)]
    }
    else{
        return dataGroup[rarity]
    }
}

// const data=
// {
//     common:["mobil_A", "mobil_D", "mobil_F"],
//     rare:["mobil_B","mobil_E"],
//     legend:["mobil_C"]
// }

// console.log(determinePrize("common", data))


function determineChance(chanceRarity) {
  let rarity=""
    if (chanceRarity > 0 && chanceRarity < 3) {
      rarity="legend"
      return rarity
    } else if (chanceRarity >= 3 && chanceRarity < 36) {
      rarity="rare"
      return rarity
    } else if (chanceRarity >= 36 && chanceRarity <= 100) {
      rarity="common"
      return rarity
    }
}

function getGatcha(mobil){
    let resultGroupingRarity= groupingRarity(mobil)
    let resultDetermineChance= determineChance(Math.floor(Math.random()*101))
    let resultDeterminePrize=determinePrize(resultDetermineChance,resultGroupingRarity)
    return resultDeterminePrize
}

