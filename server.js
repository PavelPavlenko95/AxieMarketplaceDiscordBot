const mongoose = require('mongoose')

mongoose
    .connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.8yhoz.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`)
    .then( () => {
        app.listen({ port: 3000 }, () => {
            console.log('Your Apollo Server is running on port 3000')
        })
    })
    .error( () => {
        console.error('Error while connecting to MongoDB');
    })    