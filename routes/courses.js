const Joi = require('joi');
const morgan = require('morgan');
const express = require('express');
const router = express();

router.use(express.json())
router.use(express.urlencoded({extended: true}))
router.use(morgan('tiny'));

const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"}
]

router.get('/', (req,res) => {
    res.send(courses)
})

router.get('/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course not found.')
    res.send(course)
})

router.post('/', (req,res) => {
    const {error} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

router.put('/:id', (req,res) => {
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

module.exports = router;