---
layout: post
title: How to test a MongoDB app
excerpt: Hint - you fake it!
tags: [Node.js, MongoDB, MochaJS]
---

Unit testing JavaScript apps is my obsession.  Testing calls to MongoDB, however, is my Spassky, my Moriarty, my Nemesis.

Let's see if this sounds familiar.  You start building a JavaScript app that uses a [{ MongoDB }](LINK), and you load up [{ Mongoose }](LINK), and you get all your routes calling the database, and it's all working just great.  A few days later, you think, "I should probably write some unit tests for this, so it at least looks like I care."  So, you get your [{ Mocha }](LINK) and your [{ Sinon }](LINK) fired up, and a month later you're still trying to figure out how to write your first test of a Mongoose `.findOne` call.

OK, perhaps you have never had this experience, but I have.  And, I just figured out how to do it right.

### The Philosophy

Michael Feathers wrote a great book everybody should read: [{ "Working Effectively with Legacy Code" }](LINK).  He treats legacy code not just as old code you need to modify, but any code that isn't covered by tests.  Before you start whacking away at an existing code base, you need to get everything under test conditions so you know you're not blowing anything up with your changes.

But, as in the above example, even simple code is sometimes very challenging to test.

In his book, Feathers describes what he calls a *seam*.  He defines the seam as "a place where you can change the behavior of a program without changing the surrounding code".  It's a place in the program where something calls *out* to some other place in the code base.  If you can replace that seam's target with a fake target, then you can hang a test on that fake target.  The initial task of the programmer is to find those seams, and then construct test fakes.

When you make a call to the database, the code you use is an API form of the database's access language.  What exact code you use depends on which package you're using to make the calls.  In the above example, we use [{ Mongoose }](LINK).  If you're hitting a relational database, you may use something like [{ Sequelize }](LINK).

Mongoose's `.findOne` method is a seam.  When run, the program looks in the Mongoose modules for the function definition, and then runs the corresponding instructions against the database.  To use this as a seam, you redirect your program to a different function with the same name, that you wrote, that can then be used for testing purposes.

When I initially tried to write these tests, it was a steep learning curve to figure out how to produce those test fakes.  99% of the tutorials I found started by installing Sinon, and then proceeded to sling stubs and spies around.

What I didn't understand was that my unit tests were not supposed to be used to test access to the database.  They were supposed to test the logic of the functions that call the database.

To test that your queries get the right data out of the database, you open your database shell and run the queries!  To test the program, you create fakes.  And, you don't need Sinon to do that.

## The Function

The function we will test simply inserts a date and some text to the database using a POST request.  Instead of using Mongoose, we'll use the [{ MongoDB driver for Node }](LINK), because I like working close to the metal.

Out of the box, the function will look like this:

{% highlight JavaScript %}
(function() {
  'use strict';

  function postTodo(req, res, db) {

    let new_document = {
      created_date : new Date(),
      todo_text : req.body.todo
    }

    db.collection("todos").insertOne(new_document);

    return true;

  }

  module.exports = {
    postTodo
  }

}());
{% endhighlight %}

This function doesn't do much.  It creates a new document from the [{ Express }](LINK) (or whatever) request body, and inserts it into the collection.  In a real application, you probably would return some more information, or throw in a callback, but this is stripped down so the testing can be made clear.

What would we like to test?  Should we test that the document was properly inserted into the collection? *NO*!  To test that, either open a database shell and manually check, or create an *acceptance* test.  Unit tests are designed to check the logic of your function, no more than that.

That said, we can test whether the `.insertOne` method was run, and whether the `new_document` passed into it contains a date and whatever text was included in `req.body.todo`.

According to Feathers, the right strategy here is to find a place where the function can be modified without changing anything inside of it.  In other words, some place where the function calls some reference external to it.  In our case, that's the `.insertOne` method.

### The Test

We will create a fake `.insertOne` method that will replace the MongoDB driver's own `.insertOne` method, but only when tests are run.  

In order to create a fake method, you first need to create the whole fake object that has it.  In this case, `.insertOne` is a method on the `db.collection` object, itself a method on the `db` object.  We need to fake all that.

{% highlight JavaScript %}
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
{% endhighlight %}

This has three parts:  the `db` object, the fake `.insertOne` function, and the variables used by the test.

The `db` object is declared at the top, and its method `.collection` declared below.  `db.collection()` takes an argument (the name of the collection).  This argument must be included in the function signature, but we don't need to do anything with it.  All the faked version of this method does is return an object that contains our target test method, `insertOne`.

The function `insertOne` has an argument that is in the form of an object with two properties, `created_date` and `note_text`.  Both of these are declared and defined by the function being tested, `postTodo`.  If you look back at the original function definition, you'll see that `created_date` is simply a new date, but `note_text` is part of the request object `req`.  This request object also needs to be faked, as seen in the variables declared at the top of the test.

`insertOne` pumps the two properties of its argument into test variables, flags another variable to indicate the function ran, and then returns the argument.

Now, let's look at the tests themselves.

{% highlight JavaScript %}
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
{% endhighlight %}

The first test is fundamental, and just makes sure we didn't delete the function.  The second test checks the `run` flag, to make sure it was flipped to *true*.  The third checks that a JavaScript `Date` object was passed into the `insertOne` method correctly.  The fourth checks that the correct text was sent into `insertOne`.

Each of the tests look at values that were set by the faked function.  
