
require('./server/server')

const express = require('express')
const typologiesRouter= require('./models/typologies/typologies')
const coursesRouter= require('./models/courses/courses')
const universityRouter = require ('./models/university/university')
const app =express()

app.use('/api/courses', coursesRouter); 
app.use('/api/typology', typologiesRouter);
app.use('/api/university', universityRouter)
app.listen(3006, () => {
});

