---
layout: post
title: Why you should write a Linux shell script
excerpt: Here are some basics for writing a first shell script
tags: [Linux]
---

## Introduction

My Jekyll blog on GitHub is pretty new, but it's great.  I've written a few posts on my [WordPress blog](http://stonetelescope.wordpress.com), but using the CMS editor always felt clunky.  Also, I tend to write in places where I don't have internet access, like the train, so I end up composing in a local editor anyway.  Hence, the Jekyll blog fits me great.

One thing that I felt should be just a *little* smoother, though, was creating the initial blog post file.  They all have the same format, so what a great opportunity for automation!

I decided to write a Linux shell script to create a starter file for each post.

## Bash basics

I'm using the Bourne Shell, aka Bash, so you may need to tweak some things here if you're using a different shell (like ksh).

First, fire up your text editor and start your script with a *shebang*.  
