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

When you make a call to your database, you use a combination of JavaScript and whatever language is used by the database.  If you're sane, you test your database queries in whatever shell your database gives you.  Once your queries are tuned, then you hard-code them into your app.



## The Function

The final project is a fully functional MongoDB swag store.

[SCREEN SHOT]

It uses Express and Body Parser, as most Node.js backends do, but instead of hitting the database with Mongoose, it uses the raw [Node driver for MongoDB](LINK).  It's a little more complicated than Mongoose, but the queries look almost identical to those you'd use in the Mongo shell.

The function I decided to test returns a count of all products within each product category, as well as a total.  The resulting collection needs to be sorted according to the product name, then passed to a callback.

Because I'm not quite at TDD yet, I wrote the guts of the function first:

{% highlight JavaScript %}
this.getCategories = function(callback) {
  "use strict";

  let category_total = 0,
      categories = [],
      sorted_categories = [];

  this.db.collection("item").aggregate( { $group: { _id:"$category", num:{$sum:1}} }, { $sort: { _id:-1} })
    .toArray(function(err, docs) {
      assert.equal(null, err);

      docs.forEach(function(doc) {
        category_total += doc.num;
        categories.push(doc);
      });

      categories.push( { "_id": "All", "num": category_total } );

      sorted_categories = categories.sort(function(a, b) {
        if ( a._id < b._id ) { return -1; }
        if ( a._id > b._id ) { return 1; }
        return 0;
      })

      callback(sorted_categories);
  });
}
{% endhighlight %}

First, the database is queried using the `.aggregate` document, then the results are passed into a callback as an array of documents.  After error checking, a total number of items is calculated.
