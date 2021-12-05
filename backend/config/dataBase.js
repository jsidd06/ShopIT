const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((e) =>{
        console.log(`mongodb data base is ready for hosting baby: ${e.connection.host}`)
    })
}

module.exports =connectDatabase;