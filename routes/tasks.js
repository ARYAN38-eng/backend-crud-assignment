const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');


router.get('/',getAllTasks);
router.get('/:id',getTaskById)
router.post('/',authenticateToken,createTask)
router.put('/:id',authenticateToken,updateTask);
router.delete('/:id',authenticateToken,deleteTask);

module.exports= router;