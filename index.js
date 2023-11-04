const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger')
const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(helmet())

app.use(logger)

// configuration
console.log('Application Name: '+ config.get('name'));
console.log('Mail Server: '+ config.get('mail.host'));
// get password from environment variable
console.log('Mail Password: '+ config.get('mail.password'));

if (app.get('env') === "development"){
    app.use(morgan('tiny'));
    console.log("Morgan enabled...");
}

const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"}
]
app.get('/', (req,res) => {
    res.send('this is root.')
})

app.get('/api/courses', (req,res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course not found.')
    res.send(course)
})

app.post('/api/courses', (req,res) => {
    const {error} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req,res) => {
    // Lookup the course 
    // if not existing return 404 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course not found.')

    // validate 
    // if invalid return 400
    const {error} = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // update course 
    course.name = req.body.name;
    // return the updated course 
    res.send(course)

})

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`))