const express = require('express');
const taskController = require('../controllers/tasks');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', taskController.getTasks);

router.get('/:taskId', taskController.getTask);

router.post('/', [
    body('title').trim().not().isEmpty()
], taskController.createTask);

router.put('/:taskId', [
    body('title').trim().not().isEmpty()
], taskController.updateTask);

router.delete('/:taskId', taskController.deleteTask);

module.exports = router;