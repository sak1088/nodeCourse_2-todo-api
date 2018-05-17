var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,              // Makes the field compulsory
        minlength: 1,              // Check if minlength is 1, if not throws error 
        trim: true                  // Removes the heading and trailing white spaces
    },
    completed: {
        type: Boolean, default: false
    },
    completedAt: {
        type: Number, default: null
    }
});

module.exports = {Todo};