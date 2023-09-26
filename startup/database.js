const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://127.0.0.1:27017/task_manager').then(() => {
        console.log('Connected to MongoDB');
    }).catch((e) => console.log(e));

}