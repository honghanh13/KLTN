
const express = require("express");
const dotenv = require("dotenv");
const db = require('./config/db');
dotenv.config()
const cors = require('cors');
const routes = require('./routes');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express()
const port= process.env.PORT ||3001
db.connect();

app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser()); 

routes(app);


app.listen(port,()=>{
    console.log('Serving on port: ' + port)
})