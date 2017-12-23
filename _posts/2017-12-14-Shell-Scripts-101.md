---
layout: post
title: Why you should write a Linux shell script
excerpt: Here are some basics for writing a first shell script
tags: [Linux]
---

### Introduction

My Jekyll blog on GitHub is pretty new, but it's great.  I've written a few posts on my [{ WordPress blog }](http://stonetelescope.wordpress.com) before, but using the WordPress editor always felt clunky.  Also, I tend to write in places where I don't have internet access, like the train, so I end up composing in a local editor anyway.  Hence, the Jekyll blog, composed in Markdown with a basic editor, fits me great.

One thing that I felt should be just a *little* smoother, though, was creating the initial blog post file.  They all have the same format, `YYYY-MM-DD-Title.md`, and standard headers.  This should be something that can be automated.  So I decided to write a Linux shell script to create a starter file for each post.

For you Windows people, a shell script is a little like a batch (.bat) file.  It's essentially a list of commands that need to be run in sequence to make something interesting happen.  Putting it all in a script (or batch file) lets you run all those without typing them in.

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

So, let's get started.

### Shebang!

I'm using the Bourne Shell, aka Bash, so you may need to tweak some things here if you're using a different shell (like ksh).

All shell scripts are named with the `.sh` suffix and begin with a [{ *shebang* }](http://www.tldp.org/LDP/abs/html/sha-bang.html).  The shebang is `#!` followed by text.  Though it looks like a comment, the program loader sees this and then runs the interpreter which follows.

In other words, a shell script is a series of shell commands run through the interpreter identified in the shebang.

First, find out where your interpeter is:

{% highlight bash %}
$ which bash
{% endhighlight %}

This should result in something like `/bin/bash`.  Thus, the first line of your shell script should read `#!/bin/bash`.

### Bash Basics

Before doing anything else, save your file and get thee to the command line.  To run your script, you need to change permissions with [{ `chmod` }](https://www.linux.org/threads/file-permissions-chmod.4124/).  So, just type in

{% highlight bash %}
$ chmod +x bash.sh
{% endhighlight %}

After you set your permissions, you run your new script with `$ ./script.sh`.  

Why the `./`?  Remember above when you typed `$ which bash`?  The interpreter responded by telling you where the program `bash` is located.  Yes, each command is actually a *program* that lives somewhere special.  When you run a program, the program loader looks for it in one of the directories listed in the $PATH variable.  The trick is, the program loader will look *nowhere else*, even the current directory.  By preceding your new program with `./`, you're telling the program loader to skip $PATH and look in the current directory.

Yeah, I always wondered about that too.

Open the script in your editor again, and write in a command line program.  For example, you can write

{% highlight bash %}
#!/bin/bash

ls
{% endhighlight %}

Now, when you run your script with `$ ./script.sh`, you'll get a listing of the current directory's contents.  In general, you can write any command you want in your script.

The two commands we'll need for our script are `echo` and `date`.  Go ahead and test them right now.  `echo <string>` will just repeat the `<string>` argument, while `date` will, you guessed it, output the current date.  

`echo` can also be used to create new files, which is what we want to do.  For example, at the command line, enter the following:

{% highlight bash %}
$ echo Gripping Content > 2017-01-01-Awesome-New-Post.md
{% endhighlight %}

This creates a new file, 2017-01-01-Awesome-New-Post.md, that contains some "Gripping Content".  The greater than sign (`>`) tells the interpreter to take whatever output comes from the previous command, and put it into the file indicated.  If the file doesn't exist, then create it.  If the file does exist, all the contents will be replaced.

You can now put this whole command into your script, and run it that way.  Let's do that, but replace "Gripping Content" with the header we want in our file.  

So, thus far we have this:

{% highlight bash %}
#!/bin/bash

echo -e '---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n## Introduction' > 2017-01-01-Awesome-New-Post.md
{% endhighlight %}

Note:  the `\n` sequences are newline characters, and the `-e` makes `echo` read those newlines correctly.

Good work, but now we need to find a way to replace the title with something that generates the date automatically and then concatenates it with the title and the file suffix.

### Variables

To make the title dynamic, we need to learn a few things about Bash variables.

Simple variables are simple.  For example, `a=1` sets `a` equal to 1.  You don't need to declare a type or anything special.  However, to use the variable, you must precede it by a dollar sign.  So, `b=$a` will set `b` equal to `a`'s contents.

Let's get fancy and set a variable equal to today's date.  At the command prompt, `$ date +%Y-%m-%d` will print out the date in YYYY-MM-DD format, like 2017-12-01.  In the script, we can't just write `a=date +%Y-%m-%d` because the interpreter will get confused.  To set a variable equal to the output of a program, you need to surround the program with backticks, so ``a=`date +%Y-%m-%d` ``.  Now, any time we want to use that date, we can use `$a` instead.  For example,

{% highlight bash %}
#!/bin/bash

title=`date +%Y-%m-%d`
title+=-Awesome-New-Post

echo -e '---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n## Introduction' > $title.md
{% endhighlight %}

will produce a new file called 2017-12-01-Awesome-New-Post.md.

Notice the fast one I pulled in the fourth line above.  The `+=` operator appends strings or adds value to an existing variable, just like in other programming languages.

So, we're almost there!  We need to learn about arrays before we finally get to command line arguments.

Arrays are declared between parentheses without any kind of separators

{% highlight bash %}
arr=( 1 2 3 )
{% endhighlight %}

The values of an array are accessed with `${a[index]}`, which is a little bit clunky, but there it is.

Bash allows you to access the length of the array with the special symbol `#`.  Actually, `#` will give you the length of any variable, including strings.  To get the length of an array, Bash needs to be told to look at the *entire* array, with the `@` symbol.

These combine with a `for` loop as follows:

{% highlight bash %}
#!/bin/bash

arr=( 1 2 3 )

for (( i = 0; i < ${#arr[@]}; i++ ));
do
  echo ${arr[i]}
done
{% endhighlight %}

Note the syntax of the loop.  The loop's block is delimited by `do` and `done`, and you use *double* parentheses around the the loop arguments.

Now we will take all our knowledge of variables and combine that with command line arguments to finish up our blog script.

### Don't argue

The strings that follow a Bash command are its arguments.  These arguments are passed into the script as an array.  That array is accessed in a slightly different way than other variable arrays.  For example

{% highlight bash %}
#!/bin/bash

arg1=("$1")
arg2=("$2")

echo ${arg1}
echo ${arg2}
{% endhighlight %}

will echo the first two words following the script's name.

{% highlight bash %}
$ ./script.sh woah boy!
woah
boy!
$ 
{% endhighlight %}

Just like with regular Bash arrays, all elements of the argument array can be selected with `@`, and the number of arguments with `#`.

The following will echo all arguments supplied by the user:

{% highlight bash %}
#!/bin/bash

arguments=("$@")
length=("$#")

for (( i = 0; i < $length; i++ )) ;
do
  echo ${arguments[i]}
done
{% endhighlight %}

### A Jekyll Post Script

So, let's put all this together

{% highlight bash %}
#!/bin/bash

arguments=("$@")
length=("$#")

title=`date +%Y-%m-%d`

for (( i = 0; i < $length; i++ )); do
  title+=-${arguments[i]}
done
  
echo -e '---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n### Introduction' > $title.md
{% endhighlight %}

Walking through this:  First, grab the arguments array and its length.  Second, initialize a title with today's date.  Third, loop through the arguments array, adding elements to the title.  Last, echo a YAML header into a new file with the cobbled title.

{% highlight bash %}
$ ./blog.sh Awesome New Post
$ cat 2017-12-21-Awesome-New-Post.md
---
layout: post
title: 
excerpt: 
tags: []
---

### Introduction
$ 
{% endhighlight %}

Good work!  Now, go write some scripts.

