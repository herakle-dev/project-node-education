
require('./server/server')

const express = require('express')
const typologiesRouter= require('./models/typologies/typologies')
const coursesRouter= require('./models/courses/courses')
const app =express()

app.use('/api/courses', coursesRouter); 
app.use('/', typologiesRouter);
app.listen(3006, () => {
});

