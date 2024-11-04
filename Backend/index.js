const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());

//main router 


const mainRouter = require('./Routes/authUser')


app.use("/api/v1" , mainRouter);

app.listen(5000, () => {
    console.log("server is running on the port 5000")
});