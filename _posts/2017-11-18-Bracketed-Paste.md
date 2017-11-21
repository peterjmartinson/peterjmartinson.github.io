---
layout: post
title: Help! My PASTE is broken in Linux!
excerpt: Paste STRING instead of 0~STRING1~ at the terminal.
tags: linux, bash
---

## The Problem

You want to clone your GitHub repository to your local machine.  To do so, you go to the GitHub repo, hit the clipboard, switch to your local terminal, type `git clone` and hit `ctrl-shift-v`.  But, strange characters show up around the URL you just pasted.

If you're like me, you suck it up and delete the characters for a few weeks, since you don't clone too often.  Then, you really suck it up and look for a solution.  Googling "get rid of the weird characters that paste into Linux terminal" gets you little succor.

## The Solution

I finally found the solution in a post by [{ Conrad Irwin }](https://cirw.in/blog/bracketed-paste).  These paste artifacts are the result of what's called _bracketed-paste mode_ in the Linux terminal.

The idea is that, when pasting, newline characters tend to have unwanted effects.  You see this happen if you try to paste anything into a shell editor, like Vim.  Vim tries to perform it's smart auto indenting, like a good editor, but the output gets all screwed up.

To deal with this, _bracketed-paste mode_ puts whatever you paste in between two sets of unlikely strings of characters, the *brackets*.  These characters tell the terminal, "Hey, treat the string between the brackets special."

However useful the inventor though this would be, it sucks when you find yourself pasting wierd characters and don't know how to turn it off.  If you find yourself at the terminal in this situation, type

{% highlight bash %}
$ printf "\e[?2004l"
{% endhighlight %}

(That's an L as in _liquor_ at the end)  If, for some reason, you want to enable this mode, type `printf "\e[?2004h"` instead.
