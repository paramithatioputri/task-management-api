const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(bodyParser.json())

app.use('/tasks', taskRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    })
})

mongoose.connect('mongodb+srv://paramitha:Xyr0bkq3HrsW5ZUT@cluster0.mecuh.mongodb.net/tasks')
    .then(() => {
        app.listen(8080);
    })
    .catch(err => console.log(err))