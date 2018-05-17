var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,              // Makes the field compulsory
        minlength: 1,               // Check if minlength is 1, if not throws error 
        trim: true                  // Removes the heading and trailing white spaces
    }
});

module.exports = {User};