const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: "1st todo"
}, {
    _id: new ObjectID(),
    text: "2nd todo",
    completed: true,
    completedAt: 345
}];

beforeEach((done) => {
    //Todo.remove({}).then(() => done());
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'do something';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                // Testing the returned body to be the same text
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                // Testing the data inserted into DB is same text
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    // negative test case for same API
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                // Testing the data inserted into DB is same text
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return the doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get('/todos/6afe775a733094241bf1c509')
            //.get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    // expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete('/todos/6afe775a733094241bf1c509')
            .expect(404)
            .end(done);
    });

    it('should return 404 if Object Id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'Edited by test case';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text: text,
                completed: true})
            .expect(200)
            .expect((res) => {
                // Testing the returned body to be the same text
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'Edited by 2nd test case';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false, text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});