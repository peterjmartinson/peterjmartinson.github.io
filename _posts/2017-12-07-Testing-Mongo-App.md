---
layout: post
title: How to test a MongoDB app
excerpt: Hint: you fake it!
tags: [Node.js, MongoDB, MochaJS]
---

Unit testing JavaScript apps is my Shangri La, and testing calls to MongoDB my Nemesis.

For other projects, I'd experimented with writing unit tests for functions that query MongoDB databases.  Usually, it involved creating [Sinon.js](LINK) spies and stubs, and then cobbling together stringed methods.  I never got it to quite work well, and always caught myself thinking that I may be testing my test here, not the function.

I'm on the final project for MongoDB's course "M101JS - MongoDB for Node Developers", and figured out how to write a real unit test, without using Sinon.  Here it is.

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
