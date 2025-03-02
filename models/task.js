const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        status: {
            type: String,
            default: 'pending'
        },
        dueDate: {
            type: Date
        }
    }
);

module.exports = mongoose.model('Task', taskSchema)