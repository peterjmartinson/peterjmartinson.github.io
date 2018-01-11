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
      noteCtrl = require('../controllers/note.ctrl');


describe('The canary', function() {
  it('tweets', function() {
    assert.ok(true);
  });
});

describe('noteCtrl', function() {



  describe('postNote()', function() {

    let test_date, test_data,
        ran = false,
        test_note = "test note",
        req = { body: { thenote: test_note } },
        res = {},
        db = {};

    function insertOne(ops) {
      test_date = ops.created_date;
      test_data = ops.note_text;
      ran = true;
      return ops;
    }

    db.collection = function(name) {
      return {
        insertOne: insertOne
      }
    }

    // TEST CASES
    it('should exist', function() {
      assert.equal(typeof noteCtrl.postNote, 'function');
    });
    
    it('should run the query', function() {
      noteCtrl.postNote(req, res, db);
      assert.equal(ran, true);
    });

    it('should create a date', function() {
      noteCtrl.postNote(req, res, db);
      assert(test_date instanceof Date);
    });

    it('should post data', function() {
      noteCtrl.postNote(req, res, db);
      assert.equal(test_data, test_note);
    });

  });

  describe('getAllNotes()', function() {
    it('should exist', function() {
      assert.equal(typeof noteCtrl.getAllNotes, 'function');
    });
  });

});


