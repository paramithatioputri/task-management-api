const express = require('express');
const taskController = require('../controllers/tasks');

const router = express.Router();

router.get('/', taskController.getTask);

module.exports = router;