const unirest = require("unirest");

var axieid = "2131622";
var getgenes = "https://api.axie.technology/getgenes/" + axieid;

const req = unirest("GET", getgenes);

req.end(function (res) {
  if (res.error) throw new Error(res.error);
    console.log(res.body);
var purity = 0;
var axieclass = res.body.cls;

if(res.body.eyes.d.class === axieclass) purity+=13;
if(res.body.eyes.r1.class === axieclass) purity+=3;
if(res.body.eyes.r2.class === axieclass) purity+=1;

if(res.body.mouth.d.class === axieclass) purity+=13;
if(res.body.mouth.r1.class === axieclass) purity+=3;
if(res.body.mouth.r2.class === axieclass) purity+=1;

if(res.body.ears.d.class === axieclass) purity+=13;
if(res.body.ears.r1.class === axieclass) purity+=3;
if(res.body.ears.r2.class === axieclass) purity+=1;

if(res.body.horn.d.class === axieclass) purity+=13;
if(res.body.horn.r1.class === axieclass) purity+=3;
if(res.body.horn.r2.class === axieclass) purity+=1;

if(res.body.back.d.class === axieclass) purity+=13;
if(res.body.back.r1.class === axieclass) purity+=3;
if(res.body.back.r2.class === axieclass) purity+=1;

if(res.body.tail.d.class === axieclass) purity+=13;
if(res.body.tail.r1.class === axieclass) purity+=3;
if(res.body.tail.r2.class === axieclass) purity+=1;

console.log(purity);
});

