require('dotenv').config();
const unirest = require("unirest");
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = "!";

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


var genesPercent;
var genes;

bot.login(TOKEN);

function Axie(classes, parts, breedCountmax, hpmax, hpmin, speedmax, speedmin, skillmax, skillmin, moralemax, moralemin){
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
    axies[axiesCount] = new Axie(classes,parts,breedCountmax,hpmax,hpmin,speedmax,speedmin,skillmax,skillmin,moralemax,moralemin);
    axiesCount++;
    axies.forEach(axie => {
      console.log("Axie in search: " + axie.classes + "\nParts: " + axie.parts + "\nBreed count: " + axie.breedCountmax );
      msg.reply("Axie in search:\n" + axie.classes + "\nParts: " + axie.parts + "\nBreed count: " + axie.breedCountmax + "\nHp max: " + axie.hpmax + "\nHp min: " + axie.hpmin + "\nSpeed max: " + axie.speedmax
       + "\nSpeed min: " + axie.speedmin + "\nSkill max: " + axie.skillmax + "\nSkill min: " + axie.skillmin + "\nMorale max: " + axie.moralemax + "\nMorale min: " + axie.moralemin);
    });
    
  }
});


bot.on('message', msg => {

if (msg.content === 'start'){

  let timerId = setTimeout(function tick() {
    
const req = unirest("POST", "https://axieinfinity.com/graphql-server-v2/graphql");

req.headers({
  "Content-Type": "application/json"
});

req.send("{\"query\":\"query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\\n    total\\n    results {\\n      ...AxieRowData\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment AxieRowData on Axie {\\n  id\\n  image\\n  class\\n  name\\n  genes\\n  owner\\n  class\\n  stage\\n  title\\n  breedCount\\n  level\\n  parts {\\n    ...AxiePart\\n    __typename\\n  }\\n  stats {\\n    ...AxieStats\\n    __typename\\n  }\\n  auction {\\n    ...AxieAuction\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxiePart on AxiePart {\\n  id\\n  name\\n  class\\n  type\\n  specialGenes\\n  stage\\n  abilities {\\n    ...AxieCardAbility\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment AxieCardAbility on AxieCardAbility {\\n  id\\n  name\\n  attack\\n  defense\\n  energy\\n  description\\n  backgroundUrl\\n  effectIconUrl\\n  __typename\\n}\\n\\nfragment AxieStats on AxieStats {\\n  hp\\n  speed\\n  skill\\n  morale\\n  __typename\\n}\\n\\nfragment AxieAuction on Auction {\\n  startingPrice\\n  endingPrice\\n  startingTimestamp\\n  endingTimestamp\\n  duration\\n  timeLeft\\n  currentPrice\\n  currentPriceUSD\\n  suggestedPrice\\n  seller\\n  listingIndex\\n  state\\n  __typename\\n}\\n\",\"variables\":{\"from\":0,\"size\":10,\"sort\":\"Latest\",\"auctionType\":\"Sale\"}}");

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  for(var i = 0; i<10; i++){ 
    console.log(res.body.data.axies.results[i].class + res.body.data.axies.results[i].id);

    axies.forEach(axie => {
    if(axie.classes.includes(res.body.data.axies.results[i].class)){
      if(axie.breedCountmax >= res.body.data.axies.results[i].breedCount){
        partsLength = 0;
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
                          msg.reply(res.body.data.axies.results[i].class + "\nParts: " + axie.parts + "\nBreed count: " + axie.hpmax + "\nHp: " + res.body.data.axies.results[i].stats.hp
                          + "\nSpeed: " + res.body.data.axies.results[i].stats.speed + "\nSkill: " + res.body.data.axies.results[i].stats.skill + "\nMorale: " + res.body.data.axies.results[i].stats.morale + "\n" + res.body.data.axies.results[i].breedCount + " https://marketplace.axieinfinity.com/axie/" + res.body.data.axies.results[i].id);
                        }
                      }
                    }
                  }
                }
              }
            else{
              console.log(partsLength);
              partsLength++;
            }
          }
        }
      }  
    }
  });
  }
});

  bot.on('message', msg => {
    if (msg.content === 'stop') {
    clearTimeout(timerId);
    }
  })
  timerId = setTimeout(tick, 9000);
}, 9000);

}
});
