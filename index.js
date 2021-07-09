require('dotenv').config();
const express = require("express");
const unirest = require("unirest");
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = "!";
const fs = require('fs');
const axiequery = require("./axiequery");

var app = express()

var axies = [];
var axiesCount = 0;
var classes = [];
var parts = [];
var partsLength = 0;
var breedCountmax = 7;

var hpmax = 100;
var hpmin = 0;
var speedmax = 100;
var speedmin = 0;
var skillmax = 100;
var skillmin = 0;
var moralemax = 100;
var moralemin = 0;
var foundAxie = [];
var maxprice = 9999900000000000000000;


var genesPercent;
var genes;

bot.login(TOKEN);

function Axie(classes, parts, breedCountmax, hpmax, hpmin, speedmax, speedmin, skillmax, skillmin, moralemax, moralemin,maxprice){
  this.classes = classes;
  this.parts = parts;
  this.breedCountmax = breedCountmax;
  this.hpmax = hpmax;
  this.hpmin = hpmin;
  this.speedmax = speedmax;
  this.speedmin = speedmin;
  this.skillmax = skillmax;
  this.skillmin = skillmin;
  this.moralemax = moralemax;
  this.moralemin = moralemin;
  this.maxprice = maxprice;
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	args = message.content.slice(prefix.length).trim().split(',');
	const command = args.shift().toLowerCase();

    if(command === 'class'){
      classes = args;
      message.reply(`Selected class: ${classes}`);
    }

    if(command === 'maxprice'){
      maxprice = args;
      message.reply(`Max price: ${maxprice}`);
    }
    
    if(command === 'parts'){
      parts = args;
      message.reply(`Selected parts: ${parts}`);
      console.log(parts + parts.length);
    }

    if(command === 'breedcountmax'){
      breedCountmax = args;
      message.reply(`Breed count max: ${breedCountmax}`);
      console.log(breedCountmax);
    }

    if(command === 'hpmax'){
      hpmax = args;
      message.reply(`hpmax: ${hpmax}`);
      console.log(hpmax);
    }
    if(command === 'hpmin'){
      hpmin = args;
      message.reply(`hpmin: ${hpmin}`);
      console.log(hpmin);
    }

    if(command === 'speedmax'){
      speedmax = args;
      message.reply(`speedmax: ${speedmax}`);
      console.log(speedmax);
    }
    if(command === 'speedmin'){
      speedmin = args;
      message.reply(`speedmin: ${speedmin}`);
      console.log(speedmin);
    }

    if(command === 'skillmax'){
      skillmax = args;
      message.reply(`skillmax: ${skillmax}`);
      console.log(skillmax);
    }
    if(command === 'skillmin'){
      skillmin = args;
      message.reply(`skillmin: ${skillmin}`);
      console.log(skillmin);
    }

    if(command === 'moralemax'){
      moralemax = args;
      message.reply(`moralemax: ${moralemax}`);
      console.log(moralemax);
    }
    if(command === 'moralemin'){
      moralemin = args;
      message.reply(`moralemin: ${moralemin}`);
      console.log(moralemin);
    }
});

bot.on('message', msg => {

  if (msg.content === 'add'){
    // axies[axiesCount] = new Axie(classes,parts,breedCountmax,hpmax,hpmin,speedmax,speedmin,skillmax,skillmin,moralemax,moralemin,maxprice);
    let axie ={
      "classes": classes,
      "parts": parts,
      "breedCountmax": breedCountmax,
      "hpmax": hpmax,
      "hpmin": hpmin,
      "speedmax":speedmax,
      "speedmin":speedmin,
      "skillmax":skillmax,
      "skillmin":skillmin,
      "moralemax":moralemax,
      "moralemin":moralemin,
      "maxprice":maxprice
    }
    axiequery.push(axie);
    fs.writeFile("axiequery.json", JSON.stringify(axiequery), err =>{
      // Checking for errors
    if (err) throw err; 
    msg.reply("Added.")
    console.log("Done writing"); // Success
    });
    // axiesCount++;
    
  }
});

