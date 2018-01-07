// SERVER
    // ROUTES
    app.post('/', function(req, res) {
      todoCtrl.postTodo(req, res, db, console.log);
      res.redirect('/'); // reload index.html
    })

// CONTROLLER
  function postTodo(req, res, db, callback) {

    let new_document = {
      created_date : new Date(),
      todo_text : req.body.todo
    }

    db.collection("todos")
      .insertOne(new_document, function(err, result) {
      callback(err, result);
    });

  }

  module.exports = {
    postTodo
  }



// TEST
const MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      todoCtrl = require('../controllers/todo.ctrl');


describe('todoCtrl', function() {

  describe('postTodo()', function() {

    // SETUP
    function insertOne(ops, callback) {
      let error  = null,
          result = { ran: true, ops: ops };
      callback(error, result);
    }

    let test_todo = "test todo",
        req = { body: { todo: test_todo } },
        res = {},
        db = {};

    db.collection = function(name) {
      return {
        insertOne: insertOne
      }
    }

    // TEST CASES
    it('should exist', function() {
      assert.equal(typeof todoCtrl.postTodo, 'function');
    });
    
    it('should run the query', function(done) {
      todoCtrl.postTodo(req, res, db, function(err, result) {
        assert.ok(result.ran);
        done();
      });
    });

    it('should create a date', function(done) {
      todoCtrl.postTodo(req, res, db, function(err, result) {
        assert(result.ops.created_date instanceof Date);
        done();
      });
    });

    it('should post data', function(done) {
      todoCtrl.postTodo(req, res, db, function(err, result) {
        assert.deepEqual(result.ops.todo_text, test_Todo);
        done();
      });
    });

  });

});


