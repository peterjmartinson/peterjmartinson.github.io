---
layout: post
title: How to break a program’s bottleneck - nested loops
excerpt: <em>bottleneck (noun)</em> — what the wine hits as you are pounding from the bottle.
---

> bottleneck (noun) — what the wine hits as you are pounding from the bottle.

In mechanical terms, wine can flow free and fast up to the bottle’s neck. Once it hits the neck, due to the conservation of mass, the throughput must go down. The only ways to flow more wine per second are to either 1. knock a hole in the bottle’s base (“shotgunning” the wine), or 2. bust off the bottleneck.

Either way, you need to change the shape of the container.

Recently, [Jay Schwane](https://medium.com/u/c76756b9e066) and I assembled a Slack integration called [Whobot](http://belcurv.com/whobot). The integration is a [slash command](https://api.slack.com/slash-commands) that remembers team member skills. For example, Whobot will save a user’s skills in response to the command: `/whobot I know angular, react, vue.`  Now, other users can type `/whobot who is @user` to see those skills. All users who know a specific skill, Python for example, can be seen by entering `/whobot who knows Python`.

We built Whobot specifically for use in [Chingu Cohorts](https://tropicalchancer.github.io/projectus/)’ Slack channels, which are geared for collaborating on programming projects, so it is currently configured to remember programming skills. However, it could easily be extended to any problem domain.

During a presentation of Whobot that I gave at a [recent meetup](https://www.meetup.com/nodejs-philly/), one of the participants pointed out a problematic bit of code. The code in question forms a double loop, and almost every function in the program runs through it. Scale up Whobot, and it would be brought to a crawl by this double loop.

With the bottleneck now exposed, it had to be smashed.

## Benchmarking

Several functions below will be tested for performance, but how will we measure this? Modern browsers give us the global/window method `performance.now()` which is accurate to 5 thousandths of a millisecond! We can use some simple benchmarking utilities to measure the execution times for various algorithms. The code snippet below shows our benchmarking utilities as well as a simple `render` function to output to the DOM. The `render` function is passed to `benchmark` as a callback. This code is common to our tests; it will make more sense when you see the jsfiddle snippets.

<script src="https://gist.github.com/peterjmartinson/1ffd188efe45c9de700d86e63f431889.js"></script>

Now we can define any number of _functions under test_ and pass them into `runBenchmarkTest` as its second argument.

> _It should be noted that the performance results reported in this article were generated on the following hardware: Dell Lattitude 6430u, Intel Core i7–3687U, 8GB RAM, Ubuntu 16.04 x64, Firefox v54._

## The Tests

The functions we will test attempt to match an input term with a variety of possible variants in a two-dimensional array-like object. The point is to normalize user input skills. For example, “AngularJS” could be referred to as “angularjs”, “angular”, or even “anguler”. Instead of storing the variants, they should all be parsed and stored as “AngularJS”. Procedurally, when a user types “anguler”, the outer loop jumps from master term to master term (the object’s keys), and a nested loop checks the corresponding array of variants (each key’s values). If “anguler” matches any string in the nested array, then the key for that property is returned. If no match is found, the original term (“anguler”) is returned. See the code snippet below, which contains both the double loop, and some of the data it loops over:

<script src="https://gist.github.com/peterjmartinson/a7186142e6ee667809ff238a68c59b36.js"></script>

Results for 10,000 runs:
{% highlight JavaScript %}
Testing: fetchSkill 1
Fastest execution time :  0.000 milliseconds
Median execution time  :  0.005 milliseconds
Slowest execution time :  1.650 milliseconds
Total execution time   : 65.440 milliseconds
{% endhighlight %}

Not bad, but can we speed this thing up?

First we tried to break it up into a hunt phase and a return phase. In the first phase, `hasSkill(“anguler”)` a JavaScript array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) is used to check each property for the skill with [{ `indexOf` }](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).  In the second phase, if `hasSkill` found the given term, the property key is returned, otherwise the given term is just returned. The code is below.

<script src="https://gist.github.com/peterjmartinson/a95e46c15d19ab893b1faa888e960113.js"></script>

Results for 10,000 runs:
{% highlight JavaScript %}
Fastest execution time:  0.000 milliseconds
Median execution time:   0.005 milliseconds
Slowest execution time:  1.895 milliseconds
Total execution time:   55.790 milliseconds
{% endhighlight %}

This appears to offer a modest performance improvement.

Next, we tried just replacing the second loop in the original `fetchSkill` with a simple `indexOf`, as seen below.

<script src="https://gist.github.com/peterjmartinson/5a63adcfa2be4fa06d552b496fa78b1e.js"></script>

Results for 10,000 runs:
{% highlight JavaScript %}
Fastest execution time:  0.000 milliseconds
Median execution time:   0.005 milliseconds
Slowest execution time:  1.395 milliseconds
Total execution time:   34.680 milliseconds
{% endhighlight %}

This was again an improvement, but we could still do better.

It turns out that because all three of the above methods still run a double loop — implicitly if not explicitly — there are only marginal gains to be had by optimizing the algorithm.  *The real bottleneck here is the structure of the skills dictionary in the first place.*  On first glance, the skills dictionary is an object where each key is a unique skill whose property contains an array of variations. But really it is just a fancy two dimensional array. Because of this, we will always need to scan in two directions — down and over. In Big O notation, this is represented as O(N²). No matter how you swing it, you need a nested loop, and improvements will be incremental at best.

_The solution is to change the shape of the container._

Instead of making each master term (e.g. “AngularJS”) a property key, we made each of the variants its own key. Since the data dictionary is now a one dimensional object, only one loop is necessary. The new dictionary is much longer than the original one, and obviously violates the Don’t Repeat Yourself rule, but it offers a magnitude improvement in performance over the two dimensional array.

<script src="https://gist.github.com/peterjmartinson/ef02073bbfc8430b261cd1059e7dc457.js"></script>

Results for 10,000 runs:
{% highlight JavaScript %}
Fastest execution time : 0.000 milliseconds
Median execution time  : 0.000 milliseconds
Slowest execution time : 0.280 milliseconds
Total execution time   : 3.270 milliseconds
{% endhighlight %}

Wow. The median execution time is **faster than we can measure** (0.000 milliseconds)! Because `performance.now()` is accurate to 5 thousandths of a millisecond, we can assume the `0.000` results completed in under 2.5 microseconds. Note the total execution time is an order of magnitude faster than the previous fastest result.  Bottleneck: _smashed_.

The full fiddle is below, where you can test all four versions side by side:

<figure name="041c" id="041c" class="graf graf--figure graf--iframe graf-after--p">
<iframe src="https://jsfiddle.net/j8stx7sh/21/embedded/" width="600" height="400" frameborder="0" scrolling="no">
</iframe>
</figure>

We ultimately kept the original 2D data model, but dynamically flatten it out into a temporary 1D array during runtime. This way we retain the advantage of a two dimensional structure for readability and editing, while gaining the advantage of single loop speed.

## Conclusion

The moral of this story is, when you find yourself having to write subpar code, it pays to pause for a moment, pound a bit of your chosen beverage, and look at how your data is organized.

[{ Jay Schwane }](https://medium.com/u/c76756b9e066) helped immensely in this article’s preparation.