bot.on('message', msg => {

  if (msg.content === 'clear'){
    axiequery.pop();
    msg.reply("Cleared last query.");
  }
});

bot.on('message', msg => {

  if (msg.content === 'show'){
    axiequery.forEach(axie => {
      msg.reply("Axie in search:\nClass: " + axie.classes + "\nParts: " + axie.parts + "\nBreed count: " + axie.breedCountmax + "\nMax price:" + axie.maxprice + " ETH" + "\nHp max: " + axie.hpmax + " Hp min: " + axie.hpmin + " Speed max: " + axie.speedmax
       + " Speed min: " + axie.speedmin + " Skill max: " + axie.skillmax + " Skill min: " + axie.skillmin + " Morale max: " + axie.moralemax + " Morale min: " + axie.moralemin);
    });
  }
});


bot.on('message', msg => {

if (msg.content === 'start'){

  msg.reply("Started searching...");

  let timerId = setTimeout(function tick() {
    
const req = unirest("POST", "https://axieinfinity.com/graphql-server-v2/graphql");

req.headers({
  "Content-Type": "application/json"
});

req.send("{\"query\":\"query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\\n    total\\n    results {\\n      ...AxieRowData\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment AxieRowData on Axie {\\n  id\\n  image\\n  class\\n  name\\n  genes\\n  owner\\n  class\\n  stage\\n  title\\n  breedCount\\n  level\\n  parts {\\n    ...AxiePart\\n    __typename\\n  }\\n  stats {\\n    ...AxieStats\\n    __typename\\n  }\\n  auction {\\n    ...AxieAuction\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxiePart on AxiePart {\\n  id\\n  name\\n  class\\n  type\\n  specialGenes\\n  stage\\n  abilities {\\n    ...AxieCardAbility\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieCardAbility on AxieCardAbility {\\n  id\\n  name\\n  attack\\n  defense\\n  energy\\n  description\\n  backgroundUrl\\n  effectIconUrl\\n  __typename\\n}\\n\\nfragment AxieStats on AxieStats {\\n  hp\\n  speed\\n  skill\\n  morale\\n  __typename\\n}\\n\\nfragment AxieAuction on Auction {\\n  startingPrice\\n  endingPrice\\n  startingTimestamp\\n  endingTimestamp\\n  duration\\n  timeLeft\\n  currentPrice\\n  currentPriceUSD\\n  suggestedPrice\\n  seller\\n  listingIndex\\n  state\\n  __typename\\n}\\n\",\"variables\":{\"from\":0,\"size\":3,\"sort\":\"Latest\",\"auctionType\":\"Sale\"}}");

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  fs.readFile("axiequery.json", function(err, data) {
    if (err) throw err;
    axies = JSON.parse(data);
});

try{
  console.log(res.body.data.axies.results[i].class + res.body.data.axies.results[i].id);
}
catch(e){
  // msg.reply("Marketplace down, need to restart server.");
}
  for(var i = 0; i<10; i++){ 
    try{
    console.log(res.body.data.axies.results[i].class + res.body.data.axies.results[i].id); 
    // if(res.body.data.axies.results[i].class == null){
    //   const unirest = require("unirest");

    //   const req = unirest("POST", "https://axieinfinity.com/graphql-server-v2/graphql");
      
    //   req.headers({
    //     "Content-Type": "application/json"
    //   });
      // var axiechild = res.body.data.axies.results[i].id;
      // var axiequery = `{\"query\":\"query GetAxieDetail($axieId: ID!) {\\n  axie(axieId: $axieId) {\\n    ...AxieDetail\\n    __typename\\n  }\\n}\\n\\nfragment AxieDetail on Axie {\\n  id\\n  image\\n  class\\n  chain\\n  name\\n  genes\\n  owner\\n  birthDate\\n  bodyShape\\n  class\\n  sireId\\n  sireClass\\n  matronId\\n  matronClass\\n  stage\\n  title\\n  breedCount\\n  level\\n  figure {\\n    atlas\\n    model\\n    image\\n    __typename\\n  }\\n  parts {\\n    ...AxiePart\\n    __typename\\n  }\\n  stats {\\n    ...AxieStats\\n    __typename\\n  }\\n  auction {\\n    ...AxieAuction\\n    __typename\\n  }\\n  ownerProfile {\\n    name\\n    __typename\\n  }\\n  battleInfo {\\n    ...AxieBattleInfo\\n    __typename\\n  }\\n  children {\\n    id\\n    name\\n    class\\n    image\\n    title\\n    stage\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieBattleInfo on AxieBattleInfo {\\n  banned\\n  banUntil\\n  level\\n  __typename\\n}\\n\\nfragment AxiePart on AxiePart {\\n  id\\n  name\\n  class\\n  type\\n  specialGenes\\n  stage\\n  abilities {\\n    ...AxieCardAbility\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieCardAbility on AxieCardAbility {\\n  id\\n  name\\n  attack\\n  defense\\n  energy\\n  description\\n  backgroundUrl\\n  effectIconUrl\\n  __typename\\n}\\n\\nfragment AxieStats on AxieStats {\\n  hp\\n  speed\\n  skill\\n  morale\\n  __typename\\n}\\n\\nfragment AxieAuction on Auction {\\n  startingPrice\\n  endingPrice\\n  startingTimestamp\\n  endingTimestamp\\n  duration\\n  timeLeft\\n  currentPrice\\n  currentPriceUSD\\n  suggestedPrice\\n  seller\\n  listingIndex\\n  state\\n  __typename\\n}\\n\",\"variables\":{\"axieId\":\"${axiechild}\"}}`;
      // // axiequery.replace("1683851", res.body.data.axies.results[i].id);
      // req.send(axiequery);
      
      // req.end(function (res) {
      //   if (res.error) throw new Error(res.error);
      
      //   // console.log(res.body.data.axie.sireId);
      //   // console.log(res.body.data.axie.matronId);
      // });
      // axiequery = `{\"query\":\"query GetAxieDetail($axieId: ID!) {\\n  axie(axieId: $axieId) {\\n    ...AxieDetail\\n    __typename\\n  }\\n}\\n\\nfragment AxieDetail on Axie {\\n  id\\n  image\\n  class\\n  chain\\n  name\\n  genes\\n  owner\\n  birthDate\\n  bodyShape\\n  class\\n  sireId\\n  sireClass\\n  matronId\\n  matronClass\\n  stage\\n  title\\n  breedCount\\n  level\\n  figure {\\n    atlas\\n    model\\n    image\\n    __typename\\n  }\\n  parts {\\n    ...AxiePart\\n    __typename\\n  }\\n  stats {\\n    ...AxieStats\\n    __typename\\n  }\\n  auction {\\n    ...AxieAuction\\n    __typename\\n  }\\n  ownerProfile {\\n    name\\n    __typename\\n  }\\n  battleInfo {\\n    ...AxieBattleInfo\\n    __typename\\n  }\\n  children {\\n    id\\n    name\\n    class\\n    image\\n    title\\n    stage\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieBattleInfo on AxieBattleInfo {\\n  banned\\n  banUntil\\n  level\\n  __typename\\n}\\n\\nfragment AxiePart on AxiePart {\\n  id\\n  name\\n  class\\n  type\\n  specialGenes\\n  stage\\n  abilities {\\n    ...AxieCardAbility\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieCardAbility on AxieCardAbility {\\n  id\\n  name\\n  attack\\n  defense\\n  energy\\n  description\\n  backgroundUrl\\n  effectIconUrl\\n  __typename\\n}\\n\\nfragment AxieStats on AxieStats {\\n  hp\\n  speed\\n  skill\\n  morale\\n  __typename\\n}\\n\\nfragment AxieAuction on Auction {\\n  startingPrice\\n  endingPrice\\n  startingTimestamp\\n  endingTimestamp\\n  duration\\n  timeLeft\\n  currentPrice\\n  currentPriceUSD\\n  suggestedPrice\\n  seller\\n  listingIndex\\n  state\\n  __typename\\n}\\n\",\"variables\":{\"axieId\":\"${res.body.data.axie.sireId}\"}}`;
      // req.send(axiequery);

      // req.end(function (res) {
      //   if (res.error) throw new Error(res.error);
      //   axies.forEach(axie => {
      //         partsLength = 0;
      //         if(axie.classes.includes(res.body.data.axie.class)){
      //         for (g = 0; g<6; g++){
      //           if(axie.parts.includes(res.body.data.axie.parts[g].name)){
      //             if(partsLength == axie.parts.length - 1){
      //               if( axie.hpmax >= res.body.data.axie.stats.hp >= axie.hpmin){
      //                   if( axie.speedmax >= res.body.data.axie.stats.speed >= axie.speedmin){
      //                     if( axie.skillmax >= res.body.data.axie.stats.skill >= axie.skillmin){
      //                       if( axie.moralemax >= res.body.data.axie.stats.morale >= axie.moralemin){
      //                         if(foundAxie.includes(res.body.data.axie.id)){
      //                         }
      //                         else{
      //                           foundAxie.push(res.body.data.axie.id);
      //                           console.log("FOUND" + res.body.data.axie.class + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axie.id);
      //                           msg.reply("Father is interesting\n" + "https://marketplace.axieinfinity.com/axie/" + axiechild);
      //                         }
      //                       }
      //                     }
      //                   }
      //                 }
      //               }
      //             else{
                    
      //               partsLength++;
      //             }
      //           }
      //         }
             
      //       }
      //   });
        

      // });

    //   axiequery = `{\"query\":\"query GetAxieDetail($axieId: ID!) {\\n  axie(axieId: $axieId) {\\n    ...AxieDetail\\n    __typename\\n  }\\n}\\n\\nfragment AxieDetail on Axie {\\n  id\\n  image\\n  class\\n  chain\\n  name\\n  genes\\n  owner\\n  birthDate\\n  bodyShape\\n  class\\n  sireId\\n  sireClass\\n  matronId\\n  matronClass\\n  stage\\n  title\\n  breedCount\\n  level\\n  figure {\\n    atlas\\n    model\\n    image\\n    __typename\\n  }\\n  parts {\\n    ...AxiePart\\n    __typename\\n  }\\n  stats {\\n    ...AxieStats\\n    __typename\\n  }\\n  auction {\\n    ...AxieAuction\\n    __typename\\n  }\\n  ownerProfile {\\n    name\\n    __typename\\n  }\\n  battleInfo {\\n    ...AxieBattleInfo\\n    __typename\\n  }\\n  children {\\n    id\\n    name\\n    class\\n    image\\n    title\\n    stage\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieBattleInfo on AxieBattleInfo {\\n  banned\\n  banUntil\\n  level\\n  __typename\\n}\\n\\nfragment AxiePart on AxiePart {\\n  id\\n  name\\n  class\\n  type\\n  specialGenes\\n  stage\\n  abilities {\\n    ...AxieCardAbility\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieCardAbility on AxieCardAbility {\\n  id\\n  name\\n  attack\\n  defense\\n  energy\\n  description\\n  backgroundUrl\\n  effectIconUrl\\n  __typename\\n}\\n\\nfragment AxieStats on AxieStats {\\n  hp\\n  speed\\n  skill\\n  morale\\n  __typename\\n}\\n\\nfragment AxieAuction on Auction {\\n  startingPrice\\n  endingPrice\\n  startingTimestamp\\n  endingTimestamp\\n  duration\\n  timeLeft\\n  currentPrice\\n  currentPriceUSD\\n  suggestedPrice\\n  seller\\n  listingIndex\\n  state\\n  __typename\\n}\\n\",\"variables\":{\"axieId\":\"${res.body.data.axie.matronId}\"}}`;

    //   req.send(axiequery);

    //   req.end(function (res) {
    //     if (res.error) throw new Error(res.error);
    //     axies.forEach(axie => {
    //           partsLength = 0;
    //           if(axie.classes.includes(res.body.data.axie.class)){
    //           for (g = 0; g<6; g++){
    //             if(axie.parts.includes(res.body.data.axie.parts[g].name)){
    //               if(partsLength == axie.parts.length - 1){
    //                 if( axie.hpmax >= res.body.data.axie.stats.hp >= axie.hpmin){
    //                     if( axie.speedmax >= res.body.data.axie.stats.speed >= axie.speedmin){
    //                       if( axie.skillmax >= res.body.data.axie.stats.skill >= axie.skillmin){
    //                         if( axie.moralemax >= res.body.data.axie.stats.morale >= axie.moralemin){
    //                           if(foundAxie.includes(res.body.data.axie.id)){
    //                           }
    //                           else{
    //                             foundAxie.push(res.body.data.axie.id);
    //                             console.log("FOUND" + res.body.data.axie.class + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axie.id);
    //                             msg.reply("Mother is interesting\n" + "https://marketplace.axieinfinity.com/axie/" + axiechild);
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               else{
                    
    //                 partsLength++;
    //               }
    //             }
    //           }
             
    //         }
    //     });
    //   });
    // }   
    axies.forEach(axie => {
    if(axie.classes.includes(res.body.data.axies.results[i].class) || (axie.classes == 'all')){
      if(axie.breedCountmax >= res.body.data.axies.results[i].breedCount){
        if(parseFloat(axie.maxprice) >= (parseFloat(res.body.data.axies.results[i].auction.currentPrice)/1000000000000000000)){
        partsLength = 0;
        if(axie.parts == 'all'){
          if(foundAxie.includes(res.body.data.axies.results[i].id)){
          }
          else{
            foundAxie.push(res.body.data.axies.results[i].id);
            console.log("FOUND" + res.body.data.axies.results[i].class + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axies.results[i].id);
            msg.reply(res.body.data.axies.results[i].class + "\n" + res.body.data.axies.results[i].image + "\nBreed count: " + res.body.data.axies.results[i].breedCount + "\nPrice: " + res.body.data.axies.results[i].auction.currentPriceUSD + " USD" + "\n" + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axies.results[i].id);
          }
        }
        for (g = 0; g<6; g++){
          if(axie.parts.includes(res.body.data.axies.results[i].parts[g].name)){
            if(partsLength == axie.parts.length - 1){
              if( axie.hpmax >= res.body.data.axies.results[i].stats.hp >= axie.hpmin){
                  if( axie.speedmax >= res.body.data.axies.results[i].stats.speed >= axie.speedmin){
                    if( axie.skillmax >= res.body.data.axies.results[i].stats.skill >= axie.skillmin){
                      if( axie.moralemax >= res.body.data.axies.results[i].stats.morale >= axie.moralemin){
                        if(foundAxie.includes(res.body.data.axies.results[i].id)){
                        }
                        else{
                          foundAxie.push(res.body.data.axies.results[i].id);
                          console.log("FOUND" + res.body.data.axies.results[i].class + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axies.results[i].id);
                          msg.reply(res.body.data.axies.results[i].class + "\n" + res.body.data.axies.results[i].image + "\nParts: " + axie.parts + "\nBreed count: " + res.body.data.axies.results[i].breedCount + "\nPrice: " + res.body.data.axies.results[i].auction.currentPriceUSD + " USD" +"\nHp: " + res.body.data.axies.results[i].stats.hp
                          + "  Speed: " + res.body.data.axies.results[i].stats.speed + "  Skill: " + res.body.data.axies.results[i].stats.skill + "  Morale: " + res.body.data.axies.results[i].stats.morale + "\n" + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axies.results[i].id);
                        }
                      }
                    }
                  }
                }
              }
            else{
              
              partsLength++;
            }
          }
        }
        }
      }  
    }

  });
}
catch(e){
  
}  
}
}
);

  bot.on('message', msg => {
    if (msg.content === 'stop') {
    clearTimeout(timerId);
    }
  })
  timerId = setTimeout(tick, 1000);
}, 1000);
}
});
