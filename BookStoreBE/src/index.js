const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const cors = require('cors');
dotenv.config()
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port= process.env.PORT ||3001
db.connect();

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); 

routes(app);


app.listen(port,()=>{
    console.log('Serving on port: ' + port)
})