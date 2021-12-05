const app = require("./app");
const connectDatabase = require("./config/dataBase")

const dotenv = require("dotenv")

// Handle Uncaught Exceptions
process.on("uncaughtException", err => {
    console.log(`ERROR: ${err.stack}`);
    console.log(`Shutting down due to uncaught exception`); 
    process.exit(1)
})


// setting up config file
dotenv.config({ path: 'backend/config/config.env'})


// connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is started baby: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`) ;
})

// Handle Unhandle promise rejection

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`) ;
    console.log('Shutting down the server due to unhandled promise rejection') ;
    server.close(() =>{
        process.exit(1)
    })
})