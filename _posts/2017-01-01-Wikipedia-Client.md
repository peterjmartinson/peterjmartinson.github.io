---
layout: post
title: Wikipedia Viewer
excerpt: Wikipedia Viewer allows a user to search for a Wikipedia entry or to get a random Wikipedia page.
---

<div class="tags">
  <span>#AJAX</span>
  <span>#HTML</span>
  <span>#CSS</span>
</div>

### Description

Wikipedia Viewer allows a user to search for a Wikipedia entry or to get a random Wikipedia page.  It consists of a search bar and a list of result links that will open Wikipedia entries.

### Execution

This project used the [{Wikipedia API}](https://www.mediawiki.org/wiki/API:Main_page).  It provides a simple endpoint for random articles, [{`https://en.wikipedia.org/wiki/Special:Random`}](https://en.wikipedia.org/wiki/Special:Random), so a new browser window is simply opened with this address.  To perform a search, jQuery's `$.get()` function is used, which returns a JSON object that contains a list of results.  This object is parsed, and turned into an unordered list of links under the search bar.  Clicking on any one opens the link in a new browser window.

{% highlight JavaScript %}
function listResults(res) {
  var list = '<ul>';
  res.query.search.forEach(function(e) {
    var list_element = '';
    var link = 'https://en.wikipedia.org/wiki/' + e.title.replace(/\s+/g,'_')
    list_element += '<li>';
    list_element += '  <a href="' + link + '" target="_blank">';
    list_element += '  <strong>' + e.title + '</strong><br>';
    list_element += '  <em>' + e.snippet + '</em>';
    list_element += '  </a>';
    list_element += '</li>';
    list += list_element;
  });
  list += '</ul>';
  return list;
}

dom.search.onclick = function() {
  var val = dom.search.form.searchy.value.replace(/\s+/g,'%20');
  var wiki_url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + val + '&origin=*';
  dom.results.innerHTML = 'Searching...';
  $.get(wiki_url, function(response) {
    dom.results.innerHTML = listResults(response);
  });
}
{% endhighlight %}

Because I generally don't like the usual HTML link decorations (blue text, underline), I made each of the links a plain blue rectangle that displays an orange highlight at the left edge when under the mouse pointer.

{% highlight CSS %}
section li {
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  border-left: 5px solid #0c1c45;
  background: #0c1c45;
  color: #bec6da;
  box-shadow: 2px 2px 3px 0px #0c1c45;
}

section li a {
  display: block;
  color: #bec6da;
  text-decoration: none;
}

section li:hover {
  border-left: 5px solid #FF7600;
}
{% endhighlight %}

Besides these internals, the styling is similar to my old portfolio page, but without the massive sidebar at the left.

<section class="project-links">
  <a href="../docs/wikipedia-viewer/index.html" target="_blank">Demo</a>
  <a href="https://github.com/peterjmartinson/peterjmartinson.github.io/tree/master/docs/wikipedia-viewer" target="_blank">Source</a>
</section>
