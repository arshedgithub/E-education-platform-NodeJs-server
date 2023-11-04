const express = require('express');
const router = express();

// set pug as view engine
router.set('view engine', 'pug')
router.set('views', './views')  // default this is not required

router.get('/', (req,res) => {
    // rendering pug file
    res.render('index', { title: 'root page', heading: 'hello'}) 
})

module.exports = router;