// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

/*var user = {name: 'Saket', age: 29};
var {name} = user; // This concept is called object destructuring..
console.log(name);*/

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    if(err){
        return console.log('Unable to connect to mongoDb server');
    }
    console.log('Connected to connect to mongoDb server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Todo something', 
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert Todo');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Saket', age: '29', 
    //     location: 'Bangalore'
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert Users');
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });

    client.close();
});