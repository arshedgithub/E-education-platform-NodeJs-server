const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middlewares/logger')
const courses = require('./routes/courses')
const home = require('./routes/home')
const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(helmet())
app.use(logger)

app.use('/api/courses', courses)
app.use('/', home)

// set pug as view engine
app.set('view engine', 'pug')
app.set('views', './views')  // default this is not required

// configuration
console.log('Application Name: '+ config.get('name'));
console.log('Mail Server: '+ config.get('mail.host'));
// get password from environment variable
console.log('Mail Password: '+ config.get('mail.password'));

if (app.get('env') === "development"){
    app.use(morgan('tiny'));
    startupDebugger("Morgan enabled..."); // console.log()
}

// db work
dbDebugger('db working');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`))