#!/bin/bash

args=("$@")
len=("$#")

title=`date +%Y-%m-%d`

for (( i=0; i<$len; i++ )); do
  title+=-${args[i]}
done
  
# echo $'---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n## Introduction' > $title.md
echo '---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n## Introduction' > $title.md
