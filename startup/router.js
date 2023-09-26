const express = require('express');
const tasks = require('../routes/tasks');
const Users = require('../routes/Users');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/task', tasks);
    app.use('/api/user', Users);
    app.use(error);
}