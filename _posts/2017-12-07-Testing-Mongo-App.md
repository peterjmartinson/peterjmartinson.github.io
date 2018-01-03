---
layout: post
title: How to test a MongoDB app
excerpt: Hint - you fake it!
tags: [Node.js, MongoDB, MochaJS]
---

Unit testing JavaScript apps is my obsession.  Testing calls to MongoDB, however, is my Spassky, my Moriarty, my Nemesis.

Let's see if this sounds familiar.  You start building a JavaScript app that uses a MongoDB, and you load up Mongoose, and you get all your routes calling the database, and it's all working just great.  A few days later, you think, "I should probably write some unit tests for this, so it at least looks like I care."  So, you get your Mocha and your Sinon fired up, and a month later you're still trying to figure out how to write your first test of a Mongoose `.findOne` call.

OK, perhaps you have never had this experience, but I have.  And, I just figured out how to do it right.

### The Philosophy

Michael Feathers wrote a great book everybody should read: "Working Effectively with Legacy Code".  He treats legacy code not just as old code you need to modify, but any code that isn't covered by tests.  Before you start whacking away at an existing code base, you need to get everything under test conditions so you know you're not blowing anything up with your changes.

But, as in the above example, even simple code is sometimes very challenging to test.

In his book, Feathers describes what he calls a *seam*.  He defines the seam as "a place where you can change the behavior of a program without changing the surrounding code".  It's a place in the program where something calls *out* to some other place in the code base.  If you can replace that seam's target with a fake target, then you can hang a test on that fake target.  The initial task of the programmer is to find those seams, and then construct test fakes.

When you make a call to the database, the code you use is an API form of the database's access language.  What exact code you use depends on which package you're using to make the calls.  In the above example, we use [{ Mongoose }](LINK).  If you're hitting a relational database, you may use something like [{ Sequelize }](LINK).

Mongoose's `.findOne` method is a seam.  When run, the program looks in the Mongoose modules for the function definition, and then runs the corresponding instructions against the database.  To use this as a seam, you redirect your program to a different function with the same name, that you wrote, that can then be used for testing purposes.

When I initially tried to write these tests, it was a steep learning curve to figure out how to produce those test fakes.  99% of the tutorials I found started by installing Sinon, and then proceeded to sling stubs and spies around.

What I didn't understand was that my unit tests were not supposed to be used to test access to the database.  They were supposed to test the logic of the functions that call the database.

To test that your queries get the right data out of the database, you open your database shell and run the queries!  To test the program, you create fakes.  And, you don't need Sinon to do that.

## The Function

