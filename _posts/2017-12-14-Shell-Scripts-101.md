---
layout: post
title: Why you should write a Linux shell script
excerpt: Here are some basics for writing a first shell script
tags: [Linux]
---

### Introduction

My Jekyll blog on GitHub is pretty new, but it's great.  I've written a few posts on my [{ WordPress blog }](http://stonetelescope.wordpress.com), but using the WordPress editor always felt clunky.  Also, I tend to write in places where I don't have internet access, like the train, so I end up composing in a local editor anyway.  Hence, the Jekyll blog fits me great.

One thing that I felt should be just a *little* smoother, though, was creating the initial blog post file.  They all have the same format, `YYYY-MM-DD-Title.md`, and standard headers - what a great opportunity for automation!  So I decided to write a Linux shell script to create a starter file for each post.

The goal of the script is to be able to type something like

{% highlight bash %}
$ ./script.sh New Post
{% endhighlight %}

and end up with a file called `2017-12-17-New-Post.md` with the following lines at the top:

{% highlight yaml %}
---
layout: post
title: 
excerpt: 
tags: []
---
{% endhighlight %}

### Shebang!

I'm using the Bourne Shell, aka Bash, so you may need to tweak some things here if you're using a different shell (like ksh).

All shell scripts are named with the `.sh` suffix and begin with a [{ *shebang* }](WIKIPEDIA).  The shebang is `#!` followed by text.  Though it looks like a comment, the program loader sees this and then runs the interpreter which follows.  In other words, a shell script is a series of shell commands run through the interpreter identified in the shebang.

First, find out where your interpeter is:

{% highlight bash %}
$ which bash
{% endhighlight %}

This should result in something like `/bin/bash`.  Thus, the first line of your shell script should read `#!/bin/bash`.

### Bash Basics

Before doing anything else, save your file and get thee to the command line.  To run your script, you need to change permissions with `chmod`.  So, just type in

{% highlight bash %}
$ chmod +x bash.sh
{% endhighlight %}

When you want to run your script, you type `$ ./script.sh`.  If you don't prefix the program with `./`, then the loader will only look in the directories specified in the $PATH environment variable.  `./` says "look in the current directory".  Yeah, I always wondered about that too.

Now, open the script in your editor again, and write in a command line command.  For example, you can write

{% highlight bash %}
#!/bin/bash

ls
{% endhighlight %}

When you run your script with `./script.sh`, you'll get a listing of the current directory's contents.  In general, you can write any command you want in your script.

The two commands we'll need for our script are `echo` and `date`.  Go ahead and test them right now.  `echo <string>` will just repeat the `<string>` argument, while `date` will, you guessed it, output the current date.  

`echo` can also be used to create new files, which is what we want to do.  For example, at the command line, enter the following:

{% highlight bash %}
$ echo Gripping Content > 2017-01-01-Awesome-New-Post.md
{% endhighlight %}

This creates a new file, 2017-01-01-Awesome-New-Post.md, that contains some "Gripping Content".  The greater than sign (`>`) tells the interpreter to take whatever output comes from the previous command, and put it into the file indicated.  If the file doesn't exist, then create it.  If the file does exist, all the contents will be replaced.

You can now put this whole command into your script, and run it that way.  We will replace "Gripping Content" with our header text, but we need to find a way to replace the title with something that generates the date automatically and then concatenates it with the title and the file suffix.

So, thus far we have this:

{% highlight bash %}
#!/bin/bash

echo -e '---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n## Introduction' > 2017-01-01-Awesome-New-Post.md
{% endhighlight %}

Note:  the `\n` sequences are newline characters, and the `-e` makes `echo` read those newlines properly.

### Variables

To make the title dynamic, we need to learn a few things about Bash variables.

Simple variables are simple.  For example, `a=1` sets `a` equal to 1.  You don't need to declare a type or anything special.  However, to use the variable, you must precede it by a dollar sign.  So, `b=$a` will set `b` equal to `a`'s contents.
