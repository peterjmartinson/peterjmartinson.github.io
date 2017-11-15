---
layout: post
title: Don't return the call - Callback instead!
---

Callbacks took me a while to understand, while they are a fundamental part of JavaScript, and especially Node.js. The concept finally clicked while working on a Slack slash command with the [Chingu Penguins cohort](https://chingu-cohorts.github.io/chingu-directory/), called [Pengo](https://pengo.herokuapp.com). The key take away is that there are two categories of functions - those that use `return`, and those that use callbacks. A function that sends a HTTP request needs a callback, while one that does internal operations can simply use `return`.

When the Slack user invokes `/pengo`, one of several useful programming tips is recalled from a [MongoDB](https://www.mongodb.com/) database on [mLab](https://mlab.com/). The steps required are:
1. receive POST request from Slack
2. Request document from mLabs database
3. Receive quote response from the database
4. Format the quote in a JSON object
5. Send the JSON object back to Slack

The place callbacks clicked for me is step 3. `pengo.js` sends the request to a function, `getQuote.atRandom()`, which queries the database and serves the response back to `pengo.js` to play with. The problem is that it may take time for the database query to run, and the `getQuote.atRandom()` may complete before the query is finished.

My initial construction of `getQuote.atRandom()` was the following:

{% highlight JavaScript %}
atRandom : function() {
  Quote.count({}, function(err, N) {
    if (err) callback(err);
    var id = Math.floor(Math.random() * N);
    Quote.find({ quote_id : id }, function(err, result) {
      if (err) return err;
      else return result;
    });
  });
}
{% endhighlight %}

Now, if `pengo.js` calls the function with `var quote = getQuote.atRandom();`, `quote` will always end up `undefined`. This is because the `return` statement is reached before the database query finishes its run. The solution here is to use a *callback*.

Callbacks are functions within other functions that fire off when the parent function has completed. JavaScript is designed to pause the parent function until a response returns after a request was sent. In other words, you dump the `return` statement and replace it with a callback.

The way I implemented this is as follows. First, replace the `return` with a callback. Note, you just call it *callback*:

{% highlight JavaScript %}
atRandom: function(callback) {
  Quote.count({}, function(err, N) {
    if (err) callback(err);
    var id = Math.floor(Math.random() * N);
    Quote.find({ quote_id : id }, function(err, result) {
      if (err) callback(err);
      else callback(null, result, id);
    });
  });
}
{% endhighlight %}

Notice a few things. The callback accepts multiple parameters, but the first is designated for any error conditions. If there's no error, set the first parameter to `null`. The savvy reader will also notice that, while my function implements a callback, it also *invokes* two callbacks, because there are two calls to the database.

Second, do the business in `pengo.js` *within the callback function*:

{% highlight JavaScript %}
getQuote.atRandom(function(err, quote) {
  if (err) console.error(err);
  //
  // 'quote' is now the response object
  // do with it what you will!
  //
  var data = quote.text;
  response.send(data);
});
{% endhighlight %}

The guts of this statement is within the function, or callback, which waits until the HTTP request has completed before running.

It's a slight difference in how to write a function (using `callback` instead of `return`), but the `returns` are great.
