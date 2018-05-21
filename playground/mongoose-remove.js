const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5afe775a733094241bf1c509';

Todo.remove({}).then((result) => {
    console.log(result);
});

Todo.findOneAndRemove({_id: id}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove(id).then((todo) => {
    console.log(todo);
});