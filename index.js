require('dotenv').config();
const unirest = require("unirest");
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = "!";
var classes = [];


bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
  // classes = [];
  // classes.length = 0;
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

    if(command === 'class'){
      if (!args.length) {
        return message.reply(`You didn't provide any arguments, ${message.author}!`);
      }
    }
    classes = args;
    message.reply(`Selected classes: ${classes}`);
    console.log(classes);
  
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
    if(classes.includes(res.body.data.axies.results[i].class)){
      console.log(classes);
      // console.log(classes[0]);
      // msg.reply(res.body.data.axies.results[0].class);
      msg.reply(res.body.data.axies.results[i].class + " id: " + res.body.data.axies.results[i].id);
    }
  
  }

});


//logic


//result
// msg.reply("res.body.data.axies.results[0].class");

bot.on('message', msg => {
if (msg.content === 'stop') {
  clearTimeout(timerId);
}
})
timerId = setTimeout(tick, 9000);
}, 9000);

}
});



// console.log(res.body.data.axies.results[0]);

// msg.reply(res.body.data.axies.results[0].class);