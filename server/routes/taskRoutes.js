const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

const allowedFields = ['title', 'description', 'isCompleted', 'dueDate'];

function validateObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid task ID');
    error.statusCode = 400;
    throw error;
  }
}

function pickTaskFields(body = {}) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );
}

// POST /api/tasks - create a task
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(pickTaskFields(req.body));
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
});

// GET /api/tasks?completed=true|false - read all tasks
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed !== undefined) {
      if (!['true', 'false'].includes(req.query.completed)) {
        const error = new Error('Query parameter "completed" must be true or false');
        error.statusCode = 400;
        throw error;
      }
      filter.isCompleted = req.query.completed === 'true';
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
});

// GET /api/tasks/:id - read one task
router.get('/:id', async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/tasks/:id - partially update a task
router.patch('/:id', async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const updates = pickTaskFields(req.body);
    if (Object.keys(updates).length === 0) {
      const error = new Error('At least one valid task field is required');
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
