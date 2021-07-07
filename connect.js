const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://admin:wpToFKdjrKR3lHru@cluster0.8yhoz.mongodb.net/axie?retryWrites=true&w=majority";
const client = new MongoClient(url);

const dbName = "axie";

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        const col = db.collection("queries");

        let axie = {
            "class": "Reptile",
            "genes": "0x500000000d10423200a5214410a11004008318c610810886146408880861284c",
            "parts": { "Eyes": "Chubby", "Ears": "Zen", "Back": "Green Thorns", "Mouth": "Piranha", "Horn": "Anemone", "Tail": "The Last One" },                                                                                                                                
            "breedCount": 2,  
            "price": 100,                                                                                                                             
            "stats": {"hp": 45, "speed": 57,"skill": 35,"morale": 27,}
        }

        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(axie);
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        console.log(myDoc);



    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);

