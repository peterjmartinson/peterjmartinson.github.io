#!/bin/bash

arguments=("$@")
length=("$#")

title=`date +%Y-%m-%d`

for (( i = 0; i < $length; i++ )); do
  title+=-${arguments[i]}
done
  
echo -e '---\nlayout: post\ntitle: \nexcerpt: \ntags: []\n---\n\n### Introduction' > $title.md
